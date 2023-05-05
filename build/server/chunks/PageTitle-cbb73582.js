import { c as create_ssr_component } from './index3-00641961.js';

const PageTitle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { showReload = false } = $$props;
  if ($$props.showReload === void 0 && $$bindings.showReload && showReload !== void 0)
    $$bindings.showReload(showReload);
  return `<div class="row"><div class="col-auto"><h1>${slots.default ? slots.default({}) : ``}</h1></div>
	<div class="col align-self-center text-secondary">${slots.center ? slots.center({}) : ``}</div>
	<div class="col-auto">${showReload ? `<button class="btn btn-sm btn-theme"><i class="icofont-refresh"></i></button>` : ``}
		<a class="btn btn-sm btn-danger" href="/"><i class="icofont-ui-close"></i></a></div></div>`;
});

export { PageTitle as P };
//# sourceMappingURL=PageTitle-cbb73582.js.map
