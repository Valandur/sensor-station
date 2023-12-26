import { C as Counter } from './counter-b37d52dc.js';
import { g as getUploads } from './data6-678fab74.js';
import 'node:crypto';
import './index-0087e825.js';
import 'date-fns';
import 'node:fs/promises';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';
import './shared-server-b7e48788.js';
import './BaseLogger-c8654638.js';
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

const index = 16;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-f91ddbe0.js')).default;
const server_id = "src/routes/screens/uploads/+page.server.ts";
const imports = ["_app/immutable/nodes/16.75a336f4.js","_app/immutable/chunks/scheduler.f29c4489.js","_app/immutable/chunks/index.ae6ce75b.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/navigation.e14dcbcb.js","_app/immutable/chunks/singletons.b5e688bb.js","_app/immutable/chunks/index.7b21c3ea.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/EmptyCard.b61a895e.js","_app/immutable/chunks/index.3b95dd12.js","_app/immutable/chunks/index.abc68696.js"];
const stylesheets = ["_app/immutable/assets/16.1f1929c7.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-65e65741.js.map
