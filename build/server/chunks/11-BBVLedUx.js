import { C as Counter, a as CounterType } from './counter-BozXqImb.js';
import { g as getData } from './data4-DpQ_bjdD.js';
import 'node:path';
import 'node:crypto';
import 'node:fs';
import './index-C-arhqvZ.js';
import 'node:fs/promises';
import 'date-fns';
import 'node-html-parser';
import 'rss-parser';
import 'superagent';
import './shared-server-BfUoNEXY.js';
import './BaseCache-BtPY9_DY.js';
import './BaseLogger-B58-fQ4u.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-1BWRs1Yg.js')).default;
const server_id = "src/routes/screens/news/[feed]/+page.server.ts";
const imports = ["_app/immutable/nodes/11.BDad3gPM.js","_app/immutable/chunks/4.DHRwv-0e.js","_app/immutable/chunks/index.B2WFuJON.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/index.CZJppBTx.js","_app/immutable/chunks/entry.Bhxnc1fF.js","_app/immutable/chunks/index.Cg5-QVD7.js","_app/immutable/chunks/screen.IqONdavX.js","_app/immutable/chunks/swipe.CFeUBoSp.js","_app/immutable/chunks/EmptyCard.Dl6qkHxx.js","_app/immutable/chunks/formatDistanceToNow.CVSQz8Ye.js","_app/immutable/chunks/de.oFxG6rdj.js"];
const stylesheets = ["_app/immutable/assets/11.DXRWMhf2.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-BBVLedUx.js.map
