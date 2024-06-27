import { c as create_ssr_component, a as subscribe, v as validate_component } from './ssr-DyNlIM9y.js';
import { p as page, P as PageTitle, E as ErrorCard } from './PageTitle-B405bhzV.js';
import './exports-DuWZopOC.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let embedded;
  let title;
  let message;
  let params;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  embedded = $page.error?.embedded;
  title = $page.route.id;
  message = $page.error?.message;
  params = $page.error?.params;
  $$unsubscribe_page();
  return `<div class="container-fluid h-100 overflow-auto py-1">${!embedded ? `${validate_component(PageTitle, "PageTitle").$$render($$result, { showReload: true, closeUrl: "/services" }, {}, {
    default: () => {
      return `Server Error`;
    }
  })}` : ``} ${validate_component(ErrorCard, "ErrorCard").$$render($$result, { title, message, params }, {}, {})}</div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-B0KGBIMq.js.map
