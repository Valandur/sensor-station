import { r as redirect } from './index-39e97e00.js';
import { E as ENABLED, a as getArticle, S as SIMPLE_DETAILS } from './news-20460b61.js';
import 'date-fns';
import './shared-server-b7e48788.js';
import 'rss-parser';
import 'superagent';
import './counter-b37d52dc.js';

const load = async ({ params }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  const { head, main, scripts } = await getArticle(params.article);
  return {
    simple: SIMPLE_DETAILS,
    head,
    main,
    scripts
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 15;
const component = async () => (await import('./_page@.svelte-81f4b0b6.js')).default;
const server_id = "src/routes/(main)/screens/news/[feed]/[article]/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-news-_feed_-_article_-page@.svelte.fa9caedd.js","_app/immutable/chunks/index.376c5e2b.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-f2367194.js.map
