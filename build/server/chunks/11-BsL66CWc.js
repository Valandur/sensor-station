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
const component = async () => component_cache ??= (await import('./_page.svelte-DuS0Bfg8.js')).default;
const server_id = "src/routes/screens/news/[feed]/+page.server.ts";
const imports = ["_app/immutable/nodes/11.DOlCiquI.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/index.BDhO882L.js","_app/immutable/chunks/entry.FcHBK0nv.js","_app/immutable/chunks/index.DknyqqiT.js","_app/immutable/chunks/screen.Ck7z3_AO.js","_app/immutable/chunks/swipe.CFeUBoSp.js","_app/immutable/chunks/EmptyCard.h6hF05-m.js","_app/immutable/chunks/formatDistanceToNow.Dgm1Haac.js","_app/immutable/chunks/de.DgNxBmDO.js"];
const stylesheets = ["_app/immutable/assets/11.DXRWMhf2.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-BsL66CWc.js.map
