import { r as redirect } from './index-39e97e00.js';
import { E as ENABLED, g as getStatus } from './modem-fd397486.js';
import 'date-fns';
import 'geo-tz';
import '@serialport/parser-inter-byte-timeout';
import 'serialport';
import 'node:fs/promises';
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

const index = 5;
const component = async () => (await import('./_page.svelte-c29f235e.js')).default;
const server_id = "src/routes/modem/+page.server.ts";
const imports = ["_app/immutable/chunks/5.301be67e.js","_app/immutable/chunks/index.dd49bebd.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/time.b3d278bc.js","_app/immutable/chunks/index.ad955a6c.js","_app/immutable/chunks/index.046a6bec.js","_app/immutable/chunks/index.14f81d0e.js","_app/immutable/chunks/index.4a6b61a9.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-2c134b09.js.map
