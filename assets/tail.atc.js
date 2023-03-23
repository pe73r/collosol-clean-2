// window.fetch = new Proxy(window.fetch, {
//   async apply(fetch, that, args) {
//     console.log(args);
//     const []
//     const result = fetch.apply(that, args);
//     return result;
//   }
// });

defineCustomElement(
  "add-to-cart",
  class TailAtc extends HTMLElement {
    connectedCallback() {
      this.addEventListener("click", this.onAddToCart);
      this.bundle = this.getAttribute("data-bundle");
    }

    static get observedAttributes() {
      return ["data-quantity"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "data-quantity") {
        const price = this.getAttribute("data-price").replace("€", "").trim();
        const priceElement = this.querySelector("[data-price]");
        const priceStrokeElement = this.querySelector("[data-price-stroke]");
        if (price) {
          const newPrice = Number(newValue) * Number(price);
          priceElement.textContent = `${newPrice}€`;
        }
        if (priceStrokeElement) {
          const priceStroke = this.getAttribute("data-price-stroke").replace("€", "").trim();
          const newPriceStroke = Number(newValue) * Number(priceStroke);
          priceStrokeElement.textContent = `${newPriceStroke}€`;
        }
      }
    }

    toggleLoading = (loading) => {
      this.setAttribute("data-loading", String(loading));
      const button = this.querySelector("button");
      if (loading) {
        this.buttonContent = button.innerHTML;
        const { height } = button.getBoundingClientRect();
        const padding = window.getComputedStyle(button, null).getPropertyValue("padding-top");
        button.innerHTML = spinnerHtml(height - Number(padding.replace("px", "")) * 2);
      } else {
        button.innerHTML = this.buttonContent;
      }
    };

    getBundle = () => {
      const inputs = document.querySelectorAll(`product-quantity[data-bundle="${this.bundle}"] input`);

      const items = Array.from(inputs).map((input) => {
        const quantity = Number(input.value);
        const variantId = input.parentElement.getAttribute("data-variant");
        return { id: variantId, quantity };
      });

      return items.filter((item) => item.quantity > 0);
    };
    /**
     *
     * @param {MouseEvent} e
     */
    onAddToCart = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const lightReRender = this.getAttribute("data-lightReRender") === "true";
      const rechargeForm = document.querySelector(`#form-Recharge--${this.getAttribute("data-product")}`);

      this.toggleLoading(true);

      const item = {
        id: Number(this.getAttribute("data-variant")),
        quantity: Number(this.getAttribute("data-quantity") || 1),
        properties: {
          Flyer:
            this.getAttribute("data-product") == 7801463111926 ||
            this.getAttribute("data-product") == 7866215956726 ||
            this.getAttribute("data-product") == 7782048170230
              ? "Oui" 
              : "Non"
        }
      };

      if (rechargeForm) {
        const form = rechargeForm.querySelector('input[name="selling_plan"]');
        if (form?.value) {
          Object.assign(item, { selling_plan: Number(rechargeForm.querySelector('input[name="selling_plan"]').value) });
        }
      }

      const response = await await fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          items: this.bundle ? this.getBundle() : [item],
          sections: ["side-cart"],
          sections_url: window.location.pathname
        })
      })
        .then((r) => r.json())
        .catch((e) => {
          return { sections: [] };
        });
      const quantity = document.querySelector(`product-quantity[data-product="${this.getAttribute("data-product")}"]`);

      if (quantity) {
        quantity.quantity = 1;
        quantity.querySelector("input").value = 1;
      }
      if (Number(this.getAttribute("data-max-quantity") > 1)) {
        this.parentElement.setAttribute("aria-selected", "true");
      } else {
        const button = this.querySelector("button");
        button.disabled = true;
      }
      if (lightReRender) {
        reRenderCartIndicators(response.sections);
        reRenderLineItems(response.sections);
      } else {
        reRenderSections(["side-cart"], response.sections);
        setTimeout(() => {
          openSideCart();
        }, 1);
      }
      this.toggleLoading(false);
    };
  }
);

/**
 *
 * @param {HTMLElement} element
 */
const getAddToCart = (element) => {
  const productId = element.getAttribute("data-product");
  const addToCart = element.closest(`add-to-cart[data-product="${productId}"]`);
  return addToCart;
};

defineCustomElement(
  "product-variants",
  class TailAtc extends HTMLElement {
    connectedCallback() {
      this.addToCart = getAddToCart(this);
      const input = this.querySelector("input");
      input.addEventListener("change", this.onVariantChange);
    }
    /**
     *
     * @param {InputEvent} e
     */
    onVariantChange = (e) => {
      this.addToCart.setAttribute("data-variant", e.target.value);
    };
  }
);

