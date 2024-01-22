import { r as redirect } from './index-0087e825.js';
import { C as Counter } from './counter-b37d52dc.js';
import { g as getData } from './data-4ed13202.js';
import { g as getData$1 } from './data2-94174801.js';
import { isSameDay } from 'date-fns';
import Holidays from 'date-holidays';
import { B as BaseLogger } from './BaseLogger-c8654638.js';
import { g as getScreens, a as getScreenUrl } from './data3-99cb470a.js';
import 'node:fs/promises';
import 'node:path';
import './shared-server-b7e48788.js';
import './BaseCache-36285add.js';
import 'geo-tz';
import 'serialport';
import 'node:util';
import 'chalk';

const holidays = new Holidays("CH", "ZH");
const logger = new BaseLogger("HOLIDAYS");
let lastHoliday = null;
let lastCheck = /* @__PURE__ */ new Date(0);
function getHoliday() {
  const now = /* @__PURE__ */ new Date();
  if (isSameDay(lastCheck, now)) {
    logger.debug("Using cached holiday");
    return lastHoliday;
  }
  logger.debug("Updating...");
  const startTime = process.hrtime.bigint();
  try {
    const holi = holidays.isHoliday(now);
    lastHoliday = holi ? holi[0] : null;
    lastCheck = now;
  } catch (err) {
    logger.toSvelteError(err);
  } finally {
    const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
    logger.info("Updated", diffTime, "ms");
  }
  return lastHoliday;
}
const counter = new Counter();
const load = async ({ url, depends }) => {
  const index = Number(url.searchParams.get("screen") || "-");
  const dir = url.searchParams.get("dir") === "prev" ? "prev" : "next";
  const urlScreenName = url.pathname;
  const [screens, battery, modem] = await Promise.all([
    getScreens().catch(() => []),
    getData().catch(() => null),
    getData$1().catch(() => null)
  ]);
  depends("screens:layout");
  counter.max = screens.length;
  if (urlScreenName.length <= 8 && screens.length > 0) {
    throw redirect(302, getScreenUrl(0, dir));
  }
  const idx = isFinite(index) ? counter.wrap(index) : null;
  const currScreen = idx !== null ? getScreenUrl(idx, dir) : null;
  if (currScreen && !currScreen.startsWith(urlScreenName)) {
    throw redirect(302, currScreen);
  }
  const nextScreen = idx !== null ? getScreenUrl(counter.wrap(idx + 1), "next") : null;
  const prevScreen = idx !== null ? getScreenUrl(counter.wrap(idx - 1), "prev") : null;
  const skipScreen = idx !== null ? dir === "next" ? nextScreen : prevScreen : null;
  const holiday = getHoliday();
  return {
    dir,
    index,
    screens,
    currScreen,
    nextScreen,
    prevScreen,
    skipScreen,
    modem,
    battery,
    holiday
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-19fa7cc9.js')).default;
const server_id = "src/routes/screens/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.c3d0bfb2.js","_app/immutable/chunks/scheduler.4295992e.js","_app/immutable/chunks/index.48621620.js","_app/immutable/chunks/navigation.03a9efcd.js","_app/immutable/chunks/singletons.92980102.js","_app/immutable/chunks/index.c59decee.js","_app/immutable/chunks/index.56b08a40.js","_app/immutable/chunks/stores.49b78bc3.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/screen.69f6b3b9.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/time.ec5210e0.js","_app/immutable/chunks/index.1d3dadfb.js"];
const stylesheets = ["_app/immutable/assets/2.f9da27c9.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-c50f064e.js.map
