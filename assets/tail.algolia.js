function defineCustomElemen(name, component) {
  customElements.define(name, component);
}
function debounc(callback, time) {
  var timeout = 0;
  return function () {
    window.clearTimeout(timeout), (timeout = window.setTimeout(callback, time) || 0);
  };
}
const regexpMustache = /--([\:\/\-\\\,\.a-zA-Z0-9\s])*--/g;
const mustaching = (string, variables) => {
  if (!variables) return string.replace(regexpMustache, "");
  Object.keys(variables).forEach((option) => {
    string = string.replace(new RegExp(`--${option}--`, "g"), String(variables[option]));
  });
  return string.replace(regexpMustache, "");
};
const indicesToType = {
  shopify_products: "Produit",
  shopify_pages: "Conseils",
  shopify_articles: "Blog",
  shopify_collections: "Collection"
};
const indicesFilters = {
  shopify_products: undefined,
  shopify_pages: undefined,
  shopify_articles: `NOT tags:"recettes"`,
  shopify_collections: undefined
};
const indicesToPath = {
  shopify_products: "products",
  shopify_pages: "pages",
  shopify_articles: "articles",
  shopify_collections: "collections"
};

defineCustomElemen(
  "tail-instant-search",
  class AIS extends HTMLElement {
    query = "";
    indices = {
      shopify_products: true,
      shopify_pages: true,
      shopify_articles: true,
      shopify_collections: true
    };
    connectedCallback() {
      const head = document.head;
      if (!head.innerHTML.includes("algoliasearch-lite.umd.js")) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/algoliasearch@4.14.2/dist/algoliasearch-lite.umd.js";
        // script.integrity = "sha256-dImjLPUsG/6p3+i7gVKBiDM8EemJAhQ0VvkRK2pVsQY="
        // script.anonymous = "anonymous"
        script.loading = "lazy";
        script.onload = this.onLoad;
        head.appendChild(script);
      }
    }

    onLoad = () => {
      this.searchClient = algoliasearch("ZCV12LGBCI", "3a37d22864272c280cd62fd365f48fa4");
      this.productsIndex = this.searchClient.initIndex("shopify_products");
      this.pagesIndex = this.searchClient.initIndex("shopify_pages");
      this.articlesIndex = this.searchClient.initIndex("shopify_articles");
      this.collectionsIndex = this.searchClient.initIndex("shopify_collections");
      this.content = this.querySelector("drawer-inner ul");
      this.template = this.querySelector("script").innerHTML;
      this.buttons = this.querySelectorAll("button");
      this.buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const selected = button.getAttribute("aria-selected") === "true";
          const index = button.getAttribute("data-index");

          e.preventDefault();
          e.stopPropagation();

          if (Object.values(this.indices).every((value) => value)) {
            this.buttons.forEach((button) => {
              button.setAttribute("aria-selected", String(false));
            });
            Object.keys(this.indices).forEach((index) => {
              this.indices[index] = false;
            });
            this.indices[index] = true;
            button.setAttribute("aria-selected", String(true));
          } else {
            this.indices[index] = !selected;
            button.setAttribute("aria-selected", String(!selected));
          }

          this.search();
        });
      });
      autoAnimate(this.content);

      //   this.searchClient.search(indices.map((indexName) => ({ indexName, query }))).then((data) => {
      //     results = data.results;
      // });

      this.querySelector("input").addEventListener("input", (e) => {
        // if (this.query?.trim() === e.target.value) {
        //   return;
        // }
        this.query = e.target.value;

        this.searchDebouncer();
      });
    };

    searchDebouncer = debounc(() => this.search(), 200);
    search = () => {
      if (this.query.length === 0) {
        this.content.innerHTML = "";
        this.querySelectorAll(`[data-index]`).forEach((element) => {
          element.querySelector("span").innerHTML = ``;
        });
        return;
      }

      this.searchClient
        .search(
          Object.keys(indicesToType).map((indexName) => ({
            indexName,
            query: this.query,
            filters: indicesFilters[indexName]
          }))
        )
        .then((data) => {
          let elements = [];
          let uniques = [];

          const resultsCount = data.results.reduce((acc, { hits }) => acc + hits.length, 0);

          if (resultsCount === 0) {
            const noResult = document.createElement("div");
            noResult.textContent = `Aucun résultat pour "${this.query}"`;
            this.content.appendChild(noResult);
            return;
          }
          data.results.forEach(({ hits, index }) => {
            this.querySelector(`[data-index="${index}"]`).querySelector("span").innerHTML = `(${hits.length})`;
            hits.forEach((hit) => {
              if (uniques[hit.id] && index === "shopify_products") {
                return;
              }

              Object.assign(uniques, { [hit.id]: true });

              const previousElement = this.content.querySelector(`[data-id="${hit.objectID}"]`);

              if (previousElement && this.indices[index]) {
                elements.push(previousElement);
                return;
              }

              const element = document.createElement("li");

              const parseDate = (date) => {
                const int = new Intl.DateTimeFormat("fr-FR", {
                  dateStyle: "long"
                });
                return int.format(new Date(date));
              };
              const formatPrice = (price) => {
                const int = new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
                });
                return int.format(Number(price));
              };
              element.innerHTML = mustaching(this.template, {
                url: hit.blog ? `/blogs/${hit.blog.handle}/${hit.handle}` : `/${indicesToPath[index]}/${hit.handle}`,
                image: hit.image,
                type: indicesToType[index],
                title: hit.title,
                id: hit.objectID,
                ...(["shopify_articles", "shopify_pages"].includes(index)
                  ? { date: parseDate(hit.created_at) }
                  : index === "shopify_products"
                  ? {
                      price: formatPrice(hit.variants_min_price)
                    }
                  : {})
              });

              if (!hit.image) {
                element.querySelector("img").remove();
              }

              const buildTags = (tags) => {
                tags.forEach((tag) => {
                  const tagElement = document.createElement("div");
                  tagElement.classList.add("rounded-full", "bg-gray-200", "text-gray-700", "px-1", "py-0.5", "text-xs");
                  tagElement.innerHTML = `${tag.toLowerCase()}`;
                  element.querySelector("[data-tags]").appendChild(tagElement);
                });
              };
              if (index === "shopify_products") {
                const tags = Object.values(hit.meta.custom || {})
                  .map(JSON.parse)
                  .flat()
                  .map((t) => t.split(","))
                  .flat();
                // buildTags(tags);
              }
              if (index === "shopify_articles") {
                // buildTags(hit.tags);
              }
              if (index === "shopify_pages") {
                // buildTags([hit.template_suffix]);
              }
              if (this.indices[index]) {
                elements.push(element);
              } else {
                console.log("not refined", index, this.indices[index]);
              }
            });
          });
          this.content.innerHTML = "";
          elements.forEach((element) => {
            this.content.appendChild(element);
          });
        });
    };
  }
);

