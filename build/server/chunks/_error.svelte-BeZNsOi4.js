import { c as create_ssr_component, a as subscribe, v as validate_component } from './ssr-C0K3FAqp.js';
import { p as page } from './stores-C68s4Y3S.js';
import { E as ErrorCard } from './ErrorCard-DIXKcoSz.js';
import './client-CjdeEz1m.js';
import './exports-DuWZopOC.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let title;
  let message;
  let params;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  title = $page.route.id?.replace("/screens/", "");
  message = $page.error?.message;
  params = $page.error?.params;
  $$unsubscribe_page();
  return `<div class="container-fluid h-100 overflow-auto p-2">${validate_component(ErrorCard, "ErrorCard").$$render($$result, { title, message, params }, {}, {})}</div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-BeZNsOi4.js.map
