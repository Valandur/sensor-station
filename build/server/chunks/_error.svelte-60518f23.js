import { c as create_ssr_component, a as subscribe, v as validate_component } from './ssr-966767de.js';
import { p as page } from './stores-24c0dcda.js';
import { E as ErrorCard } from './ErrorCard-37fd4fbb.js';
import { P as PageTitle } from './PageTitle-683f9af8.js';

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
  return `<div class="container-fluid h-100 overflow-auto p-2">${!embedded ? `${validate_component(PageTitle, "PageTitle").$$render($$result, { showReload: true }, {}, {
    default: () => {
      return `Server Error`;
    }
  })}` : ``} ${validate_component(ErrorCard, "ErrorCard").$$render($$result, { title, message, params }, {}, {})}</div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-60518f23.js.map
