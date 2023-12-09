import { r as redirect } from './index-0087e825.js';
import { C as Counter } from './counter-b37d52dc.js';
import { g as getData } from './data5-723c23c6.js';
import 'date-fns';
import 'xml2js';
import 'superagent';
import './shared-server-b7e48788.js';
import './BaseCache-36285add.js';
import './BaseLogger-c8654638.js';
import 'node:util';
import 'chalk';

const MAX_ITEMS = 6;
const counter = new Counter();
const load = async ({ url, parent }) => {
  const data = await getData();
  counter.max = data.departures.length;
  let page = Number(url.searchParams.get("page") || "-");
  if (!isFinite(page)) {
    page = 0;
  }
  const departures = data.departures.slice(page, page + MAX_ITEMS);
  const dataParent = await parent();
  if (!departures && dataParent.skipScreen) {
    throw redirect(302, dataParent.skipScreen);
  }
  return {
    departures,
    nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${page > 0 ? page - 1 : 0}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 15;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-333c9c8f.js')).default;
const server_id = "src/routes/screens/sbb/departures/+page.server.ts";
const imports = ["_app/immutable/nodes/15.7fd6270d.js","_app/immutable/chunks/scheduler.f29c4489.js","_app/immutable/chunks/index.590f5f34.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/navigation.11c74d8f.js","_app/immutable/chunks/singletons.0f6a3a41.js","_app/immutable/chunks/index.7b21c3ea.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/EmptyCard.addfc298.js","_app/immutable/chunks/index.3b95dd12.js","_app/immutable/chunks/index.abc68696.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-74d00870.js.map
