import { g as getData } from './data2-j1H-xDgc.js';
import './index-H42hWO6o.js';
import 'geo-tz';
import './shared-server-49TKSBDM.js';
import './BaseCache-CtKtXkXQ.js';
import 'date-fns';
import './BaseLogger-SyOYFtXW.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-9CGuGchQ.js')).default;
const server_id = "src/routes/modem/+page.server.ts";
const imports = ["_app/immutable/nodes/6.-TZWYeZA.js","_app/immutable/chunks/4.3xRaw29T.js","_app/immutable/chunks/index.wgffNSnY.js","_app/immutable/chunks/time.nhAbNM2u.js","_app/immutable/chunks/index.-WvGjXqt.js","_app/immutable/chunks/PageLayout.T1G9AIqX.js","_app/immutable/chunks/PageTitle.hKPV8Aix.js","_app/immutable/chunks/format.-3CDNjnq.js","_app/immutable/chunks/de.5ejuWyRG.js","_app/immutable/chunks/constructFrom.5xxej_j7.js","_app/immutable/chunks/formatDistanceToNow.9hzICZZP.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-p91gsVrr.js.map
