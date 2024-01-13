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
const component = async () => component_cache ??= (await import('./_page.svelte-bb7b0deb.js')).default;
const server_id = "src/routes/modem/+page.server.ts";
const imports = ["_app/immutable/nodes/6.2258d070.js","_app/immutable/chunks/scheduler.4295992e.js","_app/immutable/chunks/index.48621620.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/time.ec5210e0.js","_app/immutable/chunks/index.c59decee.js","_app/immutable/chunks/PageLayout.04501e93.js","_app/immutable/chunks/PageTitle.5fd81dac.js","_app/immutable/chunks/index.1d3dadfb.js","_app/immutable/chunks/index.c36e9de8.js","_app/immutable/chunks/index.abc68696.js","_app/immutable/chunks/index.bb59ecb5.js","_app/immutable/chunks/index.00c12b3f.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-d3cc14db.js.map
