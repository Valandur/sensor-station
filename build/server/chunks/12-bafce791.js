import { differenceInSeconds, parse } from 'date-fns';
import { b as private_env } from './shared-server-b7e48788.js';
import Parser from 'rss-parser';
import { C as Counter } from './counter-b37d52dc.js';

const CACHE_TIME = Number(private_env.NEWS_CACHE_TIME);
const MAX_ITEMS = 3;
const MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;
const load = async ({ url, params, parent }) => {
  const feedId = params.feed;
  let page = Number(url.searchParams.get("page") || "-");
  const feed = await getFeed(feedId);
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
const feeds = /* @__PURE__ */ new Map();
async function getFeed(feedId) {
  let feed = feeds.get(feedId);
  if (feed && differenceInSeconds(/* @__PURE__ */ new Date(), feed.cachedAt) <= CACHE_TIME) {
    return feed;
  }
  const parser = new Parser({ customFields: { item: ["description"] } });
  const xmlFeed = await parser.parseURL(`https://www.srf.ch/news/bnf/rss/${feedId}`);
  const items = [];
  const rawItems = xmlFeed.items.filter((item) => !item.description.includes("Hier finden Sie")).slice(0, 10);
  for (const item of rawItems) {
    if (!item.guid || !item.title || !item.link) {
      continue;
    }
    const match = MATCHER.exec(item.description);
    if (!match) {
      continue;
    }
    const [, img, content] = match;
    const date = item.pubDate ? parse(item.pubDate.substring(5), "dd MMM yyyy HH:mm:ss x", /* @__PURE__ */ new Date()) : /* @__PURE__ */ new Date();
    items.push({
      ts: date,
      title: item.title,
      link: Buffer.from(item.link, "utf-8").toString("base64url"),
      content: content || "",
      img: `https://www.srf.ch/static/cms/images/${img}`
    });
  }
  feed = { cachedAt: /* @__PURE__ */ new Date(), items, counter: feed?.counter || new Counter() };
  feed.counter.max = items.length;
  feeds.set(feedId, feed);
  return feed;
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 12;
const component = async () => (await import('./_page.svelte-939e29f3.js')).default;
const server_id = "src/routes/(main)/screens/news/[feed]/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-news-_feed_-page.svelte.da0739bf.js","_app/immutable/chunks/index.71ce2ac2.js","_app/immutable/chunks/index.be75d781.js","_app/immutable/chunks/navigation.e02b6c7b.js","_app/immutable/chunks/singletons.1c983f3a.js","_app/immutable/chunks/index.b74bfe1d.js","_app/immutable/chunks/swipe.f8763146.js"];
const stylesheets = ["_app/immutable/assets/_page.67cb55f5.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-bafce791.js.map
