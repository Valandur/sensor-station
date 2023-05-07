import { b as private_env } from './shared-server-b7e48788.js';
import { r as redirect } from './index-39e97e00.js';
import { g as getFeed } from './news-95ed7b26.js';
import 'node:path';
import 'node:crypto';
import 'node:fs';
import 'date-fns';
import 'node:fs/promises';
import 'node-html-parser';
import 'rss-parser';
import 'superagent';
import './counter-b37d52dc.js';
import './logger-515117da.js';
import 'node:util';
import 'chalk';

const ENABLED = private_env.NEWS_ENABLED === "1";
const MAX_ITEMS = 3;
const load = async ({ url, params, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  const feedId = params.feed;
  const feed = await getFeed(feedId);
  let page = Number(url.searchParams.get("page") || "-");
  if (!isFinite(page)) {
    page = feed.counter.increment();
  }
  const items = feed.counter.sliceAndWrap(feed.items, MAX_ITEMS, page);
  const dataParent = await parent();
  return {
    feedId,
    items,
    nextPage: `${dataParent.currScreen}&page=${feed.counter.wrap(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${feed.counter.wrap(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 13;
const component = async () => (await import('./_page.svelte-3783cb38.js')).default;
const server_id = "src/routes/screens/news/[feed]/+page.server.ts";
const imports = ["_app/immutable/chunks/13.8d73fed6.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.856bf999.js","_app/immutable/chunks/navigation.c61252b6.js","_app/immutable/chunks/singletons.fb112a87.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/screen.05a4b398.js","_app/immutable/chunks/swipe.f8763146.js"];
const stylesheets = ["_app/immutable/assets/13.fdaf2531.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-8f77156c.js.map