/**
 * A set of all the parents currently being observe. This is the only non weak
 * registry.
 */
const parents = new Set();
/**
 * Element coordinates that is constantly kept up to date.
 */
const coords = new WeakMap();
/**
 * Siblings of elements that have been removed from the dom.
 */
const siblings = new WeakMap();
/**
 * Animations that are currently running.
 */
const animations = new WeakMap();
/**
 * A map of existing intersection observers used to track element movements.
 */
const intersections = new WeakMap();
/**
 * Intervals for automatically checking the position of elements occasionally.
 */
const intervals = new WeakMap();
/**
 * The configuration options for each group of elements.
 */
const options = new WeakMap();
/**
 * Debounce counters by id, used to debounce calls to update positions.
 */
const debounces = new WeakMap();
/**
 * All parents that are currently enabled are tracked here.
 */
const enabled = new WeakSet();
/**
 * The document used to calculate transitions.
 */
let root;
/**
 * Used to sign an element as the target.
 */
const TGT = "__aa_tgt";
/**
 * Used to sign an element as being part of a removal.
 */
const DEL = "__aa_del";
/**
 * Callback for handling all mutations.
 * @param mutations - A mutation list
 */
const handleMutations = (mutations) => {
  const elements = getElements(mutations);
  // If elements is "false" that means this mutation that should be ignored.
  if (elements) {
    elements.forEach((el) => animate(el));
  }
};
/**
 *
 * @param entries - Elements that have been resized.
 */
const handleResizes = (entries) => {
  entries.forEach((entry) => {
    if (entry.target === root) updateAllPos();
    if (coords.has(entry.target)) updatePos(entry.target);
  });
};
/**
 * Observe this elements position.
 * @param el - The element to observe the position of.
 */
