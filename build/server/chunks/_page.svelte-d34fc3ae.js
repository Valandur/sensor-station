import { c as create_ssr_component, k as each, e as escape, p as add_attribute } from './index3-3b5a9ccf.js';
import { format } from 'date-fns';
import de from 'date-fns/locale/de/index.js';

const css = {
  code: ".text.svelte-110qxgu{font-size:3rem;text-align:center}img.svelte-110qxgu{width:100%}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let forecasts;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  forecasts = data.hourly;
  return `<div class="container-fluid h-100 m-0 d-flex flex-column justify-content-center"><div class="row"><div class="col"><div class="row">${each(forecasts, (forecast) => {
    return `<div class="col"><div class="text svelte-110qxgu">${escape(format(forecast.ts, "HH''", { locale: de }))}</div>
						<img${add_attribute("src", forecast.img, 0)} alt="Weather icon" class="svelte-110qxgu">
						<div class="text svelte-110qxgu" style="color: #23ad00">${escape(forecast.feelsLike.toFixed(0))}°</div>
					</div>`;
  })}</div></div></div>
</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-d34fc3ae.js.map
