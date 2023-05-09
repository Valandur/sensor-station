import { g as getData } from './data4-4170eb53.js';
import './index-39e97e00.js';
import 'node:fs/promises';
import 'superagent';
import './shared-server-b7e48788.js';
import './BaseCache-8b1d2e36.js';
import 'date-fns';
import './BaseLogger-d23f9d0c.js';
import 'node:util';
import 'chalk';
import './data2-0f7fac83.js';
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
const component = async () => (await import('./_page.svelte-9744cea3.js')).default;
const server_id = "src/routes/screens/weather/daily/+page.server.ts";
const imports = ["_app/immutable/chunks/17.b4d6ac38.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/17.ee6fada1.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-ff5a7fbd.js.map
