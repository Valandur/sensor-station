import { c as create_ssr_component, e as escape, h as each, j as add_attribute } from './ssr-z3nJZMSi.js';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const css = {
  code: ".text.svelte-njznxm{font-size:2.8rem}img.svelte-njznxm{width:100%}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let loc;
  let forecasts;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  loc = data.location;
  forecasts = data.daily;
  return `<div class="h-100 d-flex flex-column justify-content-end"><div class="row d-flex flex-row justify-content-end"><div class="col-auto text-muted"><i class="icofont-location-pin"></i> ${loc.place ? `${escape(loc.place.name)}, ${escape(loc.place.state)}, ${escape(loc.place.country)}` : `${escape(loc.lat)}, ${escape(loc.lng)}`}</div></div> <div class="row">${each(forecasts, (forecast) => {
    return `<div class="col d-flex flex-column justify-content-between align-items-center"><div class="text svelte-njznxm">${escape(format(forecast.ts, "iiiiii", { locale: de }))}</div> <img${add_attribute("src", forecast.img, 0)} alt="Weather icon" class="svelte-njznxm"> <div class="text svelte-njznxm" style="color: #23ad00">${escape(forecast.feelsLike.toFixed(0))}°</div> </div>`;
  })}</div> </div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-4TOxdiXj.js.map
