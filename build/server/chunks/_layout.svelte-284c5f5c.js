import { c as create_ssr_component, a as subscribe, o as onDestroy, e as escape, b as add_styles } from './index3-00641961.js';
import { formatInTimeZone } from 'date-fns-tz';
import { n as navigating } from './stores-35031152.js';
import de from 'date-fns/locale/de/index.js';
import { r as reset, p as paused, a as progress } from './screen-76c56fae.js';
import { t as time } from './time-ae69e22a.js';
import './environment-19782cc3.js';
import './prod-ssr-17392843.js';
import './index2-9ac9acce.js';

function client_method(key) {
  {
    if (key === "before_navigate" || key === "after_navigate") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key] ?? key}(...) on the server`);
      };
    }
  }
}
const beforeNavigate = /* @__PURE__ */ client_method("before_navigate");
const css = {
  code: "html,body{overflow:hidden;overscroll-behavior:none}.time-main.svelte-iy2ci2.svelte-iy2ci2{font-size:5rem;line-height:4rem;font-weight:600;color:var(--bs-white)}.time-seconds.svelte-iy2ci2>.svelte-iy2ci2:first-child{font-size:2.2rem;line-height:1.8rem}.time-seconds.svelte-iy2ci2>.svelte-iy2ci2:last-child{font-size:1.4rem;line-height:1.3rem}.icons.svelte-iy2ci2.svelte-iy2ci2{font-size:0.6rem}.progress.svelte-iy2ci2.svelte-iy2ci2{position:fixed;left:0;bottom:0;height:2px}.loading.svelte-iy2ci2.svelte-iy2ci2{position:fixed;bottom:10px;right:16px;z-index:1000;animation:svelte-iy2ci2-rotating 2s linear infinite}@keyframes svelte-iy2ci2-rotating{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let timezone;
  let timeStr;
  let tzStr;
  let secondStr;
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
  beforeNavigate(() => reset(false));
  onDestroy(() => {
    reset();
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  data.index;
  timezone = data.modem?.gpsTz || data.modem?.timeTz || "Europe/Zurich";
  timeStr = formatInTimeZone($time, timezone, "HH:mm", { locale: de });
  tzStr = formatInTimeZone($time, timezone, "O", { locale: de });
  secondStr = formatInTimeZone($time, timezone, "ss", { locale: de });
  date = formatInTimeZone($time, timezone, "d. MMMM yyyy", { locale: de });
  dateSub = formatInTimeZone($time, timezone, "eeee", { locale: de }).replace(".", "");
  modemStatus = data.modem;
  batteryStatus = data.battery;
  holiday = data.holiday;
  $$unsubscribe_paused();
  $$unsubscribe_time();
  $$unsubscribe_progress();
  $$unsubscribe_navigating();
  return `<div class="container-fluid vh-100 d-flex flex-column"><div class="row flex-nowrap mb-2 p-1"><div class="col-auto d-flex flex-row align-items-end mt-1 p-0"><div class="time-main svelte-iy2ci2">${escape(timeStr)}</div>
			<div class="time-seconds align-self-stretch d-flex flex-column justify-content-between ms-1 svelte-iy2ci2"><div class="svelte-iy2ci2">${escape(secondStr)}</div>
				<div class="text-muted svelte-iy2ci2">${escape(tzStr)}</div></div></div>

		<div class="col d-flex flex-column justify-content-end align-items-end overflow-visible p-0"><div class="row icons flex-nowrap svelte-iy2ci2">${modemStatus?.operator ? `<div class="col-auto"><i class="icofont-globe"></i>
						${escape(modemStatus.operator.split(" ", 2)[0])}</div>` : ``}

				${modemStatus?.signal ? `<div class="col-auto"><i class="icofont-signal"></i>
						${escape(modemStatus.signal / 4 * 100)}%
					</div>` : ``}

				${modemStatus?.lat && modemStatus?.lng ? `<div class="col-auto"><i class="icofont-satellite"></i></div>` : ``}

				${batteryStatus?.state.includes("CHARGING") ? `<div class="col-auto"><i class="icofont-plugin"></i></div>` : ``}

				${batteryStatus ? `<div class="col-auto">${batteryStatus.charge > 70 ? `<i class="icofont-battery-full"></i>` : `${batteryStatus.charge > 40 ? `<i class="icofont-battery-half"></i>` : `${batteryStatus.charge > 10 ? `<i class="icofont-battery-low"></i>` : `<i class="icofont-battery-empty"></i>`}`}`}
						${escape(batteryStatus.charge)}%
					</div>` : ``}

				${$paused ? `<div class="col-auto"><i class="icofont-ui-pause"></i></div>` : ``}</div>

			<div class="row flex-nowrap"><div class="h2 col text-nowrap m-0">${escape(date)}</div></div>

			<div class="row align-items-center flex-nowrap">${holiday ? `<div class="col-auto text-nowrap m-0">${escape(holiday.name)}</div>
					<div class="col-auto m-0">•</div>` : ``}
				<div class="col-auto fw-bold text-white text-nowrap m-0">${escape(dateSub)}</div></div></div></div>

	<div class="row flex-fill position-relative"><div class="h-100 w-100 m-0 p-1 position-absolute overflow-hidden">${slots.default ? slots.default({}) : ``}</div></div></div>

<div class="progress bg-secondary svelte-iy2ci2"${add_styles({ "width": $progress + "%" })}></div>

${$navigating ? `<div class="loading svelte-iy2ci2"><i class="icofont-spinner"></i></div>` : ``}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-284c5f5c.js.map
