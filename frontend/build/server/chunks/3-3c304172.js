import { r as redirect } from './index-39e97e00.js';
import { g as getScreens, a as getScreenUrl } from './screen-685638f9.js';
import { g as getStatus } from './modem-2f52cc65.js';
import { g as getStatus$1 } from './battery-fa5d34b5.js';
import 'fs/promises';
import './counter-b37d52dc.js';
import 'date-fns';
import './shared-server-b7e48788.js';
import 'geo-tz';
import 'console';

const load = async ({ url }) => {
  const index = Number(url.searchParams.get("screen") || "-");
  const dir = url.searchParams.get("dir") === "prev" ? "prev" : "next";
  const urlScreenName = url.pathname;
  const [screens, modem, battery] = await Promise.all([
    getScreens(),
    getStatus(),
    getStatus$1()
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
  return {
    dir,
    index,
    screens,
    currScreen,
    nextScreen,
    prevScreen,
    skipScreen,
    modem,
    battery
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 3;
const component = async () => (await import('./_layout.svelte-f7e5fd85.js')).default;
const server_id = "src/routes/(main)/screens/+layout.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-layout.svelte.6d4117f3.js","_app/immutable/chunks/index.71ce2ac2.js","_app/immutable/chunks/index.be75d781.js","_app/immutable/chunks/navigation.b97fb752.js","_app/immutable/chunks/singletons.fe85f31d.js","_app/immutable/chunks/index.b74bfe1d.js","_app/immutable/chunks/stores.d062e193.js","_app/immutable/chunks/index.482d1fdd.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/time.e30642e1.js"];
const stylesheets = ["_app/immutable/assets/_layout.369fb9ce.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-3c304172.js.map
