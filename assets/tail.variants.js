defineCustomElement(
  "tail-variants",
  class Variants extends HTMLElement {
    isInit = false;
    constructor() {
      super();
      this.addEventListener("click", this.onClick);
    }

    getSelectedOptions = () => {};
    init = () => {
      const selects = Array.from(this.querySelectorAll("select"));
      const inputs = Array.from(this.querySelectorAll("input"));
      this.atcs = document.querySelectorAll(`add-to-cart[data-product="${this.getAttribute("data-product")}"]`);
      this.variants = JSON.parse(this.querySelector("#product-variants").innerHTML);

      console.log(this.variants, this.atc);
      selects.concat(inputs).forEach((element) => {
        element.addEventListener("change", this.onChange);
      });

      this.isInit = true;
    };

    /**
     * @param {ChangeEvent} e
     */
    onChange = (e) => {
      const value = e.target.value;
      if (this.atcs && this.atcs.length) {
        const position = e.target.getAttribute("data-position");
        const newState = Array.from(this.querySelectorAll("input:checked")).reduce((acc, input) => {
          const inputPosition = input.getAttribute("data-position");
          acc[Number(inputPosition) - 1] = position === inputPosition ? value : input.value;
          return acc;
        }, []);

        const variant = this.variants.find((variant) => {
          return JSON.stringify(variant.options) === JSON.stringify(newState);
        });

        const price = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        });
        const quantity = Number(this.atcs[0].getAttribute("data-quantity")) || 1;

        document.querySelectorAll("[data-dynamic-price]").forEach(
          (element) =>
            (element.textContent =
              price
                .format((variant.price * quantity) / 100)
                .replace("€", "")
                .trim() + "€")
        );
        if (variant) {
          if (variant.featured_image) {
            const variantImg = variant.featured_image.src.split("v=")[1];
            document.querySelectorAll("carousel-dot").forEach((element) => {
              const img = element.querySelector("img");
              if (!img) {
                return;
              }

              if (String(img.src).includes(variantImg)) {
                element.click();
              }
            });
          }
        }
        console.log(this.atcs);
        this.atcs.forEach((atc) => {
          atc.setAttribute("data-variant", String(variant.id));
          atc.setAttribute("data-price", variant.price / 100);
        });
      }
    };

    onClick = () => {
      console.log("init");
      if (!this.isInit) {
        console.log("init");
        this.init();
      }
    };
  }
);
