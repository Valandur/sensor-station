import { g as getData } from './data-CHEg2DFd.js';
import 'node:fs/promises';
import 'node:path';
import './index-C-arhqvZ.js';
import 'date-fns';
import './shared-server-BfUoNEXY.js';
import './BaseCache-BtPY9_DY.js';
import './BaseLogger-B58-fQ4u.js';
import 'node:util';
import 'chalk';

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

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-C7F70DsV.js')).default;
const server_id = "src/routes/battery/+page.server.ts";
const imports = ["_app/immutable/nodes/5.BiMO5rZV.js","_app/immutable/chunks/4.DHRwv-0e.js","_app/immutable/chunks/index.B2WFuJON.js","_app/immutable/chunks/time.DuQFaCpm.js","_app/immutable/chunks/index.Cg5-QVD7.js","_app/immutable/chunks/PageLayout.CVe67hBL.js","_app/immutable/chunks/PageTitle.Brkhye9l.js","_app/immutable/chunks/formatDistanceToNow.CVSQz8Ye.js","_app/immutable/chunks/de.oFxG6rdj.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-DZ71Kl3U.js.map
