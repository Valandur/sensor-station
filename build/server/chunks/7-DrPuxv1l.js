import { e as error } from './index-C-arhqvZ.js';
import { networkInterfaces } from 'node:os';
import { d as private_env } from './shared-server-BfUoNEXY.js';
import { B as BaseCache } from './BaseCache-BtPY9_DY.js';
import { B as BaseLogger } from './BaseLogger-B58-fQ4u.js';
import 'date-fns';
import 'node:util';
import 'chalk';

const ENABLED = private_env.NETWORK_ENABLED === "1";
const CACHE_TIME = Number(private_env.NETWORK_CACHE_TIME);
const logger = new BaseLogger("NETWORK");
const cache = new BaseCache(logger, CACHE_TIME);
async function getData(forceUpdate = false) {
  if (!ENABLED) {
    throw error(400, {
      message: `Network is disabled`,
      key: "network.disabled"
    });
  }
  return cache.withDefault(forceUpdate, async () => {
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
const component = async () => component_cache ??= (await import('./_page.svelte-CTVjcL8R.js')).default;
const server_id = "src/routes/network/+page.server.ts";
const imports = ["_app/immutable/nodes/7.W5m8gzhy.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/time.DnlTQaVB.js","_app/immutable/chunks/index.DknyqqiT.js","_app/immutable/chunks/PageLayout.CoJAI8IG.js","_app/immutable/chunks/PageTitle.BPFk4NTW.js","_app/immutable/chunks/formatDistanceToNow.Dgm1Haac.js","_app/immutable/chunks/de.DgNxBmDO.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-DrPuxv1l.js.map
