import { c as create_ssr_component, a as subscribe, o as onDestroy, e as escape, b as add_styles } from './ssr-z3nJZMSi.js';
import './client-_MkdHwD5.js';
import { n as navigating } from './stores-U0OV2QDK.js';
import { formatDate } from 'date-fns';
import { de } from 'date-fns/locale';
import { p as paused, a as progress, r as reset } from './screen-lLPMkkuw.js';
import { t as time } from './time-Zz0IaY9S.js';
import './exports-mq_1S73-.js';
import './prod-ssr-neY5j8Pr.js';
import './index2-_yOFBHcp.js';

const css = {
  code: "html,body{overflow:hidden;overscroll-behavior:none}.time-main.svelte-iy2ci2.svelte-iy2ci2{font-size:5rem;line-height:4rem;font-weight:600;color:var(--bs-white)}.time-seconds.svelte-iy2ci2>.svelte-iy2ci2:first-child{font-size:2.2rem;line-height:1.8rem}.time-seconds.svelte-iy2ci2>.svelte-iy2ci2:last-child{font-size:1.4rem;line-height:1.3rem}.icons.svelte-iy2ci2.svelte-iy2ci2{font-size:0.6rem}.progress.svelte-iy2ci2.svelte-iy2ci2{position:fixed;left:0;bottom:0;height:2px}.loading.svelte-iy2ci2.svelte-iy2ci2{position:fixed;bottom:10px;right:16px;z-index:1000;animation:svelte-iy2ci2-rotating 2s linear infinite}@keyframes svelte-iy2ci2-rotating{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let timeStr;
  let tzStr;
  let secondStr;
  let date;
  let dateSub;
  let modem;
  let battery;
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
  onDestroy(() => {
    reset();
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  data.index;
  data.modem?.gpsTz || data.modem?.timeTz || "Europe/Zurich";
  timeStr = formatDate($time, "HH:mm", { locale: de });
  tzStr = formatDate($time, "O", { locale: de });
  secondStr = formatDate($time, "ss", { locale: de });
  date = formatDate($time, "d. MMMM yyyy", { locale: de });
  dateSub = formatDate($time, "eeee", { locale: de }).replace(".", "");
  modem = data.modem;
  battery = data.battery;
  holiday = data.holiday;
  $$unsubscribe_paused();
  $$unsubscribe_time();
  $$unsubscribe_progress();
  $$unsubscribe_navigating();
  return `<div class="container-fluid vh-100 d-flex flex-column"><div class="row flex-nowrap mb-2 p-1"><div role="presentation" class="col-auto d-flex flex-row align-items-end mt-1 p-0"><div class="time-main svelte-iy2ci2">${escape(timeStr)}</div> <div class="time-seconds align-self-stretch d-flex flex-column justify-content-between ms-1 svelte-iy2ci2"><div class="svelte-iy2ci2">${escape(secondStr)}</div> <div class="text-muted text-nowrap svelte-iy2ci2">${escape(tzStr)}</div></div></div> <div class="col d-flex flex-column justify-content-end align-items-end p-0"><div class="row icons flex-nowrap justify-content-end svelte-iy2ci2">${modem?.operator ? `<div class="col-auto"><i class="icofont-globe"></i> ${escape(modem.operator.split(" ", 2)[0])}</div>` : ``} ${modem?.signal ? `<div class="col-auto"><i class="icofont-signal"></i> ${escape(modem.signal / 4 * 100)}%</div>` : ``} ${modem?.lat && modem?.lng ? `<div class="col-auto"><i class="icofont-satellite"></i> ${escape(modem.lat.toFixed(0))} | ${escape(modem.lng.toFixed(0))}</div>` : ``} ${battery ? `<div class="col-auto">${battery.charge > 70 ? `<i class="icofont-battery-full"></i>` : `${battery.charge > 40 ? `<i class="icofont-battery-half"></i>` : `${battery.charge > 10 ? `<i class="icofont-battery-low"></i>` : `<i class="icofont-battery-empty"></i>`}`}`} ${escape(battery.charge)}%</div>` : ``} ${battery?.state.includes("CHARGING") ? `<div class="col-auto" data-svelte-h="svelte-r0ovah"><i class="icofont-plugin"></i></div>` : ``} ${$paused ? `<div class="col-auto" data-svelte-h="svelte-1ggu063"><i class="icofont-ui-pause"></i></div>` : ``}</div> <div class="row flex-fill"></div> <div class="row flex-nowrap"><div class="h2 col text-nowrap m-0">${escape(date)}</div></div> <div class="row align-items-center flex-nowrap">${holiday ? `<div class="col-auto text-nowrap m-0">${escape(holiday.name)}</div> <div class="col-auto m-0" data-svelte-h="svelte-1dk5pnb">•</div>` : ``} <div class="col-auto fw-bold text-white text-nowrap m-0">${escape(dateSub)}</div></div></div></div> <div class="row flex-fill position-relative"><div class="h-100 w-100 m-0 p-1 position-absolute overflow-hidden">${slots.default ? slots.default({}) : ``}</div></div></div> <div class="progress bg-secondary svelte-iy2ci2"${add_styles({ "width": $progress + "%" })}></div> ${$navigating ? `<div class="loading svelte-iy2ci2" data-svelte-h="svelte-bod3bb"><i class="icofont-spinner"></i></div>` : ``}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-XVhuWam4.js.map
