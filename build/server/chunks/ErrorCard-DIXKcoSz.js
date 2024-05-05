import { c as create_ssr_component, e as escape } from './ssr-C0K3FAqp.js';

const ErrorCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = null } = $$props;
  let { message } = $$props;
  let { params = null } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  if ($$props.params === void 0 && $$bindings.params && params !== void 0)
    $$bindings.params(params);
  return `<div class="alert alert-danger m-0">${title ? `<h4 class="alert-heading">${escape(title)}</h4>` : ``} <p>${escape(message || "")}</p> ${params && Object.keys(params).length > 0 ? `<pre class="bg-dark text-white mb-0"><code>${escape(JSON.stringify(params, null, 2))}</code></pre>` : ``}</div>`;
});

export { ErrorCard as E };
//# sourceMappingURL=ErrorCard-DIXKcoSz.js.map
