import { r as redirect } from './index-H42hWO6o.js';
import { C as Counter, a as CounterType } from './counter-Dt35QKyi.js';
import { g as getData } from './data-d5P2oJKd.js';
import { g as getData$1 } from './data2-j1H-xDgc.js';
import { isSameDay } from 'date-fns';
import Holidays from 'date-holidays';
import { B as BaseLogger } from './BaseLogger-SyOYFtXW.js';
import { g as getScreens, a as getScreenUrl } from './data3-Kdiu0Rmi.js';
import 'node:fs/promises';
import 'node:path';
import './shared-server-49TKSBDM.js';
import './BaseCache-CtKtXkXQ.js';
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
const counter = new Counter({
  type: CounterType.Wrap
});
const load = async ({ url, depends }) => {
  const index = Number(url.searchParams.get("screen") || "---");
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
  const idx = isFinite(index) ? counter.fit(index) : null;
  const currScreen = idx !== null ? getScreenUrl(idx, dir) : null;
  if (currScreen && !currScreen.startsWith(urlScreenName)) {
    throw redirect(302, currScreen);
  }
  const nextScreen = idx !== null ? getScreenUrl(counter.fit(idx + 1), "next") : null;
  const prevScreen = idx !== null ? getScreenUrl(counter.fit(idx - 1), "prev") : null;
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
const component = async () => component_cache ??= (await import('./_layout.svelte-XVhuWam4.js')).default;
const server_id = "src/routes/screens/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.1ml4LqXy.js","_app/immutable/chunks/4.3xRaw29T.js","_app/immutable/chunks/index.wgffNSnY.js","_app/immutable/chunks/entry.wt3AcDH9.js","_app/immutable/chunks/index.-WvGjXqt.js","_app/immutable/chunks/index.hqnGnc7n.js","_app/immutable/chunks/stores.rTfm2Bnf.js","_app/immutable/chunks/screen.f0YZ8vtt.js","_app/immutable/chunks/swipe.ysJLwxnX.js","_app/immutable/chunks/time.nhAbNM2u.js","_app/immutable/chunks/format.-3CDNjnq.js","_app/immutable/chunks/de.5ejuWyRG.js","_app/immutable/chunks/constructFrom.5xxej_j7.js"];
const stylesheets = ["_app/immutable/assets/2.R48Vup9m.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-HkzHcXYE.js.map
