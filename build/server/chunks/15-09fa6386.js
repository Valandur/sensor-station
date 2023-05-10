import { C as Counter } from './counter-b37d52dc.js';
import { g as getUploads } from './uploads-b4248a6f.js';
import 'node:crypto';
import './index-39e97e00.js';
import 'date-fns';
import 'node:fs/promises';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';
import './shared-server-b7e48788.js';
import './BaseLogger-a6925041.js';
import 'node:util';
import 'chalk';

const counter = new Counter();
const load = async ({ url, parent }) => {
  const uploads = await getUploads();
  counter.max = uploads.length;
  let page = Number(url.searchParams.get("page") || "-");
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const upload = uploads[page];
  const dataParent = await parent();
  return {
    upload,
    nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 15;
const component = async () => (await import('./_page.svelte-75c1eb74.js')).default;
const server_id = "src/routes/screens/uploads/+page.server.ts";
const imports = ["_app/immutable/chunks/15.735fa1e1.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/navigation.674b908a.js","_app/immutable/chunks/singletons.3eef5faa.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/EmptyCard.46c04464.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/15.1f1929c7.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-09fa6386.js.map
