import { r as redirect } from './index-39e97e00.js';
import { E as ENABLED, g as getStatus } from './battery-80bca20c.js';
import 'fs/promises';
import 'date-fns';
import './shared-server-b7e48788.js';
import 'console';

const load = async () => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  const status = await getStatus();
  return {
    status
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 7;
const component = async () => (await import('./_page.svelte-a221c1ae.js')).default;
const server_id = "src/routes/(main)/battery/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-battery-page.svelte.1a95d98f.js","_app/immutable/chunks/index.71ce2ac2.js","_app/immutable/chunks/index.9432a293.js","_app/immutable/chunks/time.a044c577.js","_app/immutable/chunks/index.b74bfe1d.js","_app/immutable/chunks/index.c72bae23.js","_app/immutable/chunks/index.5a0c5ef2.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-3009726d.js.map
