import { C as Counter } from './counter-b37d52dc.js';
import { r as redirect, e as error } from './index-39e97e00.js';
import { E as ENABLED, g as getAlerts } from './weather-b9df9f23.js';
import 'date-fns';
import './shared-server-b7e48788.js';
import 'superagent';

const counter = new Counter();
const load = async ({ url, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  let page = Number(url.searchParams.get("page") || "-");
  const alerts = await getAlerts().catch((err) => error(500, err.message));
  if (!("length" in alerts)) {
    console.error(alerts);
    throw alerts;
  }
  counter.max = alerts.length;
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const alert = alerts[page];
  const dataParent = await parent();
  if (!alert && dataParent.skipScreen) {
    throw redirect(302, dataParent.skipScreen);
  }
  return {
    alert,
    nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 19;
const component = async () => (await import('./_page.svelte-a13f7f65.js')).default;
const server_id = "src/routes/(main)/screens/weather/alerts/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-weather-alerts-page.svelte.d3c01bdb.js","_app/immutable/chunks/index.376c5e2b.js","_app/immutable/chunks/navigation.d3227e90.js","_app/immutable/chunks/singletons.5d84b819.js","_app/immutable/chunks/index.5120e63e.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=19-2cfc342d.js.map
