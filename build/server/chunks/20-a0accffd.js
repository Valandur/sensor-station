import { r as redirect } from './index-39e97e00.js';
import { isAfter } from 'date-fns';
import { E as ENABLED, b as getHourly } from './weather-fc660179.js';
import './environment-19782cc3.js';
import './prod-ssr-17392843.js';
import 'superagent';
import './shared-server-b7e48788.js';
import './logger-515117da.js';
import 'node:util';
import 'chalk';

const NUM_FORECASTS = 7;
const load = async () => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  const forecasts = await getHourly();
  const now = /* @__PURE__ */ new Date();
  return {
    hourly: forecasts.filter((f) => isAfter(f.ts, now)).filter((_, i) => i % 2 === 0).slice(0, NUM_FORECASTS)
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 20;
const component = async () => (await import('./_page.svelte-77799515.js')).default;
const server_id = "src/routes/screens/weather/hourly/+page.server.ts";
const imports = ["_app/immutable/chunks/20.2a510457.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/19.ee6fada1.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=20-a0accffd.js.map
