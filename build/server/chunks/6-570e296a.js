import { r as redirect } from './index-39e97e00.js';
import { isSameDay } from 'date-fns';
import Holidays from 'date-holidays';
import { g as getScreens, a as getScreenUrl } from './screen2-685638f9.js';
import { g as getStatus$1 } from './battery-1fa5f31e.js';
import { g as getStatus } from './modem-d3f90a73.js';
import 'fs/promises';
import './counter-b37d52dc.js';
import './shared-server-b7e48788.js';
import 'geo-tz';
import '@serialport/parser-readline';
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
const load = async ({ url }) => {
  const index = Number(url.searchParams.get("screen") || "-");
  const dir = url.searchParams.get("dir") === "prev" ? "prev" : "next";
  const urlScreenName = url.pathname;
  const [screens, modem, battery] = await Promise.all([
    getScreens().catch(() => []),
    getStatus().catch(() => null),
    getStatus$1().catch(() => null)
  ]);
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

const index = 6;
const component = async () => (await import('./_layout.svelte-24edc79f.js')).default;
const server_id = "src/routes/(main)/screens/+layout.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-layout.svelte.41ad1f4f.js","_app/immutable/chunks/index.376c5e2b.js","_app/immutable/chunks/screen.4a9c502d.js","_app/immutable/chunks/index.5120e63e.js","_app/immutable/chunks/navigation.69fce941.js","_app/immutable/chunks/singletons.03948dab.js","_app/immutable/chunks/stores.9c9bbea6.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/time.e747679e.js"];
const stylesheets = ["_app/immutable/assets/_layout.369fb9ce.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-570e296a.js.map
