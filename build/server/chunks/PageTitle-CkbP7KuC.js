import { c as create_ssr_component, b as add_attribute, d as escape, k as add_classes, l as getContext } from './ssr-3oCpS140.js';
import { o as onMount } from './ssr2-CFA0VoKj.js';

const is_legacy = onMount.toString().includes("$$") || /function \w+\(\) \{\}/.test(onMount.toString());
if (is_legacy) {
  ({
    url: new URL("https://example.com")
  });
}
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
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0) $$bindings.message(message);
  if ($$props.params === void 0 && $$bindings.params && params !== void 0) $$bindings.params(params);
  numParams = params ? Object.keys(params).length : 0;
  return `<div class="alert alert-danger alert-dismissable fade show p-2"><div class="row"><div class="col">${title ? `<h4 class="alert-heading">${escape(title)}</h4>` : ``} <p${add_classes((numParams === 0 ? "mb-0" : "").trim())}>${escape(message || "")}</p> ${numParams > 0 ? `<pre class="bg-dark text-white mb-0"><code>${escape(JSON.stringify(params, null, 2))}</code></pre>` : ``}</div> <div class="col-auto d-flex flex-column" data-svelte-h="svelte-1uegyy"><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div></div></div>`;
});
const PageTitle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { showReload = false } = $$props;
  let { closeUrl = "/" } = $$props;
  if ($$props.showReload === void 0 && $$bindings.showReload && showReload !== void 0) $$bindings.showReload(showReload);
  if ($$props.closeUrl === void 0 && $$bindings.closeUrl && closeUrl !== void 0) $$bindings.closeUrl(closeUrl);
  return `<div class="row z-1"><div class="col-auto"><h1>${slots.default ? slots.default({}) : ``}</h1></div> <div class="col align-self-center text-secondary">${slots.center ? slots.center({}) : ``}</div> <div class="col-auto">${showReload ? `<button class="btn btn-sm btn-theme" data-svelte-h="svelte-1tb254v"><i class="fa-solid fa-rotate fa-lg"></i></button>` : ``} <a class="btn btn-sm btn-danger"${add_attribute("href", closeUrl, 0)}><i class="fa-solid fa-xmark fa-xl"></i></a></div></div>`;
});

export { ErrorCard as E, PageTitle as P, navigating as n, page as p };
//# sourceMappingURL=PageTitle-CkbP7KuC.js.map
