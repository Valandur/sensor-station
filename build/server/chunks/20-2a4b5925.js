import { isAfter } from 'date-fns';
import { C as Counter } from './counter-2325cf35.js';
import { g as getData } from './data7-a85fb732.js';
import './index-0087e825.js';
import 'node:fs/promises';
import 'superagent';
import './shared-server-b7e48788.js';
import './BaseCache-36285add.js';
import './BaseLogger-c8654638.js';
import 'node:util';
import 'chalk';
import './data2-94174801.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-5b9ff391.js')).default;
const server_id = "src/routes/screens/weather/hourly/+page.server.ts";
const imports = ["_app/immutable/nodes/20.ce809a8b.js","_app/immutable/chunks/scheduler.4295992e.js","_app/immutable/chunks/index.48621620.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/index.bb59ecb5.js","_app/immutable/chunks/index.abc68696.js","_app/immutable/chunks/index.00c12b3f.js"];
const stylesheets = ["_app/immutable/assets/19.ee6fada1.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=20-2a4b5925.js.map
