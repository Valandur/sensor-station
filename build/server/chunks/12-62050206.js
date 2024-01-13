import { a as getArticle, S as SIMPLE_DETAILS } from './data4-07465b32.js';
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
let component_cache;
const component = async () => component_cache ??= (await import('./_page@.svelte-8d621a81.js')).default;
const server_id = "src/routes/screens/news/[feed]/[article]/+page.server.ts";
const imports = ["_app/immutable/nodes/12.51cbff9c.js","_app/immutable/chunks/scheduler.4295992e.js","_app/immutable/chunks/index.48621620.js"];
const stylesheets = ["_app/immutable/assets/12.8ea0aa0d.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-62050206.js.map
