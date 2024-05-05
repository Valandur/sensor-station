import { a as getArticle, S as SIMPLE_DETAILS } from './data4-DpQ_bjdD.js';
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
const component = async () => component_cache ??= (await import('./_page@.svelte-C_RjHugc.js')).default;
const server_id = "src/routes/screens/news/[feed]/[article]/+page.server.ts";
const imports = ["_app/immutable/nodes/12.BYQ3uIJe.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js"];
const stylesheets = ["_app/immutable/assets/12.Bia_RGnN.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-I1KcchSS.js.map
