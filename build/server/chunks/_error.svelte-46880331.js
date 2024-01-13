import { c as create_ssr_component, a as subscribe, v as validate_component } from './ssr-4574e5c0.js';
import { p as page } from './stores-82cb41bc.js';
import { E as ErrorCard } from './ErrorCard-f4a9d030.js';

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
//# sourceMappingURL=_error.svelte-46880331.js.map
