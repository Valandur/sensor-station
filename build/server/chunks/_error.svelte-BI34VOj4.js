import { c as create_ssr_component, a as subscribe, v as validate_component } from './ssr-z3nJZMSi.js';
import { p as page } from './stores-U0OV2QDK.js';
import { E as ErrorCard } from './ErrorCard-aKekcC2K.js';
import { P as PageTitle } from './PageTitle-RKNcnoyo.js';
import './client-_MkdHwD5.js';
import './exports-mq_1S73-.js';

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
//# sourceMappingURL=_error.svelte-BI34VOj4.js.map
