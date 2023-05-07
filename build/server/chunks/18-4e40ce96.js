import { C as Counter } from './counter-b37d52dc.js';
import { r as redirect } from './index-39e97e00.js';
import { E as ENABLED, g as getAlerts } from './weather-fad369e8.js';
import './environment-19782cc3.js';
import './prod-ssr-17392843.js';
import 'date-fns';
import 'node:fs/promises';
import 'superagent';
import './shared-server-b7e48788.js';
import './logger-515117da.js';
import 'node:util';
import 'chalk';
import './modem-574a12e0.js';
import 'geo-tz';
import '@serialport/parser-inter-byte-timeout';
import 'serialport';

const counter = new Counter();
const load = async ({ url, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  const [location, alerts] = await getAlerts();
  counter.max = alerts.length;
  let page = Number(url.searchParams.get("page") || "-");
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const alert = alerts[page];
  const dataParent = await parent();
  if (!alert && dataParent.skipScreen) {
    throw redirect(302, dataParent.skipScreen);
  }
  return {
    location,
    alert,
    nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 18;
const component = async () => (await import('./_page.svelte-87c81b81.js')).default;
const server_id = "src/routes/screens/weather/alerts/+page.server.ts";
const imports = ["_app/immutable/chunks/18.3bc0012b.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/navigation.9f3e540c.js","_app/immutable/chunks/singletons.53415182.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/EmptyCard.46c04464.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-4e40ce96.js.map
