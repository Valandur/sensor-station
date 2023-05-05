import { c as create_ssr_component, a as subscribe, e as escape } from './index3-5519d9f6.js';
import { p as page } from './stores-0228d736.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let pageName;
  let embedded;
  let errorMessage;
  let params;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  pageName = $page.route.id;
  embedded = $page.error?.embedded;
  errorMessage = $page.error?.message;
  params = $page.error?.params;
  $$unsubscribe_page();
  return `<div class="${"container-fluid m-0 " + escape(embedded ? "p-0" : "p-2", true) + " d-flex flex-column"}">${!embedded ? `<div class="row"><div class="col"><h1>Server Error</h1></div>
			<div class="col-auto"><a class="btn btn-sm btn-danger" href="/"><i class="icofont-ui-close"></i></a></div></div>` : ``}

	<div class="alert alert-danger">${pageName ? `<h4 class="alert-heading">${escape(pageName)}</h4>` : ``}
		<p>${escape(errorMessage)}</p>
		${params ? `<pre class="bg-dark text-white mb-0"><code>${escape(JSON.stringify(params, null, 2))}</code></pre>` : ``}</div></div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-ac1efc01.js.map
