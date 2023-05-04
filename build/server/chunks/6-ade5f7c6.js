import { r as redirect } from './index-39e97e00.js';
import { E as ENABLED, g as getStatus } from './battery-6ce93987.js';
import 'node:fs/promises';
import 'date-fns';
import './environment-19782cc3.js';
import './prod-ssr-17392843.js';
import './shared-server-b7e48788.js';
import './logger-515117da.js';
import 'node:util';
import 'chalk';

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

const index = 6;
const component = async () => (await import('./_page.svelte-5250fbcb.js')).default;
const server_id = "src/routes/battery/+page.server.ts";
const imports = ["_app/immutable/entry/battery-page.svelte.025e818e.js","_app/immutable/chunks/index.913f2073.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/time.96d4543b.js","_app/immutable/chunks/index.44ab608c.js","_app/immutable/chunks/index.046a6bec.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-ade5f7c6.js.map
