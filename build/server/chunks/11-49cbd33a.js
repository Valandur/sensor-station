import { C as Counter } from './counter-b37d52dc.js';
import { g as getData } from './data4-3a132aa4.js';
import 'node:path';
import 'node:crypto';
import 'node:fs';
import './index-0087e825.js';
import 'node:fs/promises';
import 'date-fns';
import 'node-html-parser';
import 'rss-parser';
import 'superagent';
import './shared-server-b7e48788.js';
import './BaseCache-36285add.js';
import './BaseLogger-c8654638.js';
import 'node:util';
import 'chalk';

const MAX_ITEMS = 3;
const counters = /* @__PURE__ */ new Map();
const load = async ({ url, params, parent }) => {
  const feedId = params.feed;
  let counter = counters.get(feedId);
  if (!counter) {
    counter = new Counter();
    counters.set(feedId, counter);
  }
  const data = await getData(feedId);
  counter.max = data.items.length;
  let page = Number(url.searchParams.get("page") || "-");
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const items = counter.sliceAndWrap(data.items, MAX_ITEMS, page);
  const dataParent = await parent();
  return {
    feedId,
    items,
    nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 11;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-aded8316.js')).default;
const server_id = "src/routes/screens/news/[feed]/+page.server.ts";
const imports = ["_app/immutable/nodes/11.594ebe26.js","_app/immutable/chunks/scheduler.f29c4489.js","_app/immutable/chunks/index.590f5f34.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.fb448fd8.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/navigation.ff1c13ff.js","_app/immutable/chunks/singletons.11b689f7.js","_app/immutable/chunks/index.7b21c3ea.js","_app/immutable/chunks/screen.e5d3e512.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.c36e9de8.js","_app/immutable/chunks/index.abc68696.js"];
const stylesheets = ["_app/immutable/assets/11.fdaf2531.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-49cbd33a.js.map