function observePosition(el) {
  const oldObserver = intersections.get(el);
  oldObserver === null || oldObserver === void 0 ? void 0 : oldObserver.disconnect();
  let rect = coords.get(el);
  let invocations = 0;
  const buffer = 5;
  if (!rect) {
    rect = getCoords(el);
    coords.set(el, rect);
  }
  const { offsetWidth, offsetHeight } = root;
  const rootMargins = [
    rect.top - buffer,
    offsetWidth - (rect.left + buffer + rect.width),
    offsetHeight - (rect.top + buffer + rect.height),
    rect.left - buffer
  ];
  const rootMargin = rootMargins.map((px) => `${-1 * Math.floor(px)}px`).join(" ");
  const observer = new IntersectionObserver(
    () => {
      ++invocations > 1 && updatePos(el);
    },
    {
      root,
      threshold: 1,
      rootMargin
    }
  );
  observer.observe(el);
  intersections.set(el, observer);
}
/**
 * Update the exact position of a given element.
 * @param el - An element to update the position of.
 */
function updatePos(el) {
  clearTimeout(debounces.get(el));
  const optionsOrPlugin = getOptions(el);
  const delay = typeof optionsOrPlugin === "function" ? 500 : optionsOrPlugin.duration;
  debounces.set(
    el,
    setTimeout(async () => {
      const currentAnimation = animations.get(el);
      if (!currentAnimation || (await currentAnimation.finished)) {
        coords.set(el, getCoords(el));
        observePosition(el);
      }
    }, delay)
  );
}
/**
 * Updates all positions that are currently being tracked.
 */
function updateAllPos() {
  clearTimeout(debounces.get(root));
  debounces.set(
    root,
    setTimeout(() => {
      parents.forEach((parent) => forEach(parent, (el) => lowPriority(() => updatePos(el))));
    }, 100)
  );
}
/**
 * Its possible for a quick scroll or other fast events to get past the
 * intersection observer, so occasionally we need want "cold-poll" for the
 * latests and greatest position. We try to do this in the most non-disruptive
 * fashion possible. First we only do this ever couple seconds, staggard by a
 * random offset.
 * @param el - Element
 */
function poll(el) {
  setTimeout(() => {
    intervals.set(
      el,
      setInterval(() => lowPriority(updatePos.bind(null, el)), 2000)
    );
  }, Math.round(2000 * Math.random()));
}
/**
 * Perform some operation that is non critical at some point.
 * @param callback
 */
function lowPriority(callback) {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(() => callback());
  } else {
    requestAnimationFrame(() => callback());
  }
}
/**
 * The mutation observer responsible for watching each root element.
 */
let mutations;
/**
 * A resize observer, responsible for recalculating elements on resize.
 */
let resize;
/**
 * If this is in a browser, initialize our Web APIs
 */
if (typeof window !== "undefined") {
  root = document.documentElement;
  mutations = new MutationObserver(handleMutations);
  resize = new ResizeObserver(handleResizes);
  resize.observe(root);
}
/**
 * Retrieves all the elements that may have been affected by the last mutation
 * including ones that have been removed and are no longer in the DOM.
 * @param mutations - A mutation list.
 * @returns
 */
function getElements(mutations) {
  const observedNodes = mutations.reduce((nodes, mutation) => {
    return [...nodes, ...Array.from(mutation.addedNodes), ...Array.from(mutation.removedNodes)];
  }, []);
  // Short circuit if _only_ comment nodes are observed
  const onlyCommentNodesObserved = observedNodes.every((node) => node.nodeName === "#comment");
  if (onlyCommentNodesObserved) return false;
  return mutations.reduce((elements, mutation) => {
    // Short circuit if we find a purposefully deleted node.
    if (elements === false) return false;
    if (mutation.target instanceof Element) {
      target(mutation.target);
      if (!elements.has(mutation.target)) {
        elements.add(mutation.target);
        for (let i = 0; i < mutation.target.children.length; i++) {
          const child = mutation.target.children.item(i);
          if (!child) continue;
          if (DEL in child) return false;
          target(mutation.target, child);
          elements.add(child);
        }
      }
      if (mutation.removedNodes.length) {
        for (let i = 0; i < mutation.removedNodes.length; i++) {
          const child = mutation.removedNodes[i];
          if (DEL in child) return false;
          if (child instanceof Element) {
            elements.add(child);
            target(mutation.target, child);
            siblings.set(child, [mutation.previousSibling, mutation.nextSibling]);
          }
        }
      }
    }
    return elements;
  }, new Set());
}
/**
 * Assign the target to an element.
 * @param el - The root element
 * @param child
 */
function target(el, child) {
  if (!child && !(TGT in el)) Object.defineProperty(el, TGT, { value: el });
  else if (child && !(TGT in child)) Object.defineProperty(child, TGT, { value: el });
}
/**
 * Determines what kind of change took place on the given element and then
 * performs the proper animation based on that.
 * @param el - The specific element to animate.
 */
