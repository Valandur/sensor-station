import { c as create_ssr_component, a as subscribe, v as validate_component } from './index3-00641961.js';
import { p as page } from './stores-35031152.js';
import { E as ErrorCard } from './ErrorCard-4bb81626.js';
import { P as PageTitle } from './PageTitle-cbb73582.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let message;
  let params;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  message = $page.error?.message;
  params = $page.error?.params;
  $$unsubscribe_page();
  return `<div class="container-fluid vh-100 d-flex flex-column p-1">${validate_component(PageTitle, "PageTitle").$$render($$result, { showReload: true }, {}, {
    default: () => {
      return `Battery`;
    }
  })}
	${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message, params }, {}, {})}</div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-d34b0d8f.js.map
