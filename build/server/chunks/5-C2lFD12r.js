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
const component = async () => component_cache ??= (await import('./_page.svelte-pdddDUhZ.js')).default;
const server_id = "src/routes/battery/+page.server.ts";
const imports = ["_app/immutable/nodes/5.DAFtDBRs.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js","_app/immutable/chunks/time.DnlTQaVB.js","_app/immutable/chunks/index.DknyqqiT.js","_app/immutable/chunks/PageLayout.CoJAI8IG.js","_app/immutable/chunks/PageTitle.BPFk4NTW.js","_app/immutable/chunks/formatDistanceToNow.CVSQz8Ye.js","_app/immutable/chunks/de.oFxG6rdj.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-C2lFD12r.js.map
