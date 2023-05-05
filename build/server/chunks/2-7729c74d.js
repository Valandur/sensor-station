import { r as redirect } from './index-39e97e00.js';
import { isSameDay } from 'date-fns';
import Holidays from 'date-holidays';
import { g as getScreens, a as getScreenUrl } from './screen2-533d4d19.js';
import { g as getStatus$1 } from './battery-6ce93987.js';
import { g as getStatus } from './modem-1d00d6a7.js';
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

const index = 2;
const component = async () => (await import('./_layout.svelte-d3e13992.js')).default;
const server_id = "src/routes/screens/+layout.server.ts";
const imports = ["_app/immutable/chunks/2.57a230c3.js","_app/immutable/chunks/index.dd49bebd.js","_app/immutable/chunks/screen.754bb683.js","_app/immutable/chunks/index.ad955a6c.js","_app/immutable/chunks/navigation.a4ce00a0.js","_app/immutable/chunks/singletons.5c116cf7.js","_app/immutable/chunks/stores.ae7ce83a.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/time.81c93b6d.js"];
const stylesheets = ["_app/immutable/assets/2.0c413397.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-7729c74d.js.map
