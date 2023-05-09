import { r as redirect } from './index-39e97e00.js';
import { C as Counter } from './counter-b37d52dc.js';
import { g as getData } from './data-90e5e69a.js';
import { g as getData$1 } from './data2-0f7fac83.js';
import { isSameDay } from 'date-fns';
import Holidays from 'date-holidays';
import { B as BaseLogger } from './BaseLogger-d23f9d0c.js';
import { g as getScreens, a as getScreenUrl } from './screen2-bae7bdc1.js';
import 'node:fs/promises';
import './shared-server-b7e48788.js';
import './BaseCache-8b1d2e36.js';
import 'geo-tz';
import 'serialport';
import 'node:util';
import 'chalk';
import 'node:path';

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
const component = async () => (await import('./_layout.svelte-7baee5a7.js')).default;
const server_id = "src/routes/screens/+layout.server.ts";
const imports = ["_app/immutable/chunks/2.13c693b4.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/navigation.a811c17b.js","_app/immutable/chunks/singletons.7caf11e7.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/index.856bf999.js","_app/immutable/chunks/stores.08572bbf.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/screen.05a4b398.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/time.c4f0045c.js","_app/immutable/chunks/index.f6d0c5d4.js"];
const stylesheets = ["_app/immutable/assets/2.f9da27c9.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-a126468b.js.map
