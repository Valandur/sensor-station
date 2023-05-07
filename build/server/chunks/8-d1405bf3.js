import { g as getStatus } from './modem-574a12e0.js';
import 'date-fns';
import './index-39e97e00.js';
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
const component = async () => (await import('./_page.svelte-99f90ef5.js')).default;
const server_id = "src/routes/modem/+page.server.ts";
const imports = ["_app/immutable/chunks/8.4b3ed401.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/time.c4f0045c.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/PageLayout.efe40619.js","_app/immutable/chunks/PageTitle.37274199.js","_app/immutable/chunks/index.046a6bec.js","_app/immutable/chunks/index.14f81d0e.js","_app/immutable/chunks/index.4a6b61a9.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-d1405bf3.js.map
