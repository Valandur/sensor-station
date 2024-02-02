import { C as Counter, a as CounterType } from './counter-Dt35QKyi.js';
import { g as getData } from './data4-Sb7ZPKpA.js';
import 'node:path';
import 'node:crypto';
import 'node:fs';
import './index-H42hWO6o.js';
import 'node:fs/promises';
import 'date-fns';
import 'node-html-parser';
import 'rss-parser';
import 'superagent';
import './shared-server-49TKSBDM.js';
import './BaseCache-CtKtXkXQ.js';
import './BaseLogger-SyOYFtXW.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-fECsM-37.js')).default;
const server_id = "src/routes/screens/news/[feed]/+page.server.ts";
const imports = ["_app/immutable/nodes/11.WPttjZoC.js","_app/immutable/chunks/4.3xRaw29T.js","_app/immutable/chunks/index.wgffNSnY.js","_app/immutable/chunks/each.6w4Ej4nR.js","_app/immutable/chunks/index.hqnGnc7n.js","_app/immutable/chunks/entry.wt3AcDH9.js","_app/immutable/chunks/index.-WvGjXqt.js","_app/immutable/chunks/screen.f0YZ8vtt.js","_app/immutable/chunks/swipe.ysJLwxnX.js","_app/immutable/chunks/EmptyCard.i7c96Gnh.js","_app/immutable/chunks/formatDistanceToNow.9hzICZZP.js","_app/immutable/chunks/de.5ejuWyRG.js"];
const stylesheets = ["_app/immutable/assets/11.Eq44s6iJ.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-9OPcvWkZ.js.map
