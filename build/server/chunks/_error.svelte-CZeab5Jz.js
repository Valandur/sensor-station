import { c as create_ssr_component, a as subscribe, v as validate_component } from './ssr-C0K3FAqp.js';
import { p as page } from './stores-C68s4Y3S.js';
import { E as ErrorCard } from './ErrorCard-DIXKcoSz.js';
import { P as PageTitle } from './PageTitle-CPBz7j5U.js';
import './client-CjdeEz1m.js';
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
  return `<div class="container-fluid h-100 overflow-auto p-2">${!embedded ? `${validate_component(PageTitle, "PageTitle").$$render($$result, { showReload: true }, {}, {
    default: () => {
      return `Server Error`;
    }
  })}` : ``} ${validate_component(ErrorCard, "ErrorCard").$$render($$result, { title, message, params }, {}, {})}</div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-CZeab5Jz.js.map
