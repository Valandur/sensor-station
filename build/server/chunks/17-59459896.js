import { r as redirect } from './index-39e97e00.js';
import { E as ENABLED, a as getDaily } from './weather-475107fc.js';
import 'date-fns';
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
  const forecasts = await getDaily();
  return {
    daily: forecasts.slice(0, NUM_FORECASTS)
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 17;
const component = async () => (await import('./_page.svelte-e57ddb8b.js')).default;
const server_id = "src/routes/screens/weather/daily/+page.server.ts";
const imports = ["_app/immutable/chunks/17.d1984974.js","_app/immutable/chunks/index.dd49bebd.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/17.75726be4.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-59459896.js.map
