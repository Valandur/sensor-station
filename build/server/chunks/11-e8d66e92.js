import { C as Counter, a as CounterType } from './counter-2325cf35.js';
import { g as getData } from './data4-07465b32.js';
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

const MAX_SLICE_SIZE = 3;
const counters = /* @__PURE__ */ new Map();
const load = async ({ url, params, parent }) => {
  const feedId = params.feed;
  let counter = counters.get(feedId);
  if (!counter) {
    counter = new Counter({
      type: CounterType.Wrap,
      maxSliceSize: MAX_SLICE_SIZE
    });
    counters.set(feedId, counter);
  }
  const data = await getData(feedId);
  counter.max = data.items.length;
  let page = Number(url.searchParams.get("page") || "---");
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const items = counter.slice(data.items, page);
  const dataParent = await parent();
  return {
    feedId,
    items,
    nextPage: `${dataParent.currScreen}&page=${counter.fit(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.fit(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 11;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-fe98f7c3.js')).default;
const server_id = "src/routes/screens/news/[feed]/+page.server.ts";
const imports = ["_app/immutable/nodes/11.12ff3b4d.js","_app/immutable/chunks/scheduler.4295992e.js","_app/immutable/chunks/index.48621620.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.56b08a40.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/navigation.3349dfc3.js","_app/immutable/chunks/singletons.e964b54d.js","_app/immutable/chunks/index.c59decee.js","_app/immutable/chunks/screen.69f6b3b9.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/EmptyCard.ba84940f.js","_app/immutable/chunks/index.c36e9de8.js","_app/immutable/chunks/index.abc68696.js"];
const stylesheets = ["_app/immutable/assets/11.fdaf2531.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-e8d66e92.js.map
