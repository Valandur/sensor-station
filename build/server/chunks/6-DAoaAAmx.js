import { g as getData } from './data2-B2YiQVQW.js';
import './index-C-arhqvZ.js';
import 'geo-tz/now';
import '@googlemaps/google-maps-services-js';
import './shared-server-BfUoNEXY.js';
import './BaseCache-BtPY9_DY.js';
import 'date-fns';
import './BaseLogger-B58-fQ4u.js';
import 'node:util';
import 'chalk';
import 'serialport';
import 'node:fs/promises';

const load = async () => {
  const data = await getData(true);
  return {
    ...data
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CMseBZZI.js')).default;
const server_id = "src/routes/modem/+page.server.ts";
const imports = ["_app/immutable/nodes/6.DrwkmTo_.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js","_app/immutable/chunks/time.DnlTQaVB.js","_app/immutable/chunks/index.DknyqqiT.js","_app/immutable/chunks/PageLayout.CoJAI8IG.js","_app/immutable/chunks/PageTitle.BPFk4NTW.js","_app/immutable/chunks/format.BMwO3m9q.js","_app/immutable/chunks/de.DgNxBmDO.js","_app/immutable/chunks/formatDistanceToNow.Dgm1Haac.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-DAoaAAmx.js.map