function animate(el) {
  var _a;
  const isMounted = root.contains(el);
  const preExisting = coords.has(el);
  if (isMounted && siblings.has(el)) siblings.delete(el);
  if (animations.has(el)) {
    (_a = animations.get(el)) === null || _a === void 0 ? void 0 : _a.cancel();
  }
  if (preExisting && isMounted) {
    remain(el);
  } else if (preExisting && !isMounted) {
    remove(el);
  } else {
    add(el);
  }
}
/**
 * Removes all non-digits from a string and casts to a number.
 * @param str - A string containing a pixel value.
 * @returns
 */
function raw(str) {
  return Number(str.replace(/[^0-9.\-]/g, ""));
}
/**
 * Get the coordinates of elements adjusted for scroll position.
 * @param el - Element
 * @returns
 */
function getCoords(el) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height
  };
}
/**
 * Returns the width/height that the element should be transitioned between.
 * This takes into account box-sizing.
 * @param el - Element being animated
 * @param oldCoords - Old set of Coordinates coordinates
 * @param newCoords - New set of Coordinates coordinates
 * @returns
 */
function getTransitionSizes(el, oldCoords, newCoords) {
  let widthFrom = oldCoords.width;
  let heightFrom = oldCoords.height;
  let widthTo = newCoords.width;
  let heightTo = newCoords.height;
  const styles = getComputedStyle(el);
  const sizing = styles.getPropertyValue("box-sizing");
  if (sizing === "content-box") {
    const paddingY =
      raw(styles.paddingTop) + raw(styles.paddingBottom) + raw(styles.borderTopWidth) + raw(styles.borderBottomWidth);
    const paddingX =
      raw(styles.paddingLeft) + raw(styles.paddingRight) + raw(styles.borderRightWidth) + raw(styles.borderLeftWidth);
    widthFrom -= paddingX;
    widthTo -= paddingX;
    heightFrom -= paddingY;
    heightTo -= paddingY;
  }
  return [widthFrom, widthTo, heightFrom, heightTo].map(Math.round);
}
/**
 * Retrieves animation options for the current element.
 * @param el - Element to retrieve options for.
 * @returns
 */
function getOptions(el) {
  return TGT in el && options.has(el[TGT]) ? options.get(el[TGT]) : { duration: 250, easing: "ease-in-out" };
}
/**
 * Returns the target of a given animation (generally the parent).
 * @param el - An element to check for a target
 * @returns
 */
function getTarget(el) {
  if (TGT in el) return el[TGT];
  return undefined;
}
/**
 * Checks if animations are enabled or disabled for a given element.
 * @param el - Any element
 * @returns
 */
function isEnabled(el) {
  const target = getTarget(el);
  return target ? enabled.has(target) : false;
}
/**
 * Iterate over the children of a given parent.
 * @param parent - A parent element
 * @param callback - A callback
 */
function forEach(parent, ...callbacks) {
  callbacks.forEach((callback) => callback(parent, options.has(parent)));
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children.item(i);
    if (child) {
      callbacks.forEach((callback) => callback(child, options.has(child)));
    }
  }
}
/**
 * The element in question is remaining in the DOM.
 * @param el - Element to flip
 * @returns
 */
function remain(el) {
  const oldCoords = coords.get(el);
  const newCoords = getCoords(el);
  if (!isEnabled(el)) return coords.set(el, newCoords);
  let animation;
  if (!oldCoords) return;
  const pluginOrOptions = getOptions(el);
  if (typeof pluginOrOptions !== "function") {
    const deltaX = oldCoords.left - newCoords.left;
    const deltaY = oldCoords.top - newCoords.top;
    const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(el, oldCoords, newCoords);
    const start = {
      transform: `translate(${deltaX}px, ${deltaY}px)`
    };
    const end = {
      transform: `translate(0, 0)`
    };
    if (widthFrom !== widthTo) {
      start.width = `${widthFrom}px`;
      end.width = `${widthTo}px`;
    }
    if (heightFrom !== heightTo) {
      start.height = `${heightFrom}px`;
      end.height = `${heightTo}px`;
    }
    animation = el.animate([start, end], {
      duration: pluginOrOptions.duration,
      easing: pluginOrOptions.easing
    });
  } else {
    animation = new Animation(pluginOrOptions(el, "remain", oldCoords, newCoords));
    animation.play();
  }
  animations.set(el, animation);
  coords.set(el, newCoords);
  animation.addEventListener("finish", updatePos.bind(null, el));
}
/**
 * Adds the element with a transition.
 * @param el - Animates the element being added.
 */
