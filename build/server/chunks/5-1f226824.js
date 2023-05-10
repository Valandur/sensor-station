import { g as getData } from './data-07e747d9.js';
import 'node:fs/promises';
import './index-39e97e00.js';
import 'date-fns';
import 'node:path';
import './shared-server-b7e48788.js';
import './BaseCache-8b1d2e36.js';
import './BaseLogger-d23f9d0c.js';
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
const component = async () => (await import('./_page.svelte-381389c9.js')).default;
const server_id = "src/routes/battery/+page.server.ts";
const imports = ["_app/immutable/chunks/5.1001dc7a.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/time.c4f0045c.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/PageLayout.efe40619.js","_app/immutable/chunks/PageTitle.37274199.js","_app/immutable/chunks/index.046a6bec.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-1f226824.js.map
