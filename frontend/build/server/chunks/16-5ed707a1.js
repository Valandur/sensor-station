import { r as redirect } from './index-39e97e00.js';
import { E as ENABLED, g as getUploads, c as counter } from './uploads-75b1efd9.js';
import 'crypto';
import './shared-server-b7e48788.js';
import 'date-fns';
import 'fs/promises';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';
import './counter-b37d52dc.js';

const load = async ({ url, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  let page = Number(url.searchParams.get("page") || "-");
  const uploads = await getUploads();
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
const component = async () => (await import('./_page.svelte-f1337056.js')).default;
const server_id = "src/routes/(main)/screens/uploads/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-uploads-page.svelte.1bb5cc66.js","_app/immutable/chunks/index.71ce2ac2.js","_app/immutable/chunks/navigation.5d490cbc.js","_app/immutable/chunks/singletons.93c38f67.js","_app/immutable/chunks/index.b74bfe1d.js","_app/immutable/chunks/index.482d1fdd.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.4bc12a4a.js","_app/immutable/chunks/index.5a0c5ef2.js"];
const stylesheets = ["_app/immutable/assets/_page.1f1929c7.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-5ed707a1.js.map
