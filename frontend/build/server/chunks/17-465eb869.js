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
const component = async () => (await import('./_page.svelte-2c6144dc.js')).default;
const server_id = "src/routes/(main)/screens/weather/alerts/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-weather-alerts-page.svelte.2ccdf3d7.js","_app/immutable/chunks/index.71ce2ac2.js","_app/immutable/chunks/navigation.148d7d06.js","_app/immutable/chunks/singletons.b172fff3.js","_app/immutable/chunks/index.b74bfe1d.js","_app/immutable/chunks/index.482d1fdd.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.4bc12a4a.js","_app/immutable/chunks/index.5a0c5ef2.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-465eb869.js.map
