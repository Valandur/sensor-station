import { r as redirect } from './index-C-arhqvZ.js';
import { C as Counter, a as CounterType } from './counter-BozXqImb.js';
import { g as getData } from './data7-BE-AQ3XR.js';
import 'node:fs/promises';
import 'superagent';
import './shared-server-BfUoNEXY.js';
import './BaseCache-BtPY9_DY.js';
import 'date-fns';
import './BaseLogger-B58-fQ4u.js';
import 'node:util';
import 'chalk';
import './data2-DTn0GzuV.js';
import 'geo-tz';
import 'serialport';

const counter = new Counter({
  type: CounterType.Wrap
});
const load = async ({ url, parent }) => {
  const data = await getData();
  counter.max = data.alerts.length;
  let page = Number(url.searchParams.get("page") || "---");
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const alert = data.alerts[page];
  const dataParent = await parent();
  if (!alert && dataParent.skipScreen) {
    throw redirect(302, dataParent.skipScreen);
  }
  return {
    alert,
    location: data.location,
    nextPage: `${dataParent.currScreen}&page=${counter.fit(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.fit(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 19;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BjMxvBpU.js')).default;
const server_id = "src/routes/screens/weather/alerts/+page.server.ts";
const imports = ["_app/immutable/nodes/19.CToP8lee.js","_app/immutable/chunks/4.DHRwv-0e.js","_app/immutable/chunks/index.B2WFuJON.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/entry.Bhxnc1fF.js","_app/immutable/chunks/index.Cg5-QVD7.js","_app/immutable/chunks/swipe.CFeUBoSp.js","_app/immutable/chunks/EmptyCard.Dl6qkHxx.js","_app/immutable/chunks/format.CJrgGK3Q.js","_app/immutable/chunks/de.oFxG6rdj.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=19-iVu_K5d1.js.map
