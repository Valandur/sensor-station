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
const component = async () => (await import('./_page.svelte-85fe14b8.js')).default;
const server_id = "src/routes/(main)/modem/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-modem-page.svelte.fb5d8a4d.js","_app/immutable/chunks/index.71ce2ac2.js","_app/immutable/chunks/index.ec40a1b2.js","_app/immutable/chunks/time.0438a22a.js","_app/immutable/chunks/index.b74bfe1d.js","_app/immutable/chunks/index.e6d13c60.js","_app/immutable/chunks/index.5a0c5ef2.js","_app/immutable/chunks/index.0aed9ef9.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-200eaffe.js.map
