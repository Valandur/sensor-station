import { r as redirect } from './index-39e97e00.js';
import { E as ENABLED, g as getStatus } from './modem-d001630c.js';
import 'date-fns';
import './shared-server-b7e48788.js';
import 'geo-tz';
import 'fs/promises';

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

const index = 8;
const component = async () => (await import('./_page.svelte-b708491d.js')).default;
const server_id = "src/routes/(main)/modem/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-modem-page.svelte.5e57fe0c.js","_app/immutable/chunks/index.fe1ee059.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/time.c518b45a.js","_app/immutable/chunks/index.117728db.js","_app/immutable/chunks/index.046a6bec.js","_app/immutable/chunks/index.14f81d0e.js","_app/immutable/chunks/index.4a6b61a9.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-bdbab1ba.js.map
