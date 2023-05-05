import { g as getStatus } from './battery-25318416.js';
import 'node:fs/promises';
import 'date-fns';
import './index-39e97e00.js';
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

const index = 7;
const component = async () => (await import('./_page.svelte-2e3020e2.js')).default;
const server_id = "src/routes/battery/+page.server.ts";
const imports = ["_app/immutable/chunks/7.49fa4526.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/time.c4f0045c.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/PageLayout.efe40619.js","_app/immutable/chunks/PageTitle.37274199.js","_app/immutable/chunks/index.046a6bec.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-f4d49c8c.js.map
