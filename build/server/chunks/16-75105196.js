import { r as redirect, e as error } from './index-39e97e00.js';
import { E as ENABLED, g as getUploads, c as counter } from './uploads-2188d68d.js';
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
  try {
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
  } catch (err) {
    console.error(err);
    throw error(500, err.message);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 16;
const component = async () => (await import('./_page.svelte-36976b72.js')).default;
const server_id = "src/routes/(main)/screens/uploads/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-uploads-page.svelte.c210e164.js","_app/immutable/chunks/index.fe1ee059.js","_app/immutable/chunks/navigation.07cc5ac6.js","_app/immutable/chunks/singletons.25daf7a4.js","_app/immutable/chunks/index.117728db.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/_page.1f1929c7.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-75105196.js.map
