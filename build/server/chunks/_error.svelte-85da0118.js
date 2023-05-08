import { c as create_ssr_component, a as subscribe, v as validate_component } from './index3-53157c6f.js';
import { p as page } from './stores-08684bc6.js';
import { E as ErrorCard } from './ErrorCard-0b0d487c.js';
import { P as PageTitle } from './PageTitle-384e246f.js';

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
  })}` : ``}

	${validate_component(ErrorCard, "ErrorCard").$$render($$result, { title, message, params }, {}, {})}</div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-85da0118.js.map
