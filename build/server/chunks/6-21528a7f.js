import { g as getData } from './data2-94174801.js';
import './index-0087e825.js';
import 'geo-tz';
import './shared-server-b7e48788.js';
import './BaseCache-36285add.js';
import 'date-fns';
import './BaseLogger-c8654638.js';
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
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-a4b7b98e.js')).default;
const server_id = "src/routes/modem/+page.server.ts";
const imports = ["_app/immutable/nodes/6.a14b8aa0.js","_app/immutable/chunks/scheduler.f29c4489.js","_app/immutable/chunks/index.ae6ce75b.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/time.6a42a18b.js","_app/immutable/chunks/index.7b21c3ea.js","_app/immutable/chunks/PageLayout.bc9831bb.js","_app/immutable/chunks/PageTitle.cea19cb8.js","_app/immutable/chunks/index.c03c6d6b.js","_app/immutable/chunks/index.2e17e3e2.js","_app/immutable/chunks/index.3a430129.js","_app/immutable/chunks/index.14a131bc.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-21528a7f.js.map
