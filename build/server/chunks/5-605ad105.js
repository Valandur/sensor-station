import { g as getData } from './data-4ed13202.js';
import 'node:fs/promises';
import 'node:path';
import './index-0087e825.js';
import 'date-fns';
import './shared-server-b7e48788.js';
import './BaseCache-36285add.js';
import './BaseLogger-c8654638.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-20fa3872.js')).default;
const server_id = "src/routes/battery/+page.server.ts";
const imports = ["_app/immutable/nodes/5.71d73023.js","_app/immutable/chunks/scheduler.f29c4489.js","_app/immutable/chunks/index.ae6ce75b.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/time.6a42a18b.js","_app/immutable/chunks/index.7b21c3ea.js","_app/immutable/chunks/PageLayout.bc9831bb.js","_app/immutable/chunks/PageTitle.cea19cb8.js","_app/immutable/chunks/index.c36e9de8.js","_app/immutable/chunks/index.abc68696.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-605ad105.js.map
