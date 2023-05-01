import { b as private_env } from './shared-server-b7e48788.js';
import { r as redirect, e as error } from './index-39e97e00.js';
import { g as getFeed } from './news-20460b61.js';
import 'date-fns';
import 'rss-parser';
import 'superagent';
import './counter-b37d52dc.js';

const ENABLED = private_env.NEWS_ENABLED === "1";
const MAX_ITEMS = 3;
const load = async ({ url, params, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  const feedId = params.feed;
  let page = Number(url.searchParams.get("page") || "-");
  const feed = await getFeed(feedId).catch((err) => error(500, err.message));
  if (!("items" in feed)) {
    console.error(feed);
    throw feed;
  }
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

const index = 11;
const component = async () => (await import('./_page.svelte-e295e1a7.js')).default;
const server_id = "src/routes/(main)/screens/news/[feed]/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-news-_feed_-page.svelte.f63e5a07.js","_app/immutable/chunks/index.376c5e2b.js","_app/immutable/chunks/screen.4a9c502d.js","_app/immutable/chunks/index.5120e63e.js","_app/immutable/chunks/navigation.3c34bd9b.js","_app/immutable/chunks/singletons.b34e927f.js","_app/immutable/chunks/swipe.f8763146.js"];
const stylesheets = ["_app/immutable/assets/_page.67cb55f5.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-e0455a07.js.map
