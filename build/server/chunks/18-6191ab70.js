import { r as redirect, e as error } from './index-39e97e00.js';
import { C as Counter } from './counter-b37d52dc.js';
import { E as ENABLED, g as getUploads } from './uploads-2dd5eb7c.js';
import 'crypto';
import './shared-server-b7e48788.js';
import 'date-fns';
import 'fs/promises';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';

const counter = new Counter();
const load = async ({ url, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  let page = Number(url.searchParams.get("page") || "-");
  const uploads = await getUploads().catch((err) => error(500, err.message));
  if (!("length" in uploads)) {
    console.error(uploads);
    throw uploads;
  }
  counter.max = uploads.length;
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

const index = 18;
const component = async () => (await import('./_page.svelte-535cfbc8.js')).default;
const server_id = "src/routes/(main)/screens/uploads/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-uploads-page.svelte.06b79fa2.js","_app/immutable/chunks/index.376c5e2b.js","_app/immutable/chunks/navigation.69fce941.js","_app/immutable/chunks/singletons.03948dab.js","_app/immutable/chunks/index.5120e63e.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/_page.1f1929c7.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-6191ab70.js.map
