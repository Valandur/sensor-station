import { r as redirect } from './index-39e97e00.js';
import { E as ENABLED, a as getArticle, S as SIMPLE_DETAILS } from './news-95ed7b26.js';
import 'node:path';
import 'node:crypto';
import 'node:fs';
import 'date-fns';
import 'node:fs/promises';
import 'node-html-parser';
import 'rss-parser';
import 'superagent';
import './shared-server-b7e48788.js';
import './counter-b37d52dc.js';
import './logger-515117da.js';
import 'node:util';
import 'chalk';

const load = async ({ params }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
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

const index = 14;
const component = async () => (await import('./_page@.svelte-f9b5f592.js')).default;
const server_id = "src/routes/screens/news/[feed]/[article]/+page.server.ts";
const imports = ["_app/immutable/chunks/14.5b0faaad.js","_app/immutable/chunks/index.b6851cfd.js"];
const stylesheets = ["_app/immutable/assets/14.8ea0aa0d.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-2303932d.js.map
