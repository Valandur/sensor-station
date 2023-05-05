import { r as redirect } from './index-39e97e00.js';
import { isSameDay } from 'date-fns';
import Holidays from 'date-holidays';
import { g as getScreens, a as getScreenUrl } from './screen2-533d4d19.js';
import { g as getStatus$1 } from './battery-6ce93987.js';
import { g as getStatus } from './modem-e226ba54.js';
import 'node:fs/promises';
import 'node:path';
import './counter-b37d52dc.js';
import './logger-515117da.js';
import 'node:util';
import 'chalk';
import './environment-19782cc3.js';
import './prod-ssr-17392843.js';
import './shared-server-b7e48788.js';
import 'geo-tz';
import '@serialport/parser-inter-byte-timeout';
import 'serialport';

const holidays = new Holidays("CH", "ZH");
let lastHoliday = null;
let lastCheck = /* @__PURE__ */ new Date(0);
function getHoliday() {
  const now = /* @__PURE__ */ new Date();
  if (isSameDay(lastCheck, now)) {
    return lastHoliday;
  }
  const holi = holidays.isHoliday(now);
  lastHoliday = holi ? holi[0] : null;
  lastCheck = now;
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

const index = 4;
const component = async () => (await import('./_layout.svelte-f191e5f4.js')).default;
const server_id = "src/routes/screens/+layout.server.ts";
const imports = ["_app/immutable/chunks/4.a4f909c3.js","_app/immutable/chunks/index.dd49bebd.js","_app/immutable/chunks/screen.754bb683.js","_app/immutable/chunks/index.ad955a6c.js","_app/immutable/chunks/navigation.8ea9c79f.js","_app/immutable/chunks/singletons.ab519196.js","_app/immutable/chunks/stores.ca0f4b31.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/time.81c93b6d.js"];
const stylesheets = ["_app/immutable/assets/4.0c413397.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-6af40bab.js.map
