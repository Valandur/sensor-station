import { e as error } from './index-39e97e00.js';
import { networkInterfaces } from 'node:os';
import { b as private_env } from './shared-server-b7e48788.js';
import { B as BaseCache } from './BaseCache-8b1d2e36.js';
import { B as BaseLogger } from './BaseLogger-d23f9d0c.js';
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
const component = async () => (await import('./_page.svelte-cdd7fdbd.js')).default;
const server_id = "src/routes/network/+page.server.ts";
const imports = ["_app/immutable/chunks/7.cdaba2a9.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/time.c4f0045c.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/PageLayout.efe40619.js","_app/immutable/chunks/PageTitle.37274199.js","_app/immutable/chunks/index.046a6bec.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-4e89708b.js.map
