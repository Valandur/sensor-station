import { c as create_ssr_component, e as escape, h as each, j as add_attribute } from './ssr-C0K3FAqp.js';
import { formatInTimeZone } from 'date-fns-tz';
import { de } from 'date-fns/locale';

const css = {
  code: ".text.svelte-ugw1gg{font-size:2.8em}img.svelte-ugw1gg{width:100%}",
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
  return `<div class="h-100 d-flex flex-column justify-content-end"><div class="row d-flex flex-row justify-content-end"><div class="col-auto text-muted"><i class="icofont-location-pin"></i> ${loc.place ? `${escape(loc.place)}` : `${escape(loc.lat)}, ${escape(loc.lng)}`}</div></div> <div class="row flex-nowrap">${each(forecasts, (forecast) => {
    return `<div class="col d-flex flex-column justify-content-between align-items-center"><div class="text svelte-ugw1gg">${escape(formatInTimeZone(forecast.ts, data.tz, "iiiiii", { locale: de }))}</div> <img${add_attribute("src", forecast.img, 0)} alt="Weather icon" class="svelte-ugw1gg"> <div class="text svelte-ugw1gg" style="color: #23ad00">${escape(forecast.feelsLike.toFixed(0))}°</div> </div>`;
  })}</div> </div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-BAL0KOIG.js.map
