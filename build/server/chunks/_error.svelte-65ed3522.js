import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component } from './index3-00641961.js';
import { p as page } from './stores-35031152.js';
import { E as ErrorCard } from './ErrorCard-4bb81626.js';

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
  return `<div class="${"container-fluid vh-100 d-flex flex-column " + escape(embedded ? "p-0" : "p-2", true)}">${!embedded ? `<div class="row"><div class="col"><h1>Server Error</h1></div>
			<div class="col-auto"><a class="btn btn-sm btn-danger" href="/"><i class="icofont-ui-close"></i></a></div></div>` : ``}

	${validate_component(ErrorCard, "ErrorCard").$$render($$result, { title, message, params }, {}, {})}</div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-65ed3522.js.map
