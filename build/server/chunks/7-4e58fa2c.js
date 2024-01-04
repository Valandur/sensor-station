import { e as error } from './index-0087e825.js';
import { networkInterfaces } from 'node:os';
import { b as private_env } from './shared-server-b7e48788.js';
import { B as BaseCache } from './BaseCache-36285add.js';
import { B as BaseLogger } from './BaseLogger-c8654638.js';
import 'date-fns';
import 'node:util';
import 'chalk';

const ENABLED = private_env.NETWORK_ENABLED === "1";
const CACHE_TIME = Number(private_env.NETWORK_CACHE_TIME);
const logger = new BaseLogger("NETWORK");
const cache = new BaseCache(logger, CACHE_TIME);
async function getData(forceUpdate = false) {
  return cache.withDefault(forceUpdate, async () => {
    if (!ENABLED) {
      throw error(400, {
        message: `Network is disabled`,
        key: "network.disabled"
      });
    }
    const interfaces = [];
    const networkInterfacesMap = networkInterfaces();
    for (const [name, infos] of Object.entries(networkInterfacesMap)) {
      if (!infos || !infos.length) {
        continue;
      }
      const addresses = infos.filter((info) => !info.internal).map(({ family, address, mac }) => ({
        family,
        address,
        mac
      }));
      if (addresses.length > 0) {
        interfaces.push({ name, addresses });
      }
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      interfaces
    };
  });
}
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

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-43dbeb10.js')).default;
const server_id = "src/routes/network/+page.server.ts";
const imports = ["_app/immutable/nodes/7.aa73c485.js","_app/immutable/chunks/scheduler.4295992e.js","_app/immutable/chunks/index.48621620.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/time.ec5210e0.js","_app/immutable/chunks/index.c59decee.js","_app/immutable/chunks/PageLayout.04501e93.js","_app/immutable/chunks/PageTitle.5fd81dac.js","_app/immutable/chunks/index.c36e9de8.js","_app/immutable/chunks/index.abc68696.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-4e58fa2c.js.map
