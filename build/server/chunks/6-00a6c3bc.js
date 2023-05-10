import { g as getData } from './data2-be838c90.js';
import './index-39e97e00.js';
import 'geo-tz';
import './shared-server-b7e48788.js';
import './BaseCache-8b1d2e36.js';
import 'date-fns';
import './BaseLogger-a6925041.js';
import 'node:util';
import 'chalk';
import 'serialport';
import 'node:fs/promises';

const load = async () => {
  const data = await getData(true);
  return {
    ...data
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 6;
const component = async () => (await import('./_page.svelte-668d2b16.js')).default;
const server_id = "src/routes/modem/+page.server.ts";
const imports = ["_app/immutable/nodes/6.02cfc523.js","_app/immutable/chunks/index.7ca231fc.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/time.a9173a56.js","_app/immutable/chunks/index.d3159694.js","_app/immutable/chunks/PageLayout.217a892c.js","_app/immutable/chunks/PageTitle.0866f869.js","_app/immutable/chunks/index.f6d0c5d4.js","_app/immutable/chunks/index.046a6bec.js","_app/immutable/chunks/index.14f81d0e.js","_app/immutable/chunks/index.4a6b61a9.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-00a6c3bc.js.map
