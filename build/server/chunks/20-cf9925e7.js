import { r as redirect } from './index-39e97e00.js';
import { isAfter } from 'date-fns';
import { E as ENABLED, b as getHourly } from './weather-6b70ee12.js';
import './environment-19782cc3.js';
import './prod-ssr-17392843.js';
import 'node:fs/promises';
import 'superagent';
import './shared-server-b7e48788.js';
import './logger-515117da.js';
import 'node:util';
import 'chalk';
import './modem-0f6b874f.js';
import 'geo-tz';
import '@serialport/parser-inter-byte-timeout';
import 'serialport';

const NUM_FORECASTS = 7;
const load = async () => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  const [location, forecasts] = await getHourly();
  const now = /* @__PURE__ */ new Date();
  return {
    location,
    hourly: forecasts.filter((f) => isAfter(f.ts, now)).filter((_, i) => i % 2 === 0).slice(0, NUM_FORECASTS)
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 20;
const component = async () => (await import('./_page.svelte-19e603ab.js')).default;
const server_id = "src/routes/screens/weather/hourly/+page.server.ts";
const imports = ["_app/immutable/chunks/20.8cf8deac.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/19.ee6fada1.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=20-cf9925e7.js.map