function add(el) {
  const newCoords = getCoords(el);
  coords.set(el, newCoords);
  const pluginOrOptions = getOptions(el);
  if (!isEnabled(el)) return;
  let animation;
  if (typeof pluginOrOptions !== "function") {
    animation = el.animate(
      [
        { transform: "scale(.98)", opacity: 0 },
        { transform: "scale(0.98)", opacity: 0, offset: 0.5 },
        { transform: "scale(1)", opacity: 1 }
      ],
      {
        duration: pluginOrOptions.duration * 1.5,
        easing: "ease-in"
      }
    );
  } else {
    animation = new Animation(pluginOrOptions(el, "add", newCoords));
    animation.play();
  }
  animations.set(el, animation);
  animation.addEventListener("finish", updatePos.bind(null, el));
}
/**
 * Animates the removal of an element.
 * @param el - Element to remove
 */
function remove(el) {
  var _a;
  if (!siblings.has(el) || !coords.has(el)) return;
  const [prev, next] = siblings.get(el);
  Object.defineProperty(el, DEL, { value: true });
  if (next && next.parentNode && next.parentNode instanceof Element) {
    next.parentNode.insertBefore(el, next);
  } else if (prev && prev.parentNode) {
    prev.parentNode.appendChild(el);
  } else {
    (_a = getTarget(el)) === null || _a === void 0 ? void 0 : _a.appendChild(el);
  }
  function cleanUp() {
    var _a;
    el.remove();
    coords.delete(el);
    siblings.delete(el);
    animations.delete(el);
    (_a = intersections.get(el)) === null || _a === void 0 ? void 0 : _a.disconnect();
  }
  if (!isEnabled(el)) return cleanUp();
  const [top, left, width, height] = deletePosition(el);
  const optionsOrPlugin = getOptions(el);
  const oldCoords = coords.get(el);
  let animation;
  Object.assign(el.style, {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`,
    margin: 0,
    pointerEvents: "none",
    transformOrigin: "center",
    zIndex: 100
  });
  if (typeof optionsOrPlugin !== "function") {
    animation = el.animate(
      [
        {
          transform: "scale(1)",
          opacity: 1
        },
        {
          transform: "scale(.98)",
          opacity: 0
        }
      ],
      { duration: optionsOrPlugin.duration, easing: "ease-out" }
    );
  } else {
    animation = new Animation(optionsOrPlugin(el, "remove", oldCoords));
    animation.play();
  }
  animations.set(el, animation);
  animation.addEventListener("finish", cleanUp);
}
function deletePosition(el) {
  const oldCoords = coords.get(el);
  const [width, , height] = getTransitionSizes(el, oldCoords, getCoords(el));
  let offsetParent = el.parentElement;
  while (
    offsetParent &&
    (getComputedStyle(offsetParent).position === "static" || offsetParent instanceof HTMLBodyElement)
  ) {
    offsetParent = offsetParent.parentElement;
  }
  if (!offsetParent) offsetParent = document.body;
  const parentStyles = getComputedStyle(offsetParent);
  const parentCoords = coords.get(offsetParent) || getCoords(offsetParent);
  const top = Math.round(oldCoords.top - parentCoords.top) - raw(parentStyles.borderTopWidth);
  const left = Math.round(oldCoords.left - parentCoords.left) - raw(parentStyles.borderLeftWidth);
  return [top, left, width, height];
}
/**
 * A function that automatically adds animation effects to itself and its
 * immediate children. Specifically it adds effects for adding, moving, and
 * removing DOM elements.
 * @param el - A parent element to add animations to.
 * @param options - An optional object of options.
 */
function autoAnimate(el, config = {}) {
  if (mutations && resize) {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isDisabledDueToReduceMotion =
      mediaQuery.matches && typeof config !== "function" && !config.disrespectUserMotionPreference;
    if (!isDisabledDueToReduceMotion) {
      enabled.add(el);
      if (getComputedStyle(el).position === "static") {
        Object.assign(el.style, { position: "relative" });
      }
      forEach(el, updatePos, poll, (element) =>
        resize === null || resize === void 0 ? void 0 : resize.observe(element)
      );
      if (typeof config === "function") {
        options.set(el, config);
      } else {
        options.set(el, { duration: 250, easing: "ease-in-out", ...config });
      }
      mutations.observe(el, { childList: true });
      parents.add(el);
    }
  }
  return Object.freeze({
    parent: el,
    enable: () => {
      enabled.add(el);
    },
    disable: () => {
      enabled.delete(el);
    },
    isEnabled: () => enabled.has(el)
  });
}
/**
 * The vue directive.
 */
const vAutoAnimate = {
  mounted: (el, binding) => {
    autoAnimate(el, binding.value || {});
  }
};
