import { r as redirect } from './index-C-arhqvZ.js';
import { C as Counter, a as CounterType } from './counter-BozXqImb.js';
import { g as getData } from './data-BabsLH2p.js';
import { g as getData$1 } from './data2-BvrAazN9.js';
import { isSameDay } from 'date-fns';
import Holidays from 'date-holidays';
import { B as BaseLogger } from './BaseLogger-B58-fQ4u.js';
import { g as getScreens, a as getScreenUrl } from './data3-h9KTDbMS.js';
import 'node:fs/promises';
import 'node:path';
import './shared-server-BfUoNEXY.js';
import './BaseCache-BtPY9_DY.js';
import 'geo-tz/now';
import '@googlemaps/google-maps-services-js';
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
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
    holiday,
    tz: modem?.gps?.tz || modem?.geo?.tz || modem?.cellular.tz || localTz
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-Kuy4iYDM.js')).default;
const server_id = "src/routes/screens/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.E1drP3tS.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js","_app/immutable/chunks/entry._ukVWh6f.js","_app/immutable/chunks/index.DknyqqiT.js","_app/immutable/chunks/index.BDhO882L.js","_app/immutable/chunks/stores.CntYxvtA.js","_app/immutable/chunks/screen.Ck7z3_AO.js","_app/immutable/chunks/swipe.CFeUBoSp.js","_app/immutable/chunks/time.DnlTQaVB.js","_app/immutable/chunks/index.Bwn2MeFA.js","_app/immutable/chunks/format.BMwO3m9q.js","_app/immutable/chunks/de.DgNxBmDO.js"];
const stylesheets = ["_app/immutable/assets/2.7Q-WrJFp.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-Bicv3_mj.js.map
