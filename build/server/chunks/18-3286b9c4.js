import { r as redirect, e as error } from './index-39e97e00.js';
import { isAfter } from 'date-fns';
import { E as ENABLED, b as getHourly } from './weather-b9df9f23.js';
import './shared-server-b7e48788.js';
import 'superagent';

const NUM_FORECASTS = 7;
const load = async () => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  const forecasts = await getHourly().catch((err) => error(500, err.message));
  if (!("length" in forecasts)) {
    console.error(forecasts);
    throw forecasts;
  }
  const now = /* @__PURE__ */ new Date();
  return {
    hourly: forecasts.filter((f) => isAfter(f.ts, now)).filter((_, i) => i % 2 === 0).slice(0, NUM_FORECASTS)
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 18;
const component = async () => (await import('./_page.svelte-44104da3.js')).default;
const server_id = "src/routes/(main)/screens/weather/hourly/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-weather-hourly-page.svelte.6a7c6841.js","_app/immutable/chunks/index.376c5e2b.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/_page.75726be4.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-3286b9c4.js.map
