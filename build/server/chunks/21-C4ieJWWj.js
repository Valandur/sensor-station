import { isAfter } from 'date-fns';
import { C as Counter } from './counter-BozXqImb.js';
import { g as getData } from './data7-pNzr0dMb.js';
import './index-C-arhqvZ.js';
import 'node:fs/promises';
import 'superagent';
import './shared-server-BfUoNEXY.js';
import './BaseCache-BtPY9_DY.js';
import './BaseLogger-B58-fQ4u.js';
import 'node:util';
import 'chalk';
import './data2-DrdzXFp2.js';
import 'geo-tz/now';
import '@googlemaps/google-maps-services-js';
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

const index = 21;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BIC1N76n.js')).default;
const server_id = "src/routes/screens/weather/hourly/+page.server.ts";
const imports = ["_app/immutable/nodes/21.DjXC3BbK.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/index.Bwn2MeFA.js","_app/immutable/chunks/format.BMwO3m9q.js","_app/immutable/chunks/de.DgNxBmDO.js"];
const stylesheets = ["_app/immutable/assets/20.puCHNm_A.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=21-C4ieJWWj.js.map
