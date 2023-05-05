import { r as redirect } from './index-39e97e00.js';
import { C as Counter } from './counter-b37d52dc.js';
import { E as ENABLED, g as getUploads } from './uploads-72e86536.js';
import 'node:crypto';
import 'date-fns';
import 'node:fs/promises';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';
import './shared-server-b7e48788.js';
import './logger-515117da.js';
import 'node:util';
import 'chalk';

const counter = new Counter();
const load = async ({ url, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
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
const component = async () => (await import('./_page.svelte-62653182.js')).default;
const server_id = "src/routes/screens/uploads/+page.server.ts";
const imports = ["_app/immutable/chunks/15.0076c6be.js","_app/immutable/chunks/index.dd49bebd.js","_app/immutable/chunks/navigation.8ea9c79f.js","_app/immutable/chunks/singletons.ab519196.js","_app/immutable/chunks/index.ad955a6c.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/15.1f1929c7.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-acf1d181.js.map