defineCustomElement(
  "product-quantity",
  class TailAtc extends HTMLElement {
    quantity = 1;
    connectedCallback() {
      this.bundle = this.getAttribute("data-bundle");

      const buttons = Array.from(this.querySelectorAll("button"));

      if (buttons.length === 2) {
        return this.init(buttons);
      }
      const observerContainer = new MutationObserver(() => {
        const buttons = Array.from(this.querySelectorAll("button"));
        if (buttons.length === 2) {
          this.init(buttons);
          observerContainer.disconnect();
        }
      });

      observerContainer.observe(this, { childList: true });
    }

    init = (buttons) => {
      this.isInit = true;
      this.plus = this.querySelector('button[name="plus"]');
      this.minus = this.querySelector('button[name="minus"]');
      this.input = this.querySelector("input");
      this.maxQuantity = Number(this.getAttribute("data-max-quantity"));
      this.bundle = this.getAttribute("data-bundle");

      buttons.forEach((button) => button.addEventListener("click", this.onButtonClick));
      setTimeout(() => {
        if (this.bundle) {
          this.setBundlePrice();
        }
      }, 100);
    };

    onInputBlur = (e) => {
      let newQuantity = Number(e.target.value);

      if (this.quantity !== newQuantity) {
        if (newQuantity <= 0 || newQuantity > this.maxQuantity) {
          newQuantity = 1;
        }
        this.quantity = newQuantity;
        this.updateQuantity();
      }
    };
    onInputChange = (e) => {
      if (e.key === "Enter") {
        this.input.blur();
      }
    };
    onButtonClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.getAttribute("data-disabled") == "true") {
        return;
      }
      const { currentTarget } = e;
      if (this.quantity !== this.input.value) {
        this.quantity = Number(this.input.value);
      }

      const isMinus = currentTarget.getAttribute("name") === "minus";
      const atc_button = document.querySelector("#buy-buttons add-to-cart button");
      if (isMinus) {
        if (this.quantity > (this.bundle ? 0 : 1)) {
          this.quantity--;

          this.GTM_ATC(
            "remove_to_cart",
            this.quantity,
            atc_button.parentElement.dataset.price,
            atc_button.parentElement.dataset.discount,
            atc_button.parentElement.dataset.id,
            atc_button.parentElement.dataset.title,
            atc_button.parentElement.dataset.currency,
            atc_button.parentElement.dataset.collection
          );
        } else {
          return;
        }
      } else {
        if (this.quantity + 1 > this.maxQuantity) {
          return;
        }

        this.GTM_ATC(
          "add_to_cart",
          this.quantity,
          atc_button.parentElement.dataset.price,
          atc_button.parentElement.dataset.discount,
          atc_button.parentElement.dataset.id,
          atc_button.parentElement.dataset.title,
          atc_button.parentElement.dataset.currency,
          atc_button.parentElement.dataset.collection
        );

        this.quantity++;
      }
      this.updateQuantity();
    };

    GTM_ATC = (event, quantity, price, discount, title, id, currency, collection) => {
      if (this.bundle) {
        return;
      }

      dataLayer.push({
        event: event,
        ecommerce: {
          currency: collection,
          value: price * quantity,
          discount: discount * quantity,
          items: [
            {
              item_id: id,
              item_name: title,
              quantity: quantity,
              item_category: collection,
              price: price,
              item_discount: discount
            }
          ]
        }
      });
    };

    setBundlePrice = () => {
      const inputs = document.querySelectorAll(`product-quantity[data-bundle="${this.bundle}"] input`);
      const atc = document.querySelector(`add-to-cart[data-bundle="${this.bundle}"]`);

      const price = Array.from(inputs).reduce((acc, input) => {
        return parseInt(input.parentElement.getAttribute("data-price").replace("€", "")) * Number(input.value) + acc;
      }, 0);

      atc.querySelector("[data-price]").textContent = `${price}€`;
    };

    updateQuantity = () => {
      this.input.value = this.quantity;

      if (this.bundle) {
        this.setBundlePrice();
      } else {
        document
          .querySelectorAll(`product-quantity[data-product="${this.getAttribute("data-product")}"] input`)
          .forEach((input) => {
            input.value = this.quantity;
          });

        document
          .querySelectorAll(`add-to-cart[data-product="${this.getAttribute("data-product")}"]`)
          .forEach((element) => {
            element.setAttribute("data-quantity", String(this.quantity));
          });

        document.querySelector(`#form-Recharge--${this.getAttribute("data-product")} input[name="quantity"]`).value =
          this.quantity;
      }
    };
  }
);

defineCustomElement(
  "update-plan",
  class UpdatePlan extends HTMLElement {
    quantity = 1;
    connectedCallback() {
      return this.init();
    }

    init = () => {
      const productId = this.getAttribute("data-product");
      const plans = this.querySelectorAll("[data-plan-id]");
      plans.forEach((plan) => plan.addEventListener("click", this.onUpdatePlan));
    };

    toggleLoading = (elm, loading) => {
      this.setAttribute("data-loading", String(loading));
      if (loading) {
        this.buttonContent = elm.innerHTML;
        console.log(elm);
        const { height } = elm.getBoundingClientRect();
        const padding = window.getComputedStyle(elm, null).getPropertyValue("padding-top");
        elm.innerHTML = spinnerHtml(height - Number(padding.replace("px", "")) * 2);
      } else {
        elm.innerHTML = this.buttonContent;
      }
    };

    onUpdatePlan = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const { currentTarget } = e;
      this.toggleLoading(currentTarget, true);

      this.line = Number(currentTarget.getAttribute("data-index"));
      this.plan = Number(currentTarget.getAttribute("data-plan-id"));

      const response = await (
        await fetch("/cart/change.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            line: this.line,
            selling_plan: this.plan,
            sections: ["side-cart"],
            sections_url: window.location.pathname
          })
        })
      ).json();

      reRenderLineItems(response.sections);
    };
  }
);

const removeKdo = () => {
  const tailGift = document.querySelector("tail-gift");

  tailGift.onClick();
};

document.addEventListener('click', function(e) {
  var details = [...document.querySelectorAll('details.recharge_edit_container')];
  if (!details.some(f => f.contains(e.target))) {
    details.forEach(f => f.removeAttribute('open'));
  } else {
    details.forEach(f => !f.contains(e.target) ? f.removeAttribute('open') : '');
  }
})