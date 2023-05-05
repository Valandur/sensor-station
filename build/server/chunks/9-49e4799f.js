import { differenceInSeconds } from 'date-fns';
import { e as error } from './index-39e97e00.js';
import { networkInterfaces } from 'node:os';
import { b as private_env } from './shared-server-b7e48788.js';
import { L as Logger } from './logger-515117da.js';
import 'node:util';
import 'chalk';

const ENABLED = private_env.NETWORK_ENABLED === "1";
const CACHE_TIME = Number(private_env.NETWORK_CACHE_TIME);
const logger = new Logger("NETWORK");
let status = null;
let cachedAt = /* @__PURE__ */ new Date(0);
async function getStatus() {
  if (!ENABLED) {
    throw error(400, { message: "Network module is disabled", key: "network.disabled" });
  }
  if (status && differenceInSeconds(/* @__PURE__ */ new Date(), cachedAt) <= CACHE_TIME) {
    logger.debug("Using cached interfaces");
    return status;
  }
  logger.debug("Updating...");
  const startTime = process.hrtime.bigint();
  try {
    const newInterfaces = [];
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
        newInterfaces.push({ name, addresses });
      }
    }
    status = { ts: /* @__PURE__ */ new Date(), interfaces: newInterfaces };
    cachedAt = /* @__PURE__ */ new Date();
    return status;
  } finally {
    const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
    logger.info("Updated", diffTime, "ms");
  }
}
const load = async () => {
  const status2 = await getStatus();
  return {
    status: status2
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 9;
const component = async () => (await import('./_page.svelte-fc314086.js')).default;
const server_id = "src/routes/network/+page.server.ts";
const imports = ["_app/immutable/chunks/9.e5b51976.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/time.c4f0045c.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/PageLayout.efe40619.js","_app/immutable/chunks/PageTitle.37274199.js","_app/immutable/chunks/index.046a6bec.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-49e4799f.js.map
