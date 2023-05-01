import { c as create_ssr_component, a as subscribe, o as onDestroy, e as escape, b as add_styles } from './index3-00641961.js';
import { formatInTimeZone } from 'date-fns-tz';
import { n as navigating } from './stores-35031152.js';
import de from 'date-fns/locale/de/index.js';
import { p as paused, a as progress, r as reset } from './screen-2b0a830a.js';
import { t as time } from './time-a7a3ef22.js';
import './index2-9ac9acce.js';

const css = {
  code: "h1.svelte-tcghn9{font-size:5rem;line-height:4rem}h2.svelte-tcghn9{font-size:2rem;line-height:2rem}.icons.svelte-tcghn9{font-size:0.6rem}.toolbar.svelte-tcghn9{position:fixed;top:0;left:calc(0.5 * var(--bs-gutter-x));right:calc(0.5 * var(--bs-gutter-x));overflow:hidden;display:flex;flex-direction:row;z-index:100}.overlay.svelte-tcghn9{position:fixed;top:0;right:0;bottom:0;left:0;background-color:rgba(var(--bs-white-rgb), 0.2);z-index:10}.progress.svelte-tcghn9{position:fixed;left:0;bottom:0;height:2px}.loading.svelte-tcghn9{position:fixed;bottom:10px;right:16px;z-index:1000;animation:svelte-tcghn9-rotating 2s linear infinite}@keyframes svelte-tcghn9-rotating{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
  map: null
};
const TIMEZONE = "Europe/Zurich";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let timeStr;
  let date;
  let dateSub;
  let modemStatus;
  let batteryStatus;
  let holiday;
  let $paused, $$unsubscribe_paused;
  let $time, $$unsubscribe_time;
  let $progress, $$unsubscribe_progress;
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_paused = subscribe(paused, (value) => $paused = value);
  $$unsubscribe_time = subscribe(time, (value) => $time = value);
  $$unsubscribe_progress = subscribe(progress, (value) => $progress = value);
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  let { data } = $$props;
  onDestroy(() => reset());
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  timeStr = formatInTimeZone($time, TIMEZONE, "HH:mm", { locale: de });
  date = formatInTimeZone($time, TIMEZONE, "d. MMMM", { locale: de });
  dateSub = formatInTimeZone($time, TIMEZONE, "eeee", { locale: de }).replace(".", "");
  modemStatus = data.modem;
  batteryStatus = data.battery;
  holiday = data.holiday;
  $$unsubscribe_paused();
  $$unsubscribe_time();
  $$unsubscribe_progress();
  $$unsubscribe_navigating();
  return `<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column"><div class="row mb-3"><div class="col-auto d-flex flex-column justify-content-end"><h1 class="m-0 mt-2 p-0 svelte-tcghn9">${escape(timeStr)}</h1></div>

		<div class="col text-end d-flex flex-column justify-content-end"><div class="row icons justify-content-end svelte-tcghn9">${$paused ? `<div class="col-auto"><i class="icofont-ui-pause"></i></div>` : ``}

				${modemStatus?.operator ? `<div class="col-auto"><i class="icofont-globe"></i>
						${escape(modemStatus.operator)}</div>` : ``}

				${modemStatus?.signal ? `<div class="col-auto"><i class="icofont-signal"></i>
						${escape(modemStatus.signal / 4 * 100)}%
					</div>` : ``}

				${modemStatus?.lat && modemStatus?.lng ? `<div class="col-auto"><i class="icofont-satellite"></i>
						${escape(modemStatus.lat.toFixed(2))} | ${escape(modemStatus.lng.toFixed(2))}</div>` : ``}

				${batteryStatus?.state.includes("CHARGING") ? `<div class="col-auto"><i class="icofont-plugin"></i></div>` : ``}

				${batteryStatus ? `<div class="col-auto">${batteryStatus.charge > 70 ? `<i class="icofont-battery-full"></i>` : `${batteryStatus.charge > 40 ? `<i class="icofont-battery-half"></i>` : `${batteryStatus.charge > 10 ? `<i class="icofont-battery-low"></i>` : `<i class="icofont-battery-empty"></i>`}`}`}
						${escape(batteryStatus.charge)}%
					</div>` : ``}</div>

			<div class="row justify-content-end"><h2 class="col m-0 svelte-tcghn9">${escape(date)}</h2></div>

			<div class="row justify-content-end">${holiday ? `<div class="col-auto">${escape(holiday.name)}</div>
					<div class="col-auto">•</div>` : ``}
				<h4 class="col-auto m-0">${escape(dateSub)}</h4></div></div></div>

	<div class="row flex-fill position-relative"><div class="container h-100 w-100 m-0 p-0 position-absolute"${add_styles({ "overflow": `hidden` })}>${slots.default ? slots.default({}) : ``}</div></div>

	${``}</div>

<div class="progress bg-secondary svelte-tcghn9"${add_styles({ "width": $progress + "%" })}></div>

${$navigating ? `<div class="loading svelte-tcghn9"><i class="icofont-spinner"></i></div>` : ``}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-4903d3e2.js.map
