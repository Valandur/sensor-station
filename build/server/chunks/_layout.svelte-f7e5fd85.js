import { c as create_ssr_component, a as subscribe, o as onDestroy, e as escape, b as add_styles, d as assign, n as now, l as loop, i as identity } from './index3-3b5a9ccf.js';
import { formatInTimeZone } from 'date-fns-tz';
import { n as navigating } from './stores-bcdd7aa8.js';
import { w as writable } from './index2-584cecbe.js';
import de from 'date-fns/locale/de/index.js';
import { t as time, h as holiday } from './time-03c2953a.js';
import 'date-fns';
import 'date-holidays';

function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
const css = {
  code: "h1.svelte-tcghn9{font-size:5rem;line-height:4rem}h2.svelte-tcghn9{font-size:2rem;line-height:2rem}.icons.svelte-tcghn9{font-size:0.6rem}.toolbar.svelte-tcghn9{position:fixed;top:0;left:calc(0.5 * var(--bs-gutter-x));right:calc(0.5 * var(--bs-gutter-x));overflow:hidden;display:flex;flex-direction:row;z-index:100}.overlay.svelte-tcghn9{position:fixed;top:0;right:0;bottom:0;left:0;background-color:rgba(var(--bs-white-rgb), 0.2);z-index:10}.progress.svelte-tcghn9{position:fixed;left:0;bottom:0;height:2px}.loading.svelte-tcghn9{position:fixed;bottom:10px;right:16px;z-index:1000;animation:svelte-tcghn9-rotating 2s linear infinite}@keyframes svelte-tcghn9-rotating{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
  map: null
};
const UPDATE_INTERVAL = 2e4;
const TIMEZONE = "Europe/Zurich";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let timeStr;
  let date;
  let dateSubFormat;
  let dateSub;
  let modemStatus;
  let batteryStatus;
  let $time, $$unsubscribe_time;
  let $holiday, $$unsubscribe_holiday;
  let $progress, $$unsubscribe_progress;
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_time = subscribe(time, (value) => $time = value);
  $$unsubscribe_holiday = subscribe(holiday, (value) => $holiday = value);
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  let { data } = $$props;
  const progress = tweened(0, { duration: UPDATE_INTERVAL });
  $$unsubscribe_progress = subscribe(progress, (value) => $progress = value);
  onDestroy(() => {
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  timeStr = formatInTimeZone($time, TIMEZONE, "HH:mm", { locale: de });
  date = formatInTimeZone($time, TIMEZONE, "d. MMMM", { locale: de });
  dateSubFormat = $holiday ? "eee" : "eeee";
  dateSub = formatInTimeZone($time, TIMEZONE, dateSubFormat, { locale: de }).replace(".", "");
  modemStatus = data.modem;
  batteryStatus = data.battery;
  $$unsubscribe_time();
  $$unsubscribe_holiday();
  $$unsubscribe_progress();
  $$unsubscribe_navigating();
  return `<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column"><div class="row mb-3"><div class="col-auto d-flex flex-column justify-content-end"><h1 class="m-0 mt-2 p-0 svelte-tcghn9">${escape(timeStr)}</h1></div>

		<div class="col text-end d-flex flex-column justify-content-end"><div class="row icons justify-content-end svelte-tcghn9">${``}

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

			<div class="row justify-content-end">${$holiday ? `<div class="col-auto">${escape($holiday.name)}</div>
					<div class="col-auto">•</div>` : ``}
				<h4 class="col-auto m-0">${escape(dateSub)}</h4></div></div></div>

	<div class="row flex-fill position-relative"><div class="container h-100 w-100 m-0 p-0 position-absolute"${add_styles({ "overflow": `hidden` })}>${slots.default ? slots.default({}) : ``}</div></div>

	${``}</div>

<div class="progress bg-secondary svelte-tcghn9"${add_styles({ "width": $progress + "%" })}></div>

${$navigating ? `<div class="loading svelte-tcghn9"><i class="icofont-spinner"></i></div>` : ``}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-f7e5fd85.js.map
