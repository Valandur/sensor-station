import { C as Counter } from './counter-b37d52dc.js';
import { r as redirect } from './index-39e97e00.js';

const counter = new Counter();
const load = async ({ url, parent }) => {
  let page = Number(url.searchParams.get("page") || "-");
  const dataParent = await parent();
  counter.max = dataParent.alerts.length;
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const alert = dataParent.alerts[page];
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

const index = 17;
const component = async () => (await import('./_page.svelte-982e14b9.js')).default;
const server_id = "src/routes/(main)/screens/weather/alerts/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-weather-alerts-page.svelte.477eee1b.js","_app/immutable/chunks/index.fe1ee059.js","_app/immutable/chunks/navigation.07cc5ac6.js","_app/immutable/chunks/singletons.25daf7a4.js","_app/immutable/chunks/index.117728db.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-3ede3ecc.js.map
