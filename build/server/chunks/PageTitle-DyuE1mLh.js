import { c as create_ssr_component, d as escape, k as add_classes, b as add_attribute, l as getContext } from './ssr-DyNlIM9y.js';
import './exports-DuWZopOC.js';

function get(key, parse = JSON.parse) {
  try {
    return parse(sessionStorage[key]);
  } catch {
  }
}
const SNAPSHOT_KEY = "sveltekit:snapshot";
const SCROLL_KEY = "sveltekit:scroll";
get(SCROLL_KEY) ?? {};
get(SNAPSHOT_KEY) ?? {};
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
const navigating = {
  subscribe(fn) {
    const store = getStores().navigating;
    return store.subscribe(fn);
  }
};
const ErrorCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let numParams;
  let { title = null } = $$props;
  let { message } = $$props;
  let { params = null } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  if ($$props.params === void 0 && $$bindings.params && params !== void 0)
    $$bindings.params(params);
  numParams = params ? Object.keys(params).length : 0;
  return `<div class="alert alert-danger m-0">${title ? `<h4 class="alert-heading">${escape(title)}</h4>` : ``} <p${add_classes((numParams === 0 ? "mb-0" : "").trim())}>${escape(message || "")}</p> ${numParams > 0 ? `<pre class="bg-dark text-white mb-0"><code>${escape(JSON.stringify(params, null, 2))}</code></pre>` : ``}</div>`;
});
const PageTitle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { showReload = false } = $$props;
  let { closeUrl = "/" } = $$props;
  if ($$props.showReload === void 0 && $$bindings.showReload && showReload !== void 0)
    $$bindings.showReload(showReload);
  if ($$props.closeUrl === void 0 && $$bindings.closeUrl && closeUrl !== void 0)
    $$bindings.closeUrl(closeUrl);
  return `<div class="row z-1"><div class="col-auto"><h1>${slots.default ? slots.default({}) : ``}</h1></div> <div class="col align-self-center text-secondary">${slots.center ? slots.center({}) : ``}</div> <div class="col-auto">${showReload ? `<button class="btn btn-sm btn-theme" data-svelte-h="svelte-1llg8x1"><i class="icofont-refresh"></i></button>` : ``} <a class="btn btn-sm btn-danger"${add_attribute("href", closeUrl, 0)}><i class="icofont-ui-close"></i></a></div></div>`;
});

export { ErrorCard as E, PageTitle as P, navigating as n, page as p };
//# sourceMappingURL=PageTitle-DyuE1mLh.js.map
