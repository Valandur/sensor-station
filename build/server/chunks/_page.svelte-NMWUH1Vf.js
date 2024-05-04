import { c as create_ssr_component, e as escape } from './ssr-CAc1Agzk.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let waterLevel;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  waterLevel = data.info.waterLevel;
  return `<div class="h-100 d-flex flex-column justify-content-end"><div class="row"><div class="col"><div class="card bg-theme border-theme bg-opacity-25"><div class="card-header border-theme fw-bold small d-flex justify-content-between">${escape(waterLevel)}</div> <div class="card-body" data-svelte-h="svelte-pnrt83"><p class="display-6">Fertig</p></div> <div class="card-arrow" data-svelte-h="svelte-1t53rev"><div class="card-arrow-top-left"></div> <div class="card-arrow-top-right"></div> <div class="card-arrow-bottom-left"></div> <div class="card-arrow-bottom-right"></div></div></div></div></div></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-NMWUH1Vf.js.map
