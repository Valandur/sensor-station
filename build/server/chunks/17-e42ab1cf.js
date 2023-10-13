import { g as getData } from './data6-a85fb732.js';
import './index-0087e825.js';
import 'node:fs/promises';
import 'superagent';
import './shared-server-b7e48788.js';
import './BaseCache-36285add.js';
import 'date-fns';
import './BaseLogger-c8654638.js';
import 'node:util';
import 'chalk';
import './data2-94174801.js';
import 'geo-tz';
import 'serialport';

const NUM_FORECASTS = 7;
const load = async () => {
  const data = await getData();
  return {
    location: data.location,
    daily: data.daily.slice(0, NUM_FORECASTS)
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 17;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-13f6079d.js')).default;
const server_id = "src/routes/screens/weather/daily/+page.server.ts";
const imports = ["_app/immutable/nodes/17.c6a86e95.js","_app/immutable/chunks/scheduler.f29c4489.js","_app/immutable/chunks/index.ae6ce75b.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/index.14a131bc.js","_app/immutable/chunks/index.3a430129.js"];
const stylesheets = ["_app/immutable/assets/17.ee6fada1.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-e42ab1cf.js.map
