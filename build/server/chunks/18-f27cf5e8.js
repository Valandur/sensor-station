import { C as Counter } from './counter-b37d52dc.js';
import { r as redirect } from './index-0087e825.js';
import { g as getData } from './data7-a85fb732.js';
import 'node:fs/promises';
import 'superagent';
import './shared-server-b7e48788.js';
import './BaseCache-36285add.js';
import 'date-fns';
import './BaseLogger-c8654638.js';
import 'node:util';
import 'chalk';
import './data2-94174801.js';
import 'geo-tz';
import 'serialport';

const counter = new Counter();
const load = async ({ url, parent }) => {
  const data = await getData();
  counter.max = data.alerts.length;
  let page = Number(url.searchParams.get("page") || "-");
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
    nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 18;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-fd8fb836.js')).default;
const server_id = "src/routes/screens/weather/alerts/+page.server.ts";
const imports = ["_app/immutable/nodes/18.b84f91dc.js","_app/immutable/chunks/scheduler.4295992e.js","_app/immutable/chunks/index.48621620.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/navigation.da8f1704.js","_app/immutable/chunks/singletons.01549e5e.js","_app/immutable/chunks/index.c59decee.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/EmptyCard.ba84940f.js","_app/immutable/chunks/index.bb59ecb5.js","_app/immutable/chunks/index.abc68696.js","_app/immutable/chunks/index.00c12b3f.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-f27cf5e8.js.map
