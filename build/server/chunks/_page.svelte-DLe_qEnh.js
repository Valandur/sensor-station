import { c as create_ssr_component, v as validate_component, e as escape, j as add_attribute, b as add_styles } from './ssr-C0K3FAqp.js';
import { C as Card } from './Card-BVME-Fpr.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let info;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  info = data.info;
  return `<div class="h-100 d-flex flex-column justify-content-end"><div class="row"><div class="col">${validate_component(Card, "Card").$$render($$result, {}, {}, {
    header: () => {
      return `<div data-svelte-h="svelte-1y6pajl">PIXI Smart Fountain</div> <div><i class="icofont-power"></i> ${escape(info.on ? "ON" : "OFF")}</div> `;
    },
    default: () => {
      return `<div class="row"><div class="col-3" data-svelte-h="svelte-i8jpo7"><i class="icofont-filter"></i></div> <div class="col"><div class="progress mt-1"><div class="progress-bar bg-danger" role="progressbar"${add_attribute("aria-valuenow", info.filterLife, 0)} aria-valuemin="0" aria-valuemax="100"${add_styles({ "width": `${info.filterLife}%` })}>${escape(info.filterLife)}%</div></div></div></div> <div class="row"><div class="col-1" data-svelte-h="svelte-1o00mk9"><i class="icofont-flash-light"></i></div> <div class="col-2">${escape(info.uv ? "ON" : "OFF")}</div> <div class="col"><div class="progress mt-1"><div class="progress-bar bg-danger" role="progressbar"${add_attribute("aria-valuenow", info.uvRuntime, 0)} aria-valuemin="0" aria-valuemax="100"${add_styles({ "width": `${info.uvRuntime}%` })}>${escape(info.uvRuntime)}%</div></div></div></div> <div class="row"><div class="col-1" data-svelte-h="svelte-1fd9uk9"><i class="icofont-water-drop"></i></div> <div class="col-2">${escape(info.waterState ? "ON" : "OFF")}</div> <div class="col"><div class="progress mt-1"><div class="progress-bar" role="progressbar"${add_attribute("aria-valuenow", info.waterLevel, 0)} aria-valuemin="0" aria-valuemax="100"${add_styles({ "width": `${info.waterLevel}%` })}>${escape(info.waterLevel)}%</div></div></div></div>`;
    }
  })}</div></div></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-DLe_qEnh.js.map
