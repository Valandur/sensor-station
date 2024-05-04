import { g as getData } from './data2-DTn0GzuV.js';
import './index-C-arhqvZ.js';
import 'geo-tz';
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
const component = async () => component_cache ??= (await import('./_page.svelte-BJYPjL1i.js')).default;
const server_id = "src/routes/modem/+page.server.ts";
const imports = ["_app/immutable/nodes/6.Q576pQkD.js","_app/immutable/chunks/4.DHRwv-0e.js","_app/immutable/chunks/index.B2WFuJON.js","_app/immutable/chunks/time.DuQFaCpm.js","_app/immutable/chunks/index.Cg5-QVD7.js","_app/immutable/chunks/PageLayout.CVe67hBL.js","_app/immutable/chunks/PageTitle.Brkhye9l.js","_app/immutable/chunks/format.CJrgGK3Q.js","_app/immutable/chunks/de.oFxG6rdj.js","_app/immutable/chunks/formatDistanceToNow.CVSQz8Ye.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-B4Zu3nQW.js.map
