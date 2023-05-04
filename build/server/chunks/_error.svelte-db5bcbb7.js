import { c as create_ssr_component, a as subscribe, e as escape } from './index3-00641961.js';
import { p as page } from './stores-35031152.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column"><div class="row"><div class="col-auto"><h1>Battery</h1></div>
		<div class="col-auto"><a class="btn btn-sm btn-outline-danger" href="/"><i class="icofont-ui-close"></i></a></div></div>

	<div class="alert alert-danger m-2"><h4 class="alert-heading">Error</h4>
		<p>${escape($page.error?.message)}</p></div></div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-db5bcbb7.js.map
