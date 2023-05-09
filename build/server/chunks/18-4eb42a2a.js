import { isAfter } from 'date-fns';
import { g as getData } from './data4-4170eb53.js';
import './index-39e97e00.js';
import 'node:fs/promises';
import 'superagent';
import './shared-server-b7e48788.js';
import './BaseCache-8b1d2e36.js';
import './BaseLogger-d23f9d0c.js';
import 'node:util';
import 'chalk';
import './data2-0f7fac83.js';
import 'geo-tz';
import 'serialport';

const NUM_FORECASTS = 7;
const load = async () => {
  const data = await getData();
  const now = /* @__PURE__ */ new Date();
  return {
    location: data.location,
    hourly: data.hourly.filter((f) => isAfter(f.ts, now)).filter((_, i) => i % 2 === 0).slice(0, NUM_FORECASTS)
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 18;
const component = async () => (await import('./_page.svelte-47d08b74.js')).default;
const server_id = "src/routes/screens/weather/hourly/+page.server.ts";
const imports = ["_app/immutable/chunks/18.11daebca.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/17.ee6fada1.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-4eb42a2a.js.map
