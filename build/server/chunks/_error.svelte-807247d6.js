import { c as create_ssr_component, a as subscribe, e as escape } from './index3-00641961.js';
import { p as page } from './stores-35031152.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let pageName;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  pageName = $page.route.id?.substring($page.route.id.indexOf("/screens") + 8);
  $$unsubscribe_page();
  return `<div class="alert alert-danger m-2"><h4 class="alert-heading">Error in ${escape(pageName)}</h4>
	<p>${escape($page.error?.message)}</p></div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-807247d6.js.map
