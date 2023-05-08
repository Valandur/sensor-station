import { r as redirect } from './index-39e97e00.js';
import { isSameDay } from 'date-fns';
import Holidays from 'date-holidays';
import { L as Logger } from './logger-515117da.js';
import { g as getScreens, a as getScreenUrl } from './screen2-533d4d19.js';
import { g as getStatus$1 } from './battery-25318416.js';
import { g as getStatus } from './modem-0f6b874f.js';
import 'node:util';
import 'chalk';
import 'node:fs/promises';
import 'node:path';
import './counter-b37d52dc.js';
import './environment-19782cc3.js';
import './prod-ssr-17392843.js';
import './shared-server-b7e48788.js';
import 'geo-tz';
import '@serialport/parser-inter-byte-timeout';
import 'serialport';

const holidays = new Holidays("CH", "ZH");
const logger = new Logger("HOLIDAYS");
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
const load = async ({ url, depends }) => {
  const index = Number(url.searchParams.get("screen") || "-");
  const dir = url.searchParams.get("dir") === "prev" ? "prev" : "next";
  const urlScreenName = url.pathname;
  const [screens, modem, battery] = await Promise.all([
    getScreens().catch(() => []),
    getStatus().catch(() => null),
    getStatus$1().catch(() => null)
  ]);
  depends("screens:layout");
  if (urlScreenName.length <= 8 && screens.length > 0) {
    throw redirect(302, getScreenUrl(0, dir));
  }
  const idx = isFinite(index) ? index : null;
  const currScreen = idx !== null ? getScreenUrl(index, dir) : null;
  if (currScreen && !currScreen.startsWith(urlScreenName)) {
    throw redirect(302, currScreen);
  }
  const nextScreen = idx !== null ? getScreenUrl(idx + 1, "next") : null;
  const prevScreen = idx !== null ? getScreenUrl(idx - 1, "prev") : null;
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

const index = 5;
const component = async () => (await import('./_layout.svelte-da12529d.js')).default;
const server_id = "src/routes/screens/+layout.server.ts";
const imports = ["_app/immutable/chunks/5.aa7b5a0a.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/navigation.ce121efb.js","_app/immutable/chunks/singletons.6f8482f6.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/index.856bf999.js","_app/immutable/chunks/stores.8e8af073.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/screen.05a4b398.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/time.c4f0045c.js","_app/immutable/chunks/index.f6d0c5d4.js"];
const stylesheets = ["_app/immutable/assets/5.f9da27c9.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-993ae59f.js.map
