import { a as getArticle, S as SIMPLE_DETAILS } from './data4-40675c58.js';
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

const load = async ({ params }) => {
  const feedId = params.feed;
  const articleId = params.article;
  const article = await getArticle(feedId, articleId);
  return {
    simple: SIMPLE_DETAILS,
    article
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 12;
const component = async () => (await import('./_page@.svelte-3ce740b4.js')).default;
const server_id = "src/routes/screens/news/[feed]/[article]/+page.server.ts";
const imports = ["_app/immutable/chunks/12.5fdc746f.js","_app/immutable/chunks/index.b6851cfd.js"];
const stylesheets = ["_app/immutable/assets/12.8ea0aa0d.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-b006af6b.js.map
