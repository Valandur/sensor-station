import { B as BATTERY_SERVICE_TYPE, C as CALENDAR_SERVICE_TYPE, a as CAROUSEL_SERVICE_TYPE, E as EPIC_GAMES_SERVICE_TYPE, G as GALLERY_SERVICE_TYPE, M as MODEM_SERVICE_TYPE, N as NETWORK_SERVICE_TYPE, P as PRUSA_SERVICE_TYPE, S as SBB_ALERTS_SERVICE_TYPE, b as SBB_DEPARTURES_SERVICE_TYPE, c as SRF_SERVICE_TYPE, d as SWISS_POST_SERVICE_TYPE, T as TUYA_SERVICE_TYPE, W as WEATHER_SERVICE_TYPE } from './services-Dd8MqIOo.js';
import { f as assign, c as create_ssr_component, v as validate_component, d as escape, i as identity, n as noop, o as onDestroy, b as add_attribute, a as subscribe, e as each, m as missing_component, g as add_styles, h as compute_slots } from './ssr-DyNlIM9y.js';
import { P as PageTitle, E as ErrorCard, p as page, n as navigating, g as goto, i as invalidate } from './PageTitle-ContvOSw.js';
import 'perfect-scrollbar';
import { w as writable, r as readable, D as DEV } from './index-CckTN70d.js';
import { formatInTimeZone } from 'date-fns-tz';
import { de } from 'date-fns/locale';
import { isSameDay } from 'date-fns/isSameDay';
import { format } from 'date-fns/format';
import { de as de$1 } from 'date-fns/locale/de';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { add } from 'date-fns/add';
import { parseISO } from 'date-fns/parseISO';

