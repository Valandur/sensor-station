import { isAfter } from 'date-fns';
import { C as Counter } from './counter-Dt35QKyi.js';
import { g as getData } from './data7-QcdpkVEL.js';
import './index-H42hWO6o.js';
import 'node:fs/promises';
import 'superagent';
import './shared-server-49TKSBDM.js';
import './BaseCache-CtKtXkXQ.js';
import './BaseLogger-SyOYFtXW.js';
import 'node:util';
import 'chalk';
import './data2-yXfXElah.js';
import 'geo-tz';
import 'serialport';

const counter = new Counter({
  maxSliceSize: 7
});
const load = async () => {
  const data = await getData();
  const now = /* @__PURE__ */ new Date();
  const hourly = data.hourly.filter((f) => isAfter(f.ts, now)).filter((_, i) => i % 2 === 0);
  counter.max = hourly.length;
  return {
    location: data.location,
    hourly: counter.slice(hourly)
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 20;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-onM_PRKC.js')).default;
const server_id = "src/routes/screens/weather/hourly/+page.server.ts";
const imports = ["_app/immutable/nodes/20.83phFez-.js","_app/immutable/chunks/4.3xRaw29T.js","_app/immutable/chunks/index.wgffNSnY.js","_app/immutable/chunks/each.6w4Ej4nR.js","_app/immutable/chunks/format.-3CDNjnq.js","_app/immutable/chunks/de.5ejuWyRG.js","_app/immutable/chunks/constructFrom.5xxej_j7.js"];
const stylesheets = ["_app/immutable/assets/19.KbghzZvw.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=20-TB6Xj7SD.js.map
