import superagent from 'superagent';

const load = async ({ params }) => {
  const link = Buffer.from(params.article, "base64url").toString("utf-8");
  const { text } = await superagent.get(link);
  const page = text;
  const headStart = page.indexOf("<head>") + 6;
  const headEnd = page.indexOf("</head>", headStart);
  const head = page.substring(headStart, headEnd);
  const mainStart = page.indexOf("<main");
  const mainEnd = page.indexOf("</main>", mainStart) + 7;
  const main = page.substring(mainStart, mainEnd);
  const scriptStart = page.lastIndexOf('<span id="config__js"');
  const scriptEnd = page.indexOf("</body>", scriptStart);
  const scripts = page.substring(scriptStart, scriptEnd);
  return {
    head,
    main,
    scripts
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 13;
const component = async () => (await import('./_page@.svelte-f0e8139a.js')).default;
const server_id = "src/routes/(main)/screens/news/[feed]/[article]/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-news-_feed_-_article_-page@.svelte.75526150.js","_app/immutable/chunks/index.71ce2ac2.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-8cf8e607.js.map
