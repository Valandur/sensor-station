import { e as error } from './index-H42hWO6o.js';
import { networkInterfaces } from 'node:os';
import { d as private_env } from './shared-server-49TKSBDM.js';
import { B as BaseCache } from './BaseCache-CtKtXkXQ.js';
import { B as BaseLogger } from './BaseLogger-SyOYFtXW.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-mlCh0KqN.js')).default;
const server_id = "src/routes/network/+page.server.ts";
const imports = ["_app/immutable/nodes/7.NK6yfZXS.js","_app/immutable/chunks/4.3xRaw29T.js","_app/immutable/chunks/index.wgffNSnY.js","_app/immutable/chunks/each.6w4Ej4nR.js","_app/immutable/chunks/time.nhAbNM2u.js","_app/immutable/chunks/index.-WvGjXqt.js","_app/immutable/chunks/PageLayout.T1G9AIqX.js","_app/immutable/chunks/PageTitle.hKPV8Aix.js","_app/immutable/chunks/formatDistanceToNow.9hzICZZP.js","_app/immutable/chunks/de.5ejuWyRG.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-ZtfIxQpl.js.map