const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
const dev = DEV;
const css$8 = {
  code: ".row.ps > :not(.col){width:revert;max-width:revert;padding-right:revert;padding-left:revert;margin-top:revert}",
  map: null
};
const PerfectScrollbar_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let container;
  onDestroy(() => {
  });
  $$result.css.add(css$8);
  return `<div${add_attribute("class", $$props.class, 0)}${add_attribute("this", container, 0)}>${slots.default ? slots.default({}) : ``} </div>`;
});
const PageLayout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  let { subTitle = "" } = $$props;
  let { closeUrl = "/" } = $$props;
  let { show = true } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.subTitle === void 0 && $$bindings.subTitle && subTitle !== void 0)
    $$bindings.subTitle(subTitle);
  if ($$props.closeUrl === void 0 && $$bindings.closeUrl && closeUrl !== void 0)
    $$bindings.closeUrl(closeUrl);
  if ($$props.show === void 0 && $$bindings.show && show !== void 0)
    $$bindings.show(show);
  return `${show ? `${validate_component(PageTitle, "PageTitle").$$render($$result, { showReload: true, closeUrl }, {}, {
    center: () => {
      return `${escape(subTitle)}`;
    },
    default: () => {
      return `${escape(title)}`;
    }
  })} ${validate_component(PerfectScrollbar_1, "PerfectScrollbar").$$render($$result, { class: "row" }, {}, {
    default: () => {
      return `<div class="col">${slots.default ? slots.default({}) : ``}</div>`;
    }
  })}` : `${slots.default ? slots.default({}) : ``}`}`;
});
const ServiceConfig$d = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="row overflow-auto"><form id="form" method="POST" class="col mt-2"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <div class="row mb-2"><label for="inputBusNumber" class="col-3 col-form-label" data-svelte-h="svelte-6udbvh">BUS Number</label> <div class="col"><input id="inputBusNumber" type="number" name="busNumber"${add_attribute("value", data.config.busNumber, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputI2CAddress" class="col-3 col-form-label" data-svelte-h="svelte-g7a8ah">I2C Address</label> <div class="col"><input id="inputI2CAddress" type="number" name="i2cAddress"${add_attribute("value", data.config.i2cAddress, 0)} class="form-control"></div></div> <div class="row justify-content-end" data-svelte-h="svelte-3oa9nd"><div class="col-auto"><button type="submit" class="btn btn-theme mt-2">Save</button></div></div></form></div>`;
});
const Battery = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let fault;
  let powerIn;
  let powerIn5vIo;
  let { info } = $$props;
  if ($$props.info === void 0 && $$bindings.info && info !== void 0)
    $$bindings.info(info);
  fault = info.fault;
  powerIn = info.powerIn;
  powerIn5vIo = info.powerIn5vIo;
  return `<div class="row overflow-auto"><div class="col"><table class="table table-sm"><colgroup data-svelte-h="svelte-3ig71c"><col> <col width="25%"> <col width="25%"> <col width="25%"></colgroup> <tbody><tr><td data-svelte-h="svelte-32owck">Status</td> <td colspan="2">${escape(info.state)}</td> <td>${escape(info.charge)}%</td></tr> <tr><td data-svelte-h="svelte-tdkx3q">Power IN</td> <td>${escape(powerIn.state)}</td> <td>${escape(powerIn.voltage.toFixed(2))} V</td> <td>${escape(powerIn.current.toFixed(2))} A</td></tr> <tr><td data-svelte-h="svelte-14gfq16">Power 5V IO</td> <td>${escape(powerIn5vIo.state)}</td> <td>${escape(powerIn5vIo.voltage.toFixed(2))} V</td> <td>${escape(powerIn5vIo.current.toFixed(2))} A</td></tr> <tr><td data-svelte-h="svelte-vrb0za">Button</td> <td>${info.isButton ? `<i class="fa-solid fa-check"></i>` : `<i class="fa-solid fa-xmark"></i>`}</td> <td data-svelte-h="svelte-14y4g7y">Fault</td> <td>${info.isFault ? `<i class="fa-solid fa-check"></i>` : `<i class="fa-solid fa-xmark"></i>`}</td></tr> <tr><td data-svelte-h="svelte-rxzfvg">Profile Invalid</td> <td>${fault.batteryProfileInvalid ? `<i class="fa-solid fa-check"></i>` : `<i class="fa-solid fa-xmark"></i>`}</td> <td data-svelte-h="svelte-te6igv">Button Off</td> <td>${fault.buttonPowerOff ? `<i class="fa-solid fa-check"></i>` : `<i class="fa-solid fa-xmark"></i>`}</td></tr> <tr><td data-svelte-h="svelte-1ce0pk9">Charging Temp.</td> <td>${escape(fault.chargingTemperatureFault)}</td> <td data-svelte-h="svelte-1jsl7va">Forced Off</td> <td>${fault.forcedPowerOff ? `<i class="fa-solid fa-check"></i>` : `<i class="fa-solid fa-xmark"></i>`}</td></tr> <tr><td data-svelte-h="svelte-11uk8ju">Sys Off</td> <td>${fault.forcedSysPowerOff ? `<i class="fa-solid fa-check"></i>` : `<i class="fa-solid fa-xmark"></i>`}</td> <td data-svelte-h="svelte-1xf948l">Watchdog</td> <td>${fault.watchdogReset ? `<i class="fa-solid fa-check"></i>` : `<i class="fa-solid fa-xmark"></i>`}</td></tr></tbody></table></div></div>`;
});
const Icon$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { battery } = $$props;
  if ($$props.battery === void 0 && $$bindings.battery && battery !== void 0)
    $$bindings.battery(battery);
  return `${battery ? `<div class="col-auto">${battery.charge > 95 ? `<i class="fa-solid fa-battery-full"></i>` : `${battery.charge > 70 ? `<i class="fa-solid fa-battery-three-quarters"></i>` : `${battery.charge > 45 ? `<i class="fa-solid fa-battery-half"></i>` : `${battery.charge > 20 ? `<i class="fa-solid fa-battery-quarter"></i>` : `<i class="fa-solid fa-battery-empty"></i>`}`}`}`} ${escape(battery.charge)}%</div>` : ``} ${battery?.state.includes("CHARGING") ? `<div class="col-auto" data-svelte-h="svelte-11l0ybr"><i class="fa-solid fa-plug"></i></div>` : ``}`;
});
const Service$d = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { action } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "Battery",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${action === "icon" ? `${validate_component(Icon$2, "Icon").$$render($$result, { battery: data.info }, {}, {})}` : `${validate_component(Battery, "Battery").$$render($$result, { info: data.info }, {}, {})}`}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : `${form?.success ? `<div class="alert alert-success m-0" data-svelte-h="svelte-1cil5pf">Config saved!</div>` : ``}`} ${validate_component(ServiceConfig$d, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Battery",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Battery",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
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
    let {
      delay = 0,
      duration = 400,
      easing = identity,
      interpolate = get_interpolator
    } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start2 = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start2)
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
      const elapsed = now2 - start2;
      if (elapsed > /** @type {number} */
      duration) {
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
const paused = writable(dev);
const progress = tweened(0);
let timer = null;
function reset(resetProgress = true) {
  if (resetProgress) {
    progress.set(0, { duration: 0 });
  }
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}
function start(callback, ms) {
  progress.set(100, { duration: ms });
  timer = setTimeout(callback, ms);
  paused.set(false);
}
const Pagination = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  let { nextPage } = $$props;
  let { prevPage } = $$props;
  if ($$props.nextPage === void 0 && $$bindings.nextPage && nextPage !== void 0)
    $$bindings.nextPage(nextPage);
  if ($$props.prevPage === void 0 && $$bindings.prevPage && prevPage !== void 0)
    $$bindings.prevPage(prevPage);
  $$unsubscribe_page();
  return `<div style="display: contents;">${slots.default ? slots.default({}) : ``}</div>`;
});
const ServiceConfig$c = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="row overflow-auto"><form id="form" method="POST" class="col mt-2"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <div class="row mb-2"><label for="inputCalendarId" class="col-3 col-form-label" data-svelte-h="svelte-12ps0ch">Calendar ID</label> <div class="col"><input id="inputCalendarId" type="text" name="calendarId"${add_attribute("value", data.config.calendarId, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputServiceEmail" class="col-3 col-form-label" data-svelte-h="svelte-1wl4ncq">Service E-Mail</label> <div class="col"><input id="inputServiceEmail" type="text" name="serviceEmail"${add_attribute("value", data.config.serviceEmail, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputPrivateKey" class="col-3 col-form-label" data-svelte-h="svelte-870wtf">Private Key</label> <div class="col"><textarea id="inputPrivateKey" name="privateKey" class="form-control" rows="3">${escape(data.config.privateKey, false)}</textarea></div></div> <div class="row mb-2"><label for="inputItemsPerPage" class="col-3 col-form-label" data-svelte-h="svelte-1bipe7b">Items per page</label> <div class="col"><input id="inputItemsPerPage" type="number" name="itemsPerPage" min="1" max="100" step="1"${add_attribute("value", data.config.itemsPerPage, 0)} class="form-control"></div></div> <div class="row justify-content-end" data-svelte-h="svelte-3oa9nd"><div class="col-auto"><button type="submit" class="btn btn-theme mt-2">Save</button></div></div></form></div>`;
});
const EmptyCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="row mb-5"><div class="col"></div> <div class="col-6"><div class="card bg-success border-success bg-opacity-25"><div class="card-body"><h5 class="card-title mb-0">${slots.default ? slots.default({}) : ``}</h5></div> <div class="card-arrow" data-svelte-h="svelte-uf4h4a"><div class="card-arrow-top-left"></div> <div class="card-arrow-top-right"></div> <div class="card-arrow-bottom-left"></div> <div class="card-arrow-bottom-right"></div></div></div></div> <div class="col"></div></div>`;
});
const tz = writable(Intl.DateTimeFormat().resolvedOptions().timeZone);
const css$7 = {
  code: ".row.svelte-1fyrj5j:not(:first-child):not(.same){border-top:1px dashed var(--bs-gray)}.row.odd.svelte-1fyrj5j{color:pink}",
  map: null
};
const Events = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let formattedEvents;
  let $tz, $$unsubscribe_tz;
  $$unsubscribe_tz = subscribe(tz, (value) => $tz = value);
  let { events } = $$props;
  if ($$props.events === void 0 && $$bindings.events && events !== void 0)
    $$bindings.events(events);
  $$result.css.add(css$7);
  formattedEvents = events?.map((event) => ({ ...event, isSameDay: false, isOdd: false }));
  {
    formattedEvents?.forEach((event, i, arr) => {
      event.isSameDay = i > 0 && isSameDay(arr[i].tsStart, arr[i - 1].tsStart);
      event.isOdd = event.isSameDay ? arr[i - 1].isOdd : !arr[i - 1]?.isOdd;
    });
  }
  $$unsubscribe_tz();
  return `${formattedEvents.length > 0 ? `${each(formattedEvents, (event) => {
    return `<div class="${[
      "row fs-2 svelte-1fyrj5j",
      (event.isSameDay ? "same" : "") + " " + (event.isOdd ? "odd" : "")
    ].join(" ").trim()}">${!event.isSameDay ? `<div class="col-1">${escape(formatInTimeZone(event.tsStart, $tz, "iii", { locale: de }))}</div> <div class="col-1">${escape(formatInTimeZone(event.tsStart, $tz, "d.", { locale: de }))}</div>` : `<div class="col-2"></div>`} ${event.isWholeDay ? `<div class="col-2" data-svelte-h="svelte-1xjyjcs">------</div>` : `<div class="col-2">${escape(formatInTimeZone(event.tsStart, $tz, "HH:mm", { locale: de }))} </div>`} <div class="col">${escape(event.content)}</div> </div>`;
  })}` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Es wurden keine Kalendereinträge gefunden`;
    }
  })}`}`;
});
const Service$c = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "Calendar",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${validate_component(Pagination, "Pagination").$$render(
          $$result,
          {
            prevPage: data.prevPage,
            nextPage: data.nextPage
          },
          {},
          {
            default: () => {
              return `${validate_component(Events, "Events").$$render($$result, { events: data.events }, {}, {})}`;
            }
          }
        )}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : `${form?.success ? `<div class="alert alert-success m-0" data-svelte-h="svelte-1cil5pf">Config saved!</div>` : ``}`} ${validate_component(ServiceConfig$c, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Calendar",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Calendar",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const ServiceConfig$b = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let services;
  let screens;
  let icons;
  let screenActions;
  let iconActions;
  let { name } = $$props;
  let { data } = $$props;
  let newScreenName = "";
  let newScreenAction = "";
  let newIconName = "";
  let newIconAction = "";
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  services = data.services;
  screens = data.config.screens;
  icons = data.config.icons;
  screenActions = services.find((s) => s.name === newScreenName)?.type.actions ?? [];
  {
    if (!screenActions.includes(newScreenAction)) {
      newScreenAction = "";
    }
  }
  iconActions = services.find((s) => s.name === newIconName)?.type.actions ?? [];
  {
    if (!iconActions.includes(newIconAction)) {
      newIconAction = "";
    }
  }
  return `<ul class="nav nav-tabs" data-svelte-h="svelte-1xr13ep"><li class="nav-item me-1"><a href="#screens" class="nav-link active" data-bs-toggle="tab">Screens</a></li> <li class="nav-item me-1"><a href="#icons" class="nav-link" data-bs-toggle="tab">Icons</a></li> <li class="nav-item me-1"><a href="#other" class="nav-link" data-bs-toggle="tab">Other</a></li></ul> <div class="tab-content flex-1 pt-3"><div class="tab-pane container-fluid fade show active" id="screens"><table class="table"><colgroup data-svelte-h="svelte-9pa8eu"><col width="45%"> <col width="45%"> <col></colgroup> <tbody><tr class="bg-dark"><td><select form="formNewScreen" name="service" class="form-select"><option value="" selected disabled data-svelte-h="svelte-1d2mk1m">---</option>${each(services, (service) => {
    return `<option${add_attribute("value", service.name, 0)}>${escape(service.name)} [${escape(service.type.name)}]</option>`;
  })}</select></td> <td><select form="formNewScreen" name="action" class="form-select"><option value="" data-svelte-h="svelte-dz2bat">---</option>${each(screenActions, (action) => {
    return `<option${add_attribute("value", action, 0)}>${escape(action)}</option>`;
  })}</select></td> <td><form id="formNewScreen" method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <input type="hidden" name="action" value="add_screen"> <button type="submit" class="btn btn-theme" ${"disabled"}><i class="fa-solid fa-plus"></i></button></form></td></tr> ${each(screens, (screen, index) => {
    return `<tr><td>${escape(screen.name)}</td> <td>${escape(screen.action ?? "---")}</td> <td><div class="btn-group"><form method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <input type="hidden" name="action" value="move_screen"> <input type="hidden" name="dir" value="up"> <input type="hidden" name="index"${add_attribute("value", index, 0)}> <button class="${[
      "btn me-2",
      (index > 0 ? "btn-primary" : "") + " " + (index === 0 ? "btn-secondary" : "")
    ].join(" ").trim()}" ${index === 0 ? "disabled" : ""} data-svelte-h="svelte-1gvsfhl"><i class="fa-solid fa-caret-up"></i> </button></form> <form method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <input type="hidden" name="action" value="move_screen"> <input type="hidden" name="dir" value="down"> <input type="hidden" name="index"${add_attribute("value", index, 0)}> <button class="${[
      "btn me-2",
      (index < screens.length - 1 ? "btn-primary" : "") + " " + (index === screens.length - 1 ? "btn-secondary" : "")
    ].join(" ").trim()}" ${index === screens.length - 1 ? "disabled" : ""}><i class="fa-solid fa-caret-down"></i> </button></form> <form method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <input type="hidden" name="action" value="delete_screen"> <input type="hidden" name="index"${add_attribute("value", index, 0)}> <button class="btn btn-danger" data-svelte-h="svelte-3bsvu9"><i class="fa-solid fa-trash"></i> </button></form> </div></td> </tr>`;
  })}</tbody></table></div> <div class="tab-pane container-fluid fade" id="icons"><table class="table"><colgroup data-svelte-h="svelte-9pa8eu"><col width="45%"> <col width="45%"> <col></colgroup> <tbody><tr class="bg-dark"><td><select form="formNewIcon" name="service" class="form-select"><option value="" selected disabled data-svelte-h="svelte-1d2mk1m">---</option>${each(services, (service) => {
    return `<option${add_attribute("value", service.name, 0)}>${escape(service.name)} [${escape(service.type.name)}]</option>`;
  })}</select></td> <td><select form="formNewIcon" name="action" class="form-select"><option value="" data-svelte-h="svelte-dz2bat">---</option>${each(iconActions, (action) => {
    return `<option${add_attribute("value", action, 0)}>${escape(action)}</option>`;
  })}</select></td> <td><form id="formNewIcon" method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <input type="hidden" name="action" value="add_icon"> <button type="submit" class="btn btn-theme" ${"disabled"}><i class="fa-solid fa-plus"></i></button></form></td></tr> ${each(icons, (icon, index) => {
    return `<tr><td>${escape(icon.name)}</td> <td>${escape(icon.action ?? "---")}</td> <td><div class="btn-group"><form method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <input type="hidden" name="action" value="move_icon"> <input type="hidden" name="dir" value="up"> <input type="hidden" name="index"${add_attribute("value", index, 0)}> <button class="${[
      "btn me-2",
      (index > 0 ? "btn-primary" : "") + " " + (index === 0 ? "btn-secondary" : "")
    ].join(" ").trim()}" ${index === 0 ? "disabled" : ""} data-svelte-h="svelte-1gvsfhl"><i class="fa-solid fa-caret-up"></i> </button></form> <form method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <input type="hidden" name="action" value="move_icon"> <input type="hidden" name="dir" value="down"> <input type="hidden" name="index"${add_attribute("value", index, 0)}> <button class="${[
      "btn me-2",
      (index < icons.length - 1 ? "btn-primary" : "") + " " + (index === icons.length - 1 ? "btn-secondary" : "")
    ].join(" ").trim()}" ${index === icons.length - 1 ? "disabled" : ""}><i class="fa-solid fa-caret-down"></i> </button></form> <form method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <input type="hidden" name="action" value="delete_icon"> <input type="hidden" name="index"${add_attribute("value", index, 0)}> <button class="btn btn-danger" data-svelte-h="svelte-3bsvu9"><i class="fa-solid fa-trash"></i> </button></form> </div></td> </tr>`;
  })}</tbody></table></div> <div class="tab-pane container-fluid fade" id="other"><form id="formOther" method="POST" style="display: contents;"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <input type="hidden" name="action" value="other"> <div class="row mb-2"><label for="inputCountry" class="col-3 col-form-label" data-svelte-h="svelte-1blm9bf">Country</label> <div class="col"><input id="inputCountry" type="text" name="country"${add_attribute("value", data.config.country, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputState" class="col-3 col-form-label" data-svelte-h="svelte-1fam1d7">State</label> <div class="col"><input id="inputState" type="text" name="state"${add_attribute("value", data.config.state, 0)} class="form-control"></div></div> <div class="row justify-content-end" data-svelte-h="svelte-1fwnvnx"><div class="col-auto"><button type="submit" class="btn btn-theme mt-2">Save</button></div></div></form></div></div>`;
});
const UPDATE_INTERVAL = 1e3;
const time = readable(/* @__PURE__ */ new Date(), (set) => {
  const interval = setInterval(() => {
    set(/* @__PURE__ */ new Date());
  }, UPDATE_INTERVAL);
  return function stop() {
    clearInterval(interval);
  };
});
const css$6 = {
  code: "html,body{overflow:hidden;overscroll-behavior:none}.time-main.svelte-k0npo4.svelte-k0npo4{font-size:5em;line-height:0.8em;font-weight:600;color:var(--bs-white)}.time-seconds.svelte-k0npo4>.svelte-k0npo4:first-child{font-size:2.2em;line-height:0.9em}.time-seconds.svelte-k0npo4>.svelte-k0npo4:last-child{font-size:1.4em;line-height:1.1em}.icons.svelte-k0npo4.svelte-k0npo4{font-size:0.6em;height:1.5em}.progress.svelte-k0npo4.svelte-k0npo4{position:fixed;left:0;bottom:0;height:2px}.loading.svelte-k0npo4.svelte-k0npo4{position:fixed;bottom:10px;right:16px;z-index:1000;animation:svelte-k0npo4-rotating 2s linear infinite}@keyframes svelte-k0npo4-rotating{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
  map: null
};
const Carousel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let screen;
  let screenType;
  let screenData;
  let icons;
  let holiday;
  let timeStr;
  let tzStr;
  let secondStr;
  let date;
  let dateSub;
  let $paused, $$unsubscribe_paused;
  let $tz, $$unsubscribe_tz;
  let $time, $$unsubscribe_time;
  let $progress, $$unsubscribe_progress;
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_paused = subscribe(paused, (value) => $paused = value);
  $$unsubscribe_tz = subscribe(tz, (value) => $tz = value);
  $$unsubscribe_time = subscribe(time, (value) => $time = value);
  $$unsubscribe_progress = subscribe(progress, (value) => $progress = value);
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  let { data } = $$props;
  let timer2 = null;
  onDestroy(() => {
    reset();
    if (timer2) {
      clearInterval(timer2);
      timer2 = null;
    }
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$6);
  data.index;
  screen = data.screen;
  screenType = data.screenType;
  screenData = data.screenData;
  icons = data.icons;
  holiday = data.holiday;
  timeStr = formatInTimeZone($time, $tz, "HH:mm", { locale: de });
  tzStr = formatInTimeZone($time, $tz, "O", { locale: de });
  secondStr = formatInTimeZone($time, $tz, "ss", { locale: de });
  date = formatInTimeZone($time, $tz, "d. MMMM yyyy", { locale: de });
  dateSub = formatInTimeZone($time, $tz, "eeee", { locale: de }).replace(".", "");
  {
    {
      reset();
      if (timer2) {
        clearInterval(timer2);
        timer2 = null;
      }
      if (!$paused && data.nextScreen) {
        data.nextScreen;
        start(() => goto(), data.switchInterval);
      } else if ($paused) {
        timer2 = setInterval(() => invalidate(), data.updateInterval);
      }
    }
  }
  $$unsubscribe_paused();
  $$unsubscribe_tz();
  $$unsubscribe_time();
  $$unsubscribe_progress();
  $$unsubscribe_navigating();
  return `<div style="display: contents;"><div class="row flex-nowrap mb-2"><div role="presentation" class="col-auto d-flex flex-row align-items-end"><div class="time-main svelte-k0npo4">${escape(timeStr)}</div> <div class="time-seconds align-self-stretch d-flex flex-column justify-content-between ms-2 svelte-k0npo4"><div class="svelte-k0npo4">${escape(secondStr)}</div> <div class="text-muted text-nowrap svelte-k0npo4">${escape(tzStr)}</div></div></div> <div class="col d-flex flex-column justify-content-end align-items-end"><div class="row icons flex-nowrap justify-content-end svelte-k0npo4">${each(icons, (icon) => {
    let comp = SERVICES[icon.type];
    return ` <div class="col-auto">${validate_component(comp || missing_component, "svelte:component").$$render(
      $$result,
      {
        name: icon.name,
        action: icon.action,
        data: icon.data,
        form: null,
        isEmbedded: true
      },
      {},
      {}
    )} </div>`;
  })} ${$paused ? `<div class="col-auto" data-svelte-h="svelte-1bn4mk5"><i class="fa-solid fa-pause"></i></div>` : ``}</div> <div class="row flex-nowrap"><div class="h2 col text-nowrap m-0">${escape(date)}</div></div> <div class="row align-items-center flex-nowrap">${holiday ? `<div class="col-auto text-nowrap m-0">${escape(holiday.name)}</div> <div class="col-auto m-0" data-svelte-h="svelte-1dk5pnb">•</div>` : ``} <div class="col-auto fw-bold text-white text-nowrap m-0">${escape(dateSub)}</div></div></div></div> <div class="row flex-1 position-relative"><div class="w-100 h-100 d-flex flex-column position-absolute overflow-hidden">${screen ? (() => {
    let comp = SERVICES[screenType];
    return ` ${validate_component(comp || missing_component, "svelte:component").$$render(
      $$result,
      {
        name: screen.name,
        action: screen.action,
        data: screenData,
        form: null,
        isEmbedded: true
      },
      {},
      {}
    )}`;
  })() : `<p class="alert alert-info m-2" data-svelte-h="svelte-17tv8kg">There are no screens setup! Check the
						<a class="alert-link" href="/settings">settings</a>
						to add some.</p>`}</div></div></div> <div class="progress bg-secondary svelte-k0npo4"${add_styles({ "width": $progress + "%" })}></div> ${$navigating ? `<div class="loading svelte-k0npo4" data-svelte-h="svelte-lq6yd0"><i class="fa-solid fa-spinner"></i></div>` : ``}`;
});
const Service$b = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { action } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "Carousel",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded && action !== "main"
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${validate_component(Carousel, "Carousel").$$render($$result, { data }, {}, {})}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : ``} ${validate_component(ServiceConfig$b, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Carousel",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Carousel",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const ServiceConfig$a = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="row overflow-auto"><form id="form" method="POST" class="col mt-2"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <div class="row mb-2"><label for="inputItemsPerPage" class="col-3 col-form-label" data-svelte-h="svelte-1bipe7b">Items per page</label> <div class="col"><input id="inputItemsPerPage" type="number" name="itemsPerPage" min="1" max="100" step="1"${add_attribute("value", data.config.itemsPerPage, 0)} class="form-control"></div></div> <div class="row justify-content-end" data-svelte-h="svelte-3oa9nd"><div class="col-auto"><button type="submit" class="btn btn-theme mt-2">Save</button></div></div></form></div>`;
});
const Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let { type = "theme" } = $$props;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  return `<div class="${"card bg-" + escape(type, true) + " border-" + escape(type, true) + " bg-opacity-25 " + escape($$props.class, true)}">${$$slots.header ? `<div class="${"card-header border-" + escape(type, true) + " fw-bold small d-flex justify-content-between"}">${slots.header ? slots.header({}) : ``}</div>` : ``} ${$$slots.body ? `${slots.body ? slots.body({}) : ``}` : `${$$slots.title || $$slots.subTitle || $$slots.default ? `<div class="card-body">${$$slots.title ? `<h5 class="card-title">${slots.title ? slots.title({}) : ``}</h5>` : ``} ${$$slots.subTitle ? `<h6 class="card-subtitle mb-2 text-white text-opacity-50">${slots.subTitle ? slots.subTitle({}) : ``}</h6>` : ``} ${$$slots.default ? `${slots.default ? slots.default({}) : ``}` : ``}</div>` : ``}`} ${$$slots.footer ? `<div class="card-footer">${slots.footer ? slots.footer({}) : ``}</div>` : ``} <div class="card-arrow" data-svelte-h="svelte-1yy7ii4"><div class="card-arrow-top-left"></div> <div class="card-arrow-top-right"></div> <div class="card-arrow-bottom-left"></div> <div class="card-arrow-bottom-right"></div></div></div>`;
});
const Games = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $tz, $$unsubscribe_tz;
  $$unsubscribe_tz = subscribe(tz, (value) => $tz = value);
  let { games } = $$props;
  if ($$props.games === void 0 && $$bindings.games && games !== void 0)
    $$bindings.games(games);
  $$unsubscribe_tz();
  return `<div class="row flex-1"></div> ${games.length > 0 ? `<div class="row row-cols-2 overflow-auto">${each(games, (game) => {
    return `<div class="col">${validate_component(Card, "Card").$$render($$result, {}, {}, {
      body: () => {
        return `<div slot="body" class="p-1"><img${add_attribute("src", "/" + game.image, 0)} class="card-img"${add_attribute("alt", game.title, 0)}> <div class="card-img-overlay d-flex flex-column justify-content-end p-1 z-2"><div class="bg-black bg-opacity-75 fw-bold text-white px-1">${escape(game.title)}</div></div> </div>`;
      },
      header: () => {
        return `<div>${escape(formatInTimeZone(game.startsAt, $tz, "dd MMM", { locale: de }))} -
							${escape(game.endsAt ? formatInTimeZone(game.endsAt, $tz, "dd MMM", { locale: de }) : "")}</div> <div>${game.pct === 0 ? `Free` : `${escape(game.pct)}%`}</div> `;
      }
    })} </div>`;
  })}</div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Es wurden keine Spiele gefunden`;
    }
  })}`}`;
});
const Service$a = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "Epic Games",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${validate_component(Pagination, "Pagination").$$render(
          $$result,
          {
            prevPage: data.prevPage,
            nextPage: data.nextPage
          },
          {},
          {
            default: () => {
              return `${validate_component(Games, "Games").$$render($$result, { games: data.games }, {}, {})}`;
            }
          }
        )}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : `${form?.success ? `<div class="alert alert-success m-0" data-svelte-h="svelte-1cil5pf">Config saved!</div>` : ``}`} ${validate_component(ServiceConfig$a, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Epic Games",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Epic Games",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const css$5 = {
  code: "img.svelte-1h3r0r0,video.svelte-1h3r0r0{max-width:100px;max-height:100px}input.svelte-1h3r0r0{color-scheme:dark}",
  map: null
};
const ServiceConfig$9 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let images;
  let { name } = $$props;
  let { data } = $$props;
  let newTitle = "";
  let newDate = /* @__PURE__ */ new Date();
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$5);
  images = data.images;
  return `<div class="row overflow-auto"><table class="col table table-sm"><colgroup data-svelte-h="svelte-124xxmx"><col width="10%"> <col width="15%"> <col width="75%"> <col></colgroup> <tbody><tr><td>${`<button class="btn btn-sm w-100" data-svelte-h="svelte-1dqkek5"><i class="fa-solid fa-image fa-xl"></i></button>`} <input type="file" name="newImage" form="formNew" accept=".jpg, .jpeg, .png .mp4" class="svelte-1h3r0r0"${add_styles({ "display": `none` })}></td> <td><input type="date" form="formNew" name="newDate" class="form-control form-control-sm svelte-1h3r0r0"${add_attribute("value", newDate, 0)}></td> <td><input type="text" form="formNew" name="newTitle" class="form-control form-control-sm svelte-1h3r0r0"${add_attribute("value", newTitle, 0)}></td> <td><form id="formNew" method="POST" enctype="multipart/form-data"><input type="hidden" name="name"${add_attribute("value", name, 0)} class="svelte-1h3r0r0"> <input type="hidden" name="action" value="add" class="svelte-1h3r0r0"> <button class="${[
    "btn btn-sm",
    " btn-outline-secondary"
  ].join(" ").trim()}" ${"disabled"}><i class="fa-solid fa-plus"></i></button></form></td></tr> ${each(images, (upload, i) => {
    return `<tr><td class="m-0 p-1">${upload.img.endsWith(".mp4") ? `<video${add_attribute("src", "/" + upload.img, 0)} muted class="svelte-1h3r0r0"></video>` : `<img${add_attribute("src", "/" + upload.img, 0)} alt="Upload" class="svelte-1h3r0r0">`}</td> <td class="m-0 p-1"><input type="date"${add_attribute("form", `formSave${i}`, 0)} name="date" class="form-control form-control-sm svelte-1h3r0r0"${add_attribute("value", format(upload.ts, "yyyy-MM-dd", { locale: de$1 }), 0)}></td> <td class="m-0 p-1"><input type="text"${add_attribute("form", `formSave${i}`, 0)} name="title" class="form-control form-control-sm svelte-1h3r0r0"${add_attribute("value", upload.title, 0)}></td> <td><div class="btn-group"><form${add_attribute("id", `formSave${i}`, 0)} method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)} class="svelte-1h3r0r0"> <input type="hidden" name="action" value="save" class="svelte-1h3r0r0"> <input type="hidden" name="index"${add_attribute("value", i, 0)} class="svelte-1h3r0r0"> <button class="btn btn-sm btn-outline-success" data-svelte-h="svelte-1859ymp"><i class="fa-solid fa-floppy-disk"></i> </button></form> <form method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)} class="svelte-1h3r0r0"> <input type="hidden" name="action" value="move" class="svelte-1h3r0r0"> <input type="hidden" name="dir" value="up" class="svelte-1h3r0r0"> <input type="hidden" name="index"${add_attribute("value", i, 0)} class="svelte-1h3r0r0"> <button class="${[
      "btn btn-sm",
      (i > 0 ? "btn-outline-theme" : "") + " " + (i === 0 ? "btn-outline-secondary" : "")
    ].join(" ").trim()}" ${i === 0 ? "disabled" : ""} data-svelte-h="svelte-rqrbzs"><i class="fa-solid fa-caret-up"></i> </button></form> <form method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)} class="svelte-1h3r0r0"> <input type="hidden" name="action" value="move" class="svelte-1h3r0r0"> <input type="hidden" name="dir" value="down" class="svelte-1h3r0r0"> <input type="hidden" name="index"${add_attribute("value", i, 0)} class="svelte-1h3r0r0"> <button class="${[
      "btn btn-sm",
      (i < images.length - 1 ? "btn-outline-theme" : "") + " " + (i === images.length - 1 ? "btn-outline-secondary" : "")
    ].join(" ").trim()}" ${i === images.length - 1 ? "disabled" : ""}><i class="fa-solid fa-caret-down"></i> </button></form> <form method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)} class="svelte-1h3r0r0"> <input type="hidden" name="action" value="delete" class="svelte-1h3r0r0"> <input type="hidden" name="index"${add_attribute("value", i, 0)} class="svelte-1h3r0r0"> <button class="btn btn-sm btn-outline-danger" data-svelte-h="svelte-1hs1dm9"><i class="fa-solid fa-trash"></i> </button></form> </div></td> </tr>`;
  })}</tbody></table> </div>`;
});
const css$4 = {
  code: ".bg.svelte-161yv3r{background-image:linear-gradient(to left, rgba(var(--bs-dark-rgb), 1) 60%, transparent)}",
  map: null
};
const Gallery = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isVideo;
  let $tz, $$unsubscribe_tz;
  $$unsubscribe_tz = subscribe(tz, (value) => $tz = value);
  let { image } = $$props;
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  $$result.css.add(css$4);
  isVideo = image && image.img.endsWith(".mp4");
  $$unsubscribe_tz();
  return `${image ? `${image.ratio > 1 ? `<div class="row h-100"><div class="col h-100 d-flex flex-column justify-content-end">${isVideo ? `<video${add_attribute("src", "/" + image.img, 0)} autoplay muted loop class="mh-100 mw-100" style="object-fit: contain"></video>` : `<img${add_attribute("src", "/" + image.img, 0)}${add_attribute("alt", image.title, 0)} class="mh-100 mw-100" style="object-fit: contain">`}</div> <div class="col-4 mh-100 align-self-stretch d-flex flex-column justify-content-between text-end"><div class="row"><div class="col">${each(image.title.split("\n"), (line) => {
    return `${escape(line)} <br>`;
  })}</div></div> <div class="row"><div class="rol">${escape(formatInTimeZone(image.ts, $tz, "dd. MMM yyyy", { locale: de }))}</div></div></div></div>` : `<div class="position-fixed top-0 bottom-0 end-0 w-50 p-1 bg d-flex flex-row justify-content-end svelte-161yv3r">${isVideo ? `<video${add_attribute("src", "/" + image.img, 0)} autoplay muted loop class="mh-100 mw-100" style="object-fit: contain"></video>` : `<img${add_attribute("src", "/" + image.img, 0)}${add_attribute("alt", image.title, 0)} class="h-100 mw-0" style="object-fit: contain">`}</div> <div class="row h-100"><div class="col-4 mh-100 align-self-stretch d-flex flex-column justify-content-between"><div class="row"><div class="col">${each(image.title.split("\n"), (line) => {
    return `${escape(line)} <br>`;
  })}</div></div> <div class="row"><div class="rol">${escape(formatInTimeZone(image.ts, $tz, "dd. MMM yyyy", { locale: de }))}</div></div></div></div>`}` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Es wurden noch keine Bilder hochgeladen`;
    }
  })}`}`;
});
const Service$9 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "Gallery",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${validate_component(Pagination, "Pagination").$$render(
          $$result,
          {
            prevPage: data.prevPage,
            nextPage: data.nextPage
          },
          {},
          {
            default: () => {
              return `${validate_component(Gallery, "Gallery").$$render($$result, { image: data.image }, {}, {})}`;
            }
          }
        )}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : ``} ${validate_component(ServiceConfig$9, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Gallery",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Gallery",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const ServiceConfig$8 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="row overflow-auto"><form id="form" method="POST" class="col mt-2"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <div class="row mb-2"><label for="inputDevicePath" class="col-3 col-form-label" data-svelte-h="svelte-1e0pff1">Device Path</label> <div class="col"><input id="inputDevicePath" type="text" name="devicePath"${add_attribute("value", data.config.devicePath, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputBaudRate" class="col-3 col-form-label" data-svelte-h="svelte-pnexdh">Baud rate</label> <div class="col"><input id="inputBaudRate" type="number" name="baudRaute"${add_attribute("value", data.config.baudRate, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputPauseTime" class="col-3 col-form-label" data-svelte-h="svelte-aznv3d">Pause time</label> <div class="col"><input id="inputPauseTime" type="number" name="pauseTime"${add_attribute("value", data.config.pauseTime, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputWaitTime" class="col-3 col-form-label" data-svelte-h="svelte-6ykj1b">Wait time</label> <div class="col"><input id="inputWaitTime" type="number" name="waitTime"${add_attribute("value", data.config.waitTime, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputCmdTimeout" class="col-3 col-form-label" data-svelte-h="svelte-kb03wp">CMD timeout</label> <div class="col"><input id="inputCmdTimeout" type="number" name="cmdTimeout"${add_attribute("value", data.config.cmdTimeout, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputGoogleApiKey" class="col-3 col-form-label" data-svelte-h="svelte-1m4vogd">Google API Key</label> <div class="col"><input id="inputGoogleApiKey" type="password" name="googleApiKey"${add_attribute("value", data.config.googleApiKey, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputUnwiredToken" class="col-3 col-form-label" data-svelte-h="svelte-12qdh7x">Unwired Token</label> <div class="col"><input id="inputUnwiredToken" type="password" name="unwiredToken"${add_attribute("value", data.config.unwiredToken, 0)} class="form-control"></div></div> <div class="row justify-content-end" data-svelte-h="svelte-3oa9nd"><div class="col-auto"><button type="submit" class="btn btn-theme mt-2">Save</button></div></div></form></div>`;
});
const Modem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cell;
  let { info } = $$props;
  if ($$props.info === void 0 && $$bindings.info && info !== void 0)
    $$bindings.info(info);
  cell = info.cellular;
  return `<div class="row"><div class="col"><table class="table table-sm"><colgroup data-svelte-h="svelte-1yar9b1"><col> <col width="33%"> <col width="33%"> <col width="33%"></colgroup> <tbody><tr><td data-svelte-h="svelte-jl1wxy">Operator</td> <td colspan="2">${escape(cell.operator)}</td> <td>${escape(cell.netType)}</td></tr> <tr><td data-svelte-h="svelte-1brx8we">Signal</td> <td>${escape(cell.signal ? cell.signal.toFixed(0) + "%" : "---")}</td> <td>${escape(cell.mcc)}-${escape(cell.mnc)}</td> <td>${escape(cell.lac)}-${escape(cell.cid)}</td></tr> <tr><td data-svelte-h="svelte-4zeli3">Time</td> <td>${escape(cell.time && cell.tz ? formatInTimeZone(cell.time, cell.tz, "P", { locale: de }) : "---")}</td> <td>${escape(cell.time && cell.tz ? formatInTimeZone(cell.time, cell.tz, "p", { locale: de }) : "---")}</td> <td>${escape(cell.tz ?? "---")}</td></tr> <tr><td data-svelte-h="svelte-ycfpea">GPS</td> <td>${escape(info.gps?.lat.toFixed(8) ?? "---")}</td> <td>${escape(info.gps?.lng.toFixed(8) ?? "---")}</td> <td>${escape(info.gps?.tz ?? "---")}</td></tr> <tr><td data-svelte-h="svelte-16g1sc9">GEO</td> <td>${escape(info.geo?.lat.toFixed(8) ?? "---")}</td> <td>${escape(info.geo?.lng.toFixed(8) ?? "---")}</td> <td>${escape(info.geo?.tz ?? "---")}</td></tr></tbody></table></div></div>`;
});
const Icon$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { modem } = $$props;
  if ($$props.modem === void 0 && $$bindings.modem && modem !== void 0)
    $$bindings.modem(modem);
  return `${modem?.cellular.operator ? `<div class="col-auto"><i class="fa-solid fa-globe"></i> ${escape(modem.cellular.operator.split(" ", 2)[0])}</div>` : ``} ${modem?.cellular.signal ? `<div class="col-auto"><i class="fa-solid fa-signal"></i> ${escape(modem.cellular.signal.toFixed(0))}%</div>` : ``} ${modem?.gps ? `<div class="col-auto"><i class="fa-solid fa-satellite"></i> ${escape(modem.gps.lat.toFixed(2))} | ${escape(modem.gps.lng.toFixed(2))}</div>` : `${modem?.geo ? `<div class="col-auto"><i class="fa-solid fa-earth-europe"></i> ${escape(modem.geo.lat.toFixed(2))} | ${escape(modem.geo.lng.toFixed(2))}</div>` : ``}`}`;
});
const Service$8 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { action } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "Modem",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${action === "icon" ? `${validate_component(Icon$1, "Icon").$$render($$result, { modem: data.info }, {}, {})}` : `${validate_component(Modem, "Modem").$$render($$result, { info: data.info }, {}, {})}`}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : `${form?.success ? `<div class="alert alert-success m-0" data-svelte-h="svelte-1cil5pf">Config saved!</div>` : ``}`} ${validate_component(ServiceConfig$8, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Modem",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Modem",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { connected } = $$props;
  if ($$props.connected === void 0 && $$bindings.connected && connected !== void 0)
    $$bindings.connected(connected);
  return `${connected ? `<i class="fa-solid fa-link"></i>` : `<i class="fa-solid fa-link-slash"></i>`}`;
});
const Interfaces = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { interfaces } = $$props;
  if ($$props.interfaces === void 0 && $$bindings.interfaces && interfaces !== void 0)
    $$bindings.interfaces(interfaces);
  return `<div class="row overflow-auto"><div class="col"><table class="table table-sm"><thead data-svelte-h="svelte-1ck8ph6"><tr><th>Name</th> <th>Type</th> <th>Address</th> <th>MAC</th></tr></thead> <tbody>${each(interfaces, (iface) => {
    return `${each(iface.addresses, (address, i) => {
      return `<tr><td class="fw-bold">${escape(i === 0 ? iface.name : "")}</td> <td>${escape(address.family)}</td> <td>${escape(address.address)}</td> <td>${escape(address.mac)}</td> </tr>`;
    })}`;
  })}</tbody></table></div></div>`;
});
const ServiceConfig$7 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let connections;
  let networks;
  let { name } = $$props;
  let { form } = $$props;
  let { data } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  connections = data.connections;
  networks = form?.networks ?? [];
  {
    console.log(networks);
  }
  return `<div class="row overflow-auto"><div class="col mt-2"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <div class="row"><h2 class="col" data-svelte-h="svelte-1wh7oxl">WIFIs</h2> <form method="POST" class="col-auto"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <input type="hidden" name="action" value="scan"> <button type="submit" class="btn btn-primary" data-svelte-h="svelte-1ed1jpl"><i class="fa-solid fa-magnifying-glass"></i></button></form></div> <table class="table table-sm"><colgroup data-svelte-h="svelte-1rzbjww"><col width="50%"> <col width="25%"> <col width="25%"> <col></colgroup> <thead data-svelte-h="svelte-1y8b1gk"><tr><th>SSID</th> <th>Security</th> <th>Quality</th> <th></th></tr></thead> <tbody>${each(connections, (connection) => {
    return `<tr class="table-active"><td>${escape(connection.ssid)}</td> <td>${escape(connection.security)}</td> <td>${escape(connection.quality)}</td> <td><form method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <input type="hidden" name="action" value="disconnect"> <input type="hidden" name="ssid"${add_attribute("value", connection.ssid, 0)}> <button type="submit" class="btn btn-primary" data-svelte-h="svelte-1yzhlyd"><i class="fa-solid fa-link-slash"></i></button> </form></td> </tr>`;
  })} ${each(networks, (network) => {
    return `<tr><td>${escape(network.ssid)}</td> <td>${escape(network.security)}</td> <td>${escape(network.quality)}</td> <td><form method="POST"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <input type="hidden" name="action" value="connect"> <input type="hidden" name="ssid"${add_attribute("value", network.ssid, 0)}> <button type="submit" class="btn btn-primary" data-svelte-h="svelte-1pw8439"><i class="fa-solid fa-link"></i></button> </form></td> </tr>`;
  })}</tbody></table></div></div>`;
});
const Service$7 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { action } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "Network",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${action === "icon" ? `${validate_component(Icon, "Icon").$$render($$result, { connected: data.connected }, {}, {})}` : `${validate_component(Interfaces, "Interfaces").$$render($$result, { interfaces: data.interfaces }, {}, {})}`}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : `${form?.success ? `<div class="alert alert-success m-0" data-svelte-h="svelte-1cil5pf">Config saved!</div>` : ``}`} ${validate_component(ServiceConfig$7, "ServiceConfig").$$render($$result, { name, form, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Network",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Network",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const ServiceConfig$6 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="row overflow-auto"><form id="form" method="POST" class="col mt-2"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <div class="row mb-2"><label for="inputApiUrl" class="col-3 col-form-label" data-svelte-h="svelte-1g2t5ht">API URL</label> <div class="col"><input id="inputApiUrl" type="text" name="apiUrl"${add_attribute("value", data.config.apiUrl ?? "", 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputApiKey" class="col-3 col-form-label" data-svelte-h="svelte-1oc2hjl">API key</label> <div class="col"><input id="inputApiKey" type="password" name="apiKey"${add_attribute("value", data.config.apiKey ?? "", 0)} class="form-control"></div></div> <div class="row justify-content-end" data-svelte-h="svelte-3oa9nd"><div class="col-auto"><button type="submit" class="btn btn-theme mt-2">Save</button></div></div></form></div>`;
});
const Printer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let getETA;
  let { job } = $$props;
  let { printer } = $$props;
  if ($$props.job === void 0 && $$bindings.job && job !== void 0)
    $$bindings.job(job);
  if ($$props.printer === void 0 && $$bindings.printer && printer !== void 0)
    $$bindings.printer(printer);
  getETA = () => {
    const eta = add(/* @__PURE__ */ new Date(), { seconds: job.time_remaining });
    return formatDistanceToNow(eta, { locale: de });
  };
  return `<div class="row flex-1"></div> ${job ? `<div class="row"><div class="col">${validate_component(Card, "Card").$$render($$result, {}, {}, {
    header: () => {
      return `<div>${escape(printer.state)} - #${escape(job.id)}</div> <div><i class="fa-solid fa-gauge-high"></i> ${escape(printer.speed)}%</div> `;
    },
    default: () => {
      return `<p class="display-6">Fertig in ${escape(getETA())}</p> <div class="progress mb-4"${add_styles({ "height": `4em` })}><div class="progress-bar display-6" role="progressbar"${add_attribute("aria-valuenow", job.progress, 0)} aria-valuemin="0" aria-valuemax="100"${add_styles({ "width": `${job.progress}%` })}>${escape(job.progress)}%</div></div> <table class="table table-sm"><colgroup><col${add_styles({ "width": `25%` })}> <col${add_styles({ "width": `25%` })}> <col${add_styles({ "width": `25%` })}> <col${add_styles({ "width": `25%` })}></colgroup> <tbody><tr><td data-svelte-h="svelte-5imlqa">Nozzle</td> <td class="fw-bold">${escape(printer.temp_nozzle)}°C</td> <td>${escape("->")}</td> <td>${escape(printer.target_nozzle)}°C</td></tr> <tr><td data-svelte-h="svelte-7t8a0n">Bed</td> <td class="fw-bold">${escape(printer.temp_bed)}°C</td> <td>${escape("->")}</td> <td>${escape(printer.target_bed)}°C</td></tr></tbody></table>`;
    }
  })}</div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Aktuell ist kein Druckauftrag in Bearbeitung`;
    }
  })}`}`;
});
const Service$6 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "Prusa",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${validate_component(Printer, "Printer").$$render($$result, { job: data.job, printer: data.printer }, {}, {})}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : `${form?.success ? `<div class="alert alert-success m-0" data-svelte-h="svelte-1cil5pf">Config saved!</div>` : ``}`} ${validate_component(ServiceConfig$6, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Prusa",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Prusa",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const ServiceConfig$5 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="row overflow-auto"><form id="form" method="POST" class="col mt-2"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <div class="row mb-2"><label for="inputApiKey" class="col-3 col-form-label" data-svelte-h="svelte-cnqe5t">API Key</label> <div class="col"><input id="inputApiKey" type="password" name="apiKey"${add_attribute("value", data.config.apiKey ?? "", 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputWords" class="col-3 col-form-label" data-svelte-h="svelte-1lxh57f">Words</label> <div class="col"><textarea id="inputWords" name="words" class="form-control" rows="5">${escape(data.config.words?.join("\n") ?? "", false)}</textarea></div></div> <div class="row justify-content-end" data-svelte-h="svelte-3oa9nd"><div class="col-auto"><button type="submit" class="btn btn-theme mt-2">Save</button></div></div></form></div>`;
});
const Alert = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let summary;
  let description;
  let reason;
  let duration;
  let { alert } = $$props;
  if ($$props.alert === void 0 && $$bindings.alert && alert !== void 0)
    $$bindings.alert(alert);
  summary = alert?.summary?.replace("Einschränkung", "").trim() || "";
  description = alert?.description?.replace("Linien", "").trim() || "";
  reason = alert?.reason?.replace("Grund:", "").trim() || "";
  duration = alert?.duration?.replace("Dauer:", "").replaceAll(`${format(/* @__PURE__ */ new Date(), "dd.MM.yyyy", { locale: de$1 })},`, "").trim() || "";
  return `<div class="row flex-1"></div> ${alert ? `<div class="row"><div class="col">${validate_component(Card, "Card").$$render($$result, { type: "warning" }, {}, {
    subTitle: () => {
      return `${escape(description)} `;
    },
    title: () => {
      return `${escape(summary)} `;
    },
    header: () => {
      return `<div>${escape(reason)}</div> <div>${escape(duration)}</div> `;
    },
    default: () => {
      return `${escape(alert.consequence)}`;
    }
  })}</div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Keine Einschränkungen im Betrieb der SBB`;
    }
  })}`}`;
});
const Service$5 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "SBB Alerts",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${validate_component(Pagination, "Pagination").$$render(
          $$result,
          {
            prevPage: data.prevPage,
            nextPage: data.nextPage
          },
          {},
          {
            default: () => {
              return `${validate_component(Alert, "Alert").$$render($$result, { alert: data.alert }, {}, {})}`;
            }
          }
        )}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : `${form?.success ? `<div class="alert alert-success m-0" data-svelte-h="svelte-1cil5pf">Config saved!</div>` : ``}`} ${validate_component(ServiceConfig$5, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "SBB Alerts",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "SBB Alerts",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const ServiceConfig$4 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="row overflow-auto"><form id="form" method="POST" class="col mt-2"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <div class="row mb-2"><label for="inputApiKey" class="col-3 col-form-label" data-svelte-h="svelte-cnqe5t">API Key</label> <div class="col"><input id="inputApiKey" type="password" name="apiKey"${add_attribute("value", data.config.apiKey ?? "", 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputStopPoint" class="col-3 col-form-label" data-svelte-h="svelte-1m3x9fn">Stop Point</label> <div class="col"><input id="inputStopPoint" type="text" name="stopPoint"${add_attribute("value", data.config.stopPoint ?? "", 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputItemsPerPage" class="col-3 col-form-label" data-svelte-h="svelte-1bipe7b">Items per page</label> <div class="col"><input id="inputItemsPerPage" type="number" name="itemsPerPage" min="1" max="100" step="1"${add_attribute("value", data.config.itemsPerPage, 0)} class="form-control"></div></div> <div class="row justify-content-end" data-svelte-h="svelte-3oa9nd"><div class="col-auto"><button type="submit" class="btn btn-theme mt-2">Save</button></div></div></form></div>`;
});
const Departures = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $tz, $$unsubscribe_tz;
  $$unsubscribe_tz = subscribe(tz, (value) => $tz = value);
  let { departures } = $$props;
  if ($$props.departures === void 0 && $$bindings.departures && departures !== void 0)
    $$bindings.departures(departures);
  $$unsubscribe_tz();
  return `<div class="row flex-1"></div> ${departures.length > 0 ? `${each(departures, (departure) => {
    return `<div class="row fs-2"><div class="col-3">${escape(formatInTimeZone(departure.scheduled, $tz, "HH:mm", { locale: de$1 }))} ${departure.delay > 0 ? `<span class="text-red">+${escape(departure.delay)}</span>` : ``}</div> <div class="col-1">${departure.type === "rail" ? `<i class="fa-solid fa-train"></i>` : `${departure.type === "tram" ? `<i class="fa-solid fa-train-tram"></i>` : `${departure.type === "bus" ? `<i class="fa-solid fa-bus"></i>` : `${escape(departure.type)}`}`}`}</div> <div class="col-2">${escape(departure.lineName)}</div> <div class="col">${escape(departure.destination)}</div> </div>`;
  })}` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Es wurden keine Abfahrten gefunden`;
    }
  })}`}`;
});
const Service$4 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "SBB Departures",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${validate_component(Pagination, "Pagination").$$render(
          $$result,
          {
            prevPage: data.prevPage,
            nextPage: data.nextPage
          },
          {},
          {
            default: () => {
              return `${validate_component(Departures, "Departures").$$render($$result, { departures: data.departures }, {}, {})}`;
            }
          }
        )}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : `${form?.success ? `<div class="alert alert-success m-0" data-svelte-h="svelte-1cil5pf">Config saved!</div>` : ``}`} ${validate_component(ServiceConfig$4, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "SBB Departures",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "SBB Departures",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const ServiceConfig$3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<form id="form" method="POST" class="col mt-2"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <div class="row mb-2"><label for="inputFeedId" class="col-3 col-form-label" data-svelte-h="svelte-t1h3ut">Feed ID</label> <div class="col"><input id="inputFeedId" type="text" name="feedId"${add_attribute("value", data.config.feedId ?? "", 0)} class="form-control"></div></div> <div class="row mb-2" data-svelte-h="svelte-1a9kiu9"><div class="col-3"></div> <div class="col"><table class="table table-sm"><thead class="table-dark"><tr><th>Kategorie</th> <th>Feed ID</th></tr></thead> <tbody><tr><td>Allgemein</td> <td>1646</td></tr> <tr><td>Sport</td> <td>718</td></tr> <tr><td>Kultur</td> <td>454</td></tr> <tr><td>Wissen</td> <td>630</td></tr></tbody></table></div></div> <div class="row mb-2"><label for="inputItemsPerPage" class="col-3 col-form-label" data-svelte-h="svelte-1bipe7b">Items per page</label> <div class="col"><input id="inputItemsPerPage" type="number" name="itemsPerPage" min="1" max="100" step="1"${add_attribute("value", data.config.itemsPerPage, 0)} class="form-control"></div></div> <div class="row justify-content-end" data-svelte-h="svelte-1q9tbq9"><div class="col-auto"><button type="submit" class="btn btn-theme mt-2">Save</button></div></div></form>`;
});
const css$3 = {
  code: ".abstract.svelte-1ja6365.svelte-1ja6365{font-size:1.4em;line-height:1em}iframe.svelte-1ja6365.svelte-1ja6365{width:100%;height:100%;border:1px solid gray}.details.svelte-1ja6365.svelte-1ja6365{position:fixed;top:0;left:0;right:0;bottom:0;padding:8px;background-color:rgba(var(--bs-white-rgb), 0.2);z-index:1000}.details.svelte-1ja6365 .btn.svelte-1ja6365{position:absolute;top:16px;right:16px}.image.svelte-1ja6365.svelte-1ja6365{position:relative;overflow:hidden}.image.svelte-1ja6365 img.svelte-1ja6365{position:absolute;max-width:100%}",
  map: null
};
const News = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { articles } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.articles === void 0 && $$bindings.articles && articles !== void 0)
    $$bindings.articles(articles);
  $$result.css.add(css$3);
  return `${``} <div class="row flex-1"></div> ${articles.length > 0 ? `${each(articles, (item) => {
    return `<div role="presentation" class="row mb-1 flex-1"><div class="col-3 me-1 image svelte-1ja6365"><img alt="Thumbnail"${add_attribute("src", "/" + item.image, 0)} class="mh-100 mw-100 svelte-1ja6365" style="object-fit: contain"></div> <div class="col abstract d-flex flex-column justify-content-around svelte-1ja6365"><div class="fs-4">${escape(item.title)}</div> <div class="fs-6 text-muted">${escape(formatDistanceToNow(item.ts, { locale: de$1, addSuffix: true }))} </div></div> </div>`;
  })}` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Es wurden keine Newseinträge gefunden`;
    }
  })}`}`;
});
const css$2 = {
  code: "html,body{margin:0;padding:0;font-size:32px}.main.svelte-twlnpi{padding:0.5em}",
  map: null
};
const Details = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { simple } = $$props;
  let { head } = $$props;
  let { body } = $$props;
  if ($$props.simple === void 0 && $$bindings.simple && simple !== void 0)
    $$bindings.simple(simple);
  if ($$props.head === void 0 && $$bindings.head && head !== void 0)
    $$bindings.head(head);
  if ($$props.body === void 0 && $$bindings.body && body !== void 0)
    $$bindings.body(body);
  $$result.css.add(css$2);
  return `${$$result.head += `<!-- HEAD_svelte-1rtpznj_START -->${!simple ? `<base href="https://www.srf.ch/"> <!-- HTML_TAG_START -->${head}<!-- HTML_TAG_END -->` : ``}<!-- HEAD_svelte-1rtpznj_END -->`, ""} <div class="main overflow-scroll svelte-twlnpi"><!-- HTML_TAG_START -->${body}<!-- HTML_TAG_END --> </div>`;
});
const Service$3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "SRF",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded && data?.type !== "details"
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${validate_component(Pagination, "Pagination").$$render(
          $$result,
          {
            prevPage: data.prevPage,
            nextPage: data.nextPage
          },
          {},
          {
            default: () => {
              return `${validate_component(News, "News").$$render($$result, { name, articles: data.articles }, {}, {})}`;
            }
          }
        )}` : `${data.type === "details" ? `${validate_component(Details, "Details").$$render(
          $$result,
          {
            head: data.head,
            body: data.body,
            simple: data.simple
          },
          {},
          {}
        )}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : `${form?.success ? `<div class="alert alert-success m-0" data-svelte-h="svelte-1cil5pf">Config saved!</div>` : ``}`} ${validate_component(ServiceConfig$3, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "SRF",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "SRF",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const ServiceConfig$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="row overflow-auto"><form id="form" method="POST" class="col mt-2"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <div class="row mb-2"><label for="inputUsername" class="col-3 col-form-label" data-svelte-h="svelte-hrqyld">Username</label> <div class="col"><input id="inputUsername" type="text" name="username"${add_attribute("value", data.config.username ?? "", 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputPassword" class="col-3 col-form-label" data-svelte-h="svelte-1x63pdj">Password</label> <div class="col"><input id="inputPassword" type="password" name="password"${add_attribute("value", data.config.password ?? "", 0)} class="form-control"></div></div> <div class="row justify-content-end" data-svelte-h="svelte-3oa9nd"><div class="col-auto"><button type="submit" class="btn btn-theme mt-2">Save</button></div></div></form></div>`;
});
function formatDims({ x, y, z }) {
  return `${Math.round(x / 10)} x ${Math.round(y / 10)} x ${Math.round(z / 10)} cm`;
}
function formatWeight(weight) {
  return weight > 1e3 ? `${Math.round(weight / 100) / 10} kg` : `${weight} g`;
}
const Shipment = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let event;
  let $tz, $$unsubscribe_tz;
  $$unsubscribe_tz = subscribe(tz, (value) => $tz = value);
  let { shipment } = $$props;
  if ($$props.shipment === void 0 && $$bindings.shipment && shipment !== void 0)
    $$bindings.shipment(shipment);
  event = shipment.events[0];
  $$unsubscribe_tz();
  return `<div class="row flex-1"></div> ${shipment ? `<div class="row"><div class="col">${validate_component(Card, "Card").$$render($$result, {}, {}, {
    subTitle: () => {
      return `${escape(shipment.sender ? shipment.type : "")} `;
    },
    title: () => {
      return `${escape(shipment.sender ?? shipment.type)} `;
    },
    header: () => {
      return `<div><i class="fa-solid fa-hashtag"></i> ${escape(shipment.number)}</div> ${shipment.arrival ? `<div><i class="fa-solid fa-calendar"></i> ${escape(formatInTimeZone(parseISO(shipment.arrival), $tz, "dd.MM.yy", { locale: de$1 }))}</div>` : ``} `;
    },
    default: () => {
      return `<div class="row"><div class="col">${shipment.dims ? `<i class="fa-solid fa-ruler-combined"></i> ${escape(formatDims(shipment.dims))} <br>` : ``} ${shipment.weight ? `<i class="fa-solid fa-scale-balanced"></i> ${escape(formatWeight(shipment.weight))} <br>` : ``} ${shipment.status ? `<i class="fa-solid fa-truck-fast"></i> ${escape(shipment.status)}` : ``}</div> <div class="col">${event ? `<div>${escape(formatInTimeZone(event.ts, $tz, "dd.MM.yy - HH:mm:ss", { locale: de$1 }))}</div> <div>${escape(event.event)}</div>` : ``}</div></div>`;
    }
  })}</div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Keine Sendungen der Post unterwegs`;
    }
  })}`}`;
});
const Service$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "Swiss Post",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${validate_component(Pagination, "Pagination").$$render(
          $$result,
          {
            prevPage: data.prevPage,
            nextPage: data.nextPage
          },
          {},
          {
            default: () => {
              return `${validate_component(Shipment, "Shipment").$$render($$result, { shipment: data.shipment }, {}, {})}`;
            }
          }
        )}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : `${form?.success ? `<div class="alert alert-success m-0" data-svelte-h="svelte-1cil5pf">Config saved!</div>` : ``}`} ${validate_component(ServiceConfig$2, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Swiss Post",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Swiss Post",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const ServiceConfig$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="row overflow-auto"><form id="form" method="POST" class="col mt-2"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <div class="row mb-2"><label for="inputClientId" class="col-3 col-form-label" data-svelte-h="svelte-24tnhb">Client ID</label> <div class="col"><input id="inputClientId" type="text" name="clientId"${add_attribute("value", data.config.clientId, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputClientSecret" class="col-3 col-form-label" data-svelte-h="svelte-tuyuu3">Client Secret</label> <div class="col"><input id="inputClientSecret" type="password" name="clientSecret"${add_attribute("value", data.config.clientSecret, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputDeviceIp" class="col-3 col-form-label" data-svelte-h="svelte-yymrx5">Device IP</label> <div class="col"><input id="inputDeviceIp" type="text" name="deviceIp"${add_attribute("value", data.config.deviceIp, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputProtocolVersion" class="col-3 col-form-label" data-svelte-h="svelte-1rdyw5z">Protocol Version</label> <div class="col"><input id="inputProtocolVersion" type="text" name="protocolVersion"${add_attribute("value", data.config.protocolVersion, 0)} class="form-control"></div></div> <div class="row justify-content-end" data-svelte-h="svelte-3oa9nd"><div class="col-auto"><button type="submit" class="btn btn-theme mt-2">Save</button></div></div></form></div>`;
});
const Info = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { info } = $$props;
  if ($$props.info === void 0 && $$bindings.info && info !== void 0)
    $$bindings.info(info);
  return `<div class="row flex-1"></div> <div class="row"><div class="col">${validate_component(Card, "Card").$$render($$result, {}, {}, {
    header: () => {
      return `<div data-svelte-h="svelte-1y6pajl">PIXI Smart Fountain</div> <div><i class="fa-solid fa-power-off"></i> ${escape(info.on ? "ON" : "OFF")}</div> `;
    },
    default: () => {
      return `<div class="row"><div class="col-3" data-svelte-h="svelte-1jomz95"><i class="fa-solid fa-filter"></i></div> <div class="col"><div class="progress mt-1"><div class="progress-bar bg-danger" role="progressbar"${add_attribute("aria-valuenow", info.filterLife, 0)} aria-valuemin="0" aria-valuemax="100"${add_styles({ "width": `${info.filterLife}%` })}>${escape(info.filterLife.toFixed(0))}%</div></div></div></div> <div class="row"><div class="col-1" data-svelte-h="svelte-g7gflt"><i class="fa-regular fa-lightbulb"></i></div> <div class="col-2">${escape(info.uv ? "ON" : "OFF")}</div> <div class="col"><div class="progress mt-1"><div class="progress-bar bg-danger" role="progressbar"${add_attribute("aria-valuenow", info.uvRuntime, 0)} aria-valuemin="0" aria-valuemax="100"${add_styles({ "width": `${info.uvRuntime}%` })}>${escape(info.uvRuntime.toFixed(0))}%</div></div></div></div> <div class="row"><div class="col-1" data-svelte-h="svelte-11k8iq5"><i class="fa-solid fa-droplet"></i></div> <div class="col-2">${escape(info.waterState ? "ON" : "OFF")}</div> <div class="col"><div class="progress mt-1"><div class="progress-bar" role="progressbar"${add_attribute("aria-valuenow", info.waterLevel, 0)} aria-valuemin="0" aria-valuemax="100"${add_styles({ "width": `${info.waterLevel}%` })}>${escape(info.waterLevel)}%</div></div></div></div>`;
    }
  })}</div></div>`;
});
const Service$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "Tuya",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "data" ? `${validate_component(Info, "Info").$$render($$result, { info: data.info }, {}, {})}` : `${data.type === "config" ? `${form?.message ? `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}` : `${form?.success ? `<div class="alert alert-success m-0" data-svelte-h="svelte-1cil5pf">Config saved!</div>` : ``}`} ${validate_component(ServiceConfig$1, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Tuya",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Tuya",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const ServiceConfig = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  let useGps = data.config.useGps;
  let useGeo = data.config.useGeo;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="row overflow-auto"><form id="form" method="POST" class="col mt-2"><input type="hidden" name="name"${add_attribute("value", name, 0)}> <div class="row mb-2"><div class="col"><div class="form-check form-switch"><input type="checkbox" name="useGps" class="form-check-input" id="switchUseGps"${add_attribute("checked", useGps, 1)}> <label class="form-check-label" for="switchUseGps" data-svelte-h="svelte-jhwlkj">Use GPS</label></div></div> <div class="col"><div class="form-check form-switch"><input type="checkbox" name="useGeo" class="form-check-input" id="switchUseGeo"${add_attribute("checked", useGeo, 1)}> <label class="form-check-label" for="switchUseGeo" data-svelte-h="svelte-19ng4cx">Use GEO</label></div></div></div> ${useGps || useGeo ? `<div class="row mb-2"><label for="selectModemService" class="col-3 col-form-label" data-svelte-h="svelte-1j3a370">Modem</label> <div class="col"><select id="selectModemService" name="modemService" class="form-select"${add_attribute("value", data.config.modemService, 0)}>${each(data.modems, (srv) => {
    return `<option${add_attribute("value", srv.name, 0)}>${escape(srv.name)}</option>`;
  })}</select></div></div>` : `<input type="hidden" name="modemService" value="">`} <div class="row mb-2"><label for="inputLat" class="col-3 col-form-label" data-svelte-h="svelte-a3oggu">Latitude</label> <div class="col"><input id="inputLat" type="number" name="lat" step="any"${add_attribute("value", data.config.lat, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputLng" class="col-3 col-form-label" data-svelte-h="svelte-furib9">Longitude</label> <div class="col"><input id="inputLng" type="number" name="lng" step="any"${add_attribute("value", data.config.lng, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputMinDiff" class="col-3 col-form-label" data-svelte-h="svelte-1x0z3k5">Min Diff</label> <div class="col"><input id="inputMinDiff" type="number" name="minDiff"${add_attribute("value", data.config.minDiff, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputApiKey" class="col-3 col-form-label" data-svelte-h="svelte-1oc2hjl">API key</label> <div class="col"><input id="inputApiKey" type="password" name="apiKey"${add_attribute("value", data.config.apiKey, 0)} class="form-control"></div></div> <div class="row mb-2"><label for="inputItemsPerPage" class="col-3 col-form-label" data-svelte-h="svelte-1bipe7b">Items per page</label> <div class="col"><input id="inputItemsPerPage" type="number" name="itemsPerPage" min="1" max="100" step="1"${add_attribute("value", data.config.itemsPerPage, 0)} class="form-control"></div></div> <div class="row justify-content-end" data-svelte-h="svelte-3oa9nd"><div class="col-auto"><button type="submit" class="btn btn-theme mt-2">Save</button></div></div></form></div>`;
});
const Marker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { location } = $$props;
  if ($$props.location === void 0 && $$bindings.location && location !== void 0)
    $$bindings.location(location);
  return `<div class="row justify-content-end"><div class="col-auto text-muted"><i class="fa-solid fa-map-location-dot"></i> ${location.place ? `${escape(location.place)}` : `${escape(location.lat)}, ${escape(location.lng)}`}</div></div>`;
});
const css$1 = {
  code: ".text.svelte-1q8su6z{font-size:2.5em}img.svelte-1q8su6z{width:100%}",
  map: null
};
const Daily = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $tz, $$unsubscribe_tz;
  $$unsubscribe_tz = subscribe(tz, (value) => $tz = value);
  let { location } = $$props;
  let { daily } = $$props;
  if ($$props.location === void 0 && $$bindings.location && location !== void 0)
    $$bindings.location(location);
  if ($$props.daily === void 0 && $$bindings.daily && daily !== void 0)
    $$bindings.daily(daily);
  $$result.css.add(css$1);
  $$unsubscribe_tz();
  return `${validate_component(Marker, "Marker").$$render($$result, { location }, {}, {})} <div class="row flex-1"></div> <div class="row flex-nowrap">${each(daily, (forecast) => {
    return `<div class="col d-flex flex-column justify-content-between align-items-center"><div class="text svelte-1q8su6z">${escape(formatInTimeZone(forecast.ts, $tz, "iiiiii", { locale: de }))}</div> <img${add_attribute("src", forecast.img, 0)} alt="Weather icon" class="svelte-1q8su6z"> <div class="text svelte-1q8su6z" style="color: #23ad00">${escape(forecast.feelsLike.toFixed(0))}°</div> </div>`;
  })} </div>`;
});
const css = {
  code: ".text.svelte-1q8su6z{font-size:2.5em}img.svelte-1q8su6z{width:100%}",
  map: null
};
const Hourly = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $tz, $$unsubscribe_tz;
  $$unsubscribe_tz = subscribe(tz, (value) => $tz = value);
  let { location } = $$props;
  let { hourly } = $$props;
  if ($$props.location === void 0 && $$bindings.location && location !== void 0)
    $$bindings.location(location);
  if ($$props.hourly === void 0 && $$bindings.hourly && hourly !== void 0)
    $$bindings.hourly(hourly);
  $$result.css.add(css);
  $$unsubscribe_tz();
  return `${validate_component(Marker, "Marker").$$render($$result, { location }, {}, {})} <div class="row flex-1"></div> <div class="row flex-nowrap">${each(hourly, (forecast) => {
    return `<div class="col d-flex flex-column justify-content-between align-items-center"><div class="text svelte-1q8su6z">${escape(formatInTimeZone(forecast.ts, $tz, "HH''", { locale: de }))}</div> <img${add_attribute("src", forecast.img, 0)} alt="Weather icon" class="svelte-1q8su6z"> <div class="text svelte-1q8su6z" style="color: #23ad00">${escape(forecast.feelsLike.toFixed(0))}°</div> </div>`;
  })} </div>`;
});
const Alerts = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $tz, $$unsubscribe_tz;
  $$unsubscribe_tz = subscribe(tz, (value) => $tz = value);
  let { location } = $$props;
  let { alert } = $$props;
  if ($$props.location === void 0 && $$bindings.location && location !== void 0)
    $$bindings.location(location);
  if ($$props.alert === void 0 && $$bindings.alert && alert !== void 0)
    $$bindings.alert(alert);
  $$unsubscribe_tz();
  return `${validate_component(Marker, "Marker").$$render($$result, { location }, {}, {})} <div class="row flex-1"></div> ${alert ? `<div class="row mh-100 overflow-auto"><div class="col mh-100">${validate_component(Card, "Card").$$render($$result, { type: "warning" }, {}, {
    subTitle: () => {
      return `${escape(alert.sender)} `;
    },
    title: () => {
      return `${escape(alert.event)} `;
    },
    header: () => {
      return `<div>${escape(alert.tags)}</div> <div><i class="fa-solid fa-calendar"></i> ${escape(formatInTimeZone(alert.start, $tz, "dd.MM.yy HH:mm", { locale: de }))} -
						${escape(formatInTimeZone(alert.end, $tz, "dd.MM.yy HH:mm", { locale: de }))}</div> `;
    },
    default: () => {
      return `<ul class="m-0 p-0 ms-3">${each(alert.content.split("\n"), (line) => {
        return `<li>${escape(line.substring(2))}</li>`;
      })}</ul>`;
    }
  })}</div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Aktuell sind keine Wetter-Warnungen vorhanden`;
    }
  })}`}`;
});
const Service = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { data } = $$props;
  let { form } = $$props;
  let { isEmbedded = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.isEmbedded === void 0 && $$bindings.isEmbedded && isEmbedded !== void 0)
    $$bindings.isEmbedded(isEmbedded);
  return `${validate_component(PageLayout, "PageLayout").$$render(
    $$result,
    {
      title: "Weather",
      subTitle: name,
      closeUrl: "/services",
      show: !isEmbedded
    },
    {},
    {
      default: () => {
        return `${data ? `${data.type === "hourly" ? `${validate_component(Hourly, "Hourly").$$render(
          $$result,
          {
            location: data.location,
            hourly: data.hourly
          },
          {},
          {}
        )}` : `${data.type === "daily" ? `${validate_component(Daily, "Daily").$$render(
          $$result,
          {
            location: data.location,
            daily: data.daily
          },
          {},
          {}
        )}` : `${data.type === "alerts" ? `${validate_component(Pagination, "Pagination").$$render(
          $$result,
          {
            prevPage: data.prevPage,
            nextPage: data.nextPage
          },
          {},
          {
            default: () => {
              return `${validate_component(Alerts, "Alerts").$$render(
                $$result,
                {
                  location: data.location,
                  alert: data.alert
                },
                {},
                {}
              )}`;
            }
          }
        )}` : `${data.type === "config" ? `${form ? `${form.success ? `<div class="alert alert-success m-0" data-svelte-h="svelte-1cil5pf">Config saved!</div>` : `${validate_component(ErrorCard, "ErrorCard").$$render($$result, { message: form.message }, {}, {})}`}` : ``} ${validate_component(ServiceConfig, "ServiceConfig").$$render($$result, { name, data }, {}, {})}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Weather",
            message: "Unknown action",
            params: { name, data }
          },
          {},
          {}
        )}`}`}`}`}` : `${validate_component(ErrorCard, "ErrorCard").$$render(
          $$result,
          {
            title: "Weather",
            message: "Missing data",
            params: { name }
          },
          {},
          {}
        )}`}`;
      }
    }
  )}`;
});
const SERVICES = {
  [BATTERY_SERVICE_TYPE]: Service$d,
  [CALENDAR_SERVICE_TYPE]: Service$c,
  [CAROUSEL_SERVICE_TYPE]: Service$b,
  [EPIC_GAMES_SERVICE_TYPE]: Service$a,
  [GALLERY_SERVICE_TYPE]: Service$9,
  [MODEM_SERVICE_TYPE]: Service$8,
  [NETWORK_SERVICE_TYPE]: Service$7,
  [PRUSA_SERVICE_TYPE]: Service$6,
  [SBB_ALERTS_SERVICE_TYPE]: Service$5,
  [SBB_DEPARTURES_SERVICE_TYPE]: Service$4,
  [SRF_SERVICE_TYPE]: Service$3,
  [SWISS_POST_SERVICE_TYPE]: Service$2,
  [TUYA_SERVICE_TYPE]: Service$1,
  [WEATHER_SERVICE_TYPE]: Service
};

export { PageLayout as P, SERVICES as S };
//# sourceMappingURL=services2-r1PAYVoz.js.map
