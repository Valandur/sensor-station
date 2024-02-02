import { g as getData } from './data-d5P2oJKd.js';
import 'node:fs/promises';
import 'node:path';
import './index-H42hWO6o.js';
import 'date-fns';
import './shared-server-49TKSBDM.js';
import './BaseCache-CtKtXkXQ.js';
import './BaseLogger-SyOYFtXW.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-YkOaN1Rn.js')).default;
const server_id = "src/routes/battery/+page.server.ts";
const imports = ["_app/immutable/nodes/5.KUfiGlqs.js","_app/immutable/chunks/4.3xRaw29T.js","_app/immutable/chunks/index.wgffNSnY.js","_app/immutable/chunks/time.nhAbNM2u.js","_app/immutable/chunks/index.-WvGjXqt.js","_app/immutable/chunks/PageLayout.T1G9AIqX.js","_app/immutable/chunks/PageTitle.hKPV8Aix.js","_app/immutable/chunks/formatDistanceToNow.9hzICZZP.js","_app/immutable/chunks/de.5ejuWyRG.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5--5cJwUFx.js.map
