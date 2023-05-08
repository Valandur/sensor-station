import { r as redirect } from './index-39e97e00.js';
import { E as ENABLED, a as getDaily } from './weather-6b70ee12.js';
import './environment-19782cc3.js';
import './prod-ssr-17392843.js';
import 'date-fns';
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
  const [location, forecasts] = await getDaily();
  return {
    location,
    daily: forecasts.slice(0, NUM_FORECASTS)
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 19;
const component = async () => (await import('./_page.svelte-3668b5eb.js')).default;
const server_id = "src/routes/screens/weather/daily/+page.server.ts";
const imports = ["_app/immutable/chunks/19.5adc0ee6.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/19.ee6fada1.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=19-1a2e7bbf.js.map
