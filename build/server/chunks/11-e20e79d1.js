import { C as Counter } from './counter-b37d52dc.js';
import { g as getData } from './data4-40675c58.js';
import 'node:path';
import 'node:crypto';
import 'node:fs';
import './index-39e97e00.js';
import 'node:fs/promises';
import 'date-fns';
import 'node-html-parser';
import 'rss-parser';
import 'superagent';
import './shared-server-b7e48788.js';
import './BaseCache-8b1d2e36.js';
import './BaseLogger-a6925041.js';
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
const component = async () => (await import('./_page.svelte-532afb68.js')).default;
const server_id = "src/routes/screens/news/[feed]/+page.server.ts";
const imports = ["_app/immutable/chunks/11.4aa8dd3b.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.856bf999.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/navigation.674b908a.js","_app/immutable/chunks/singletons.3eef5faa.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/screen.05a4b398.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.046a6bec.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/11.fdaf2531.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-e20e79d1.js.map
