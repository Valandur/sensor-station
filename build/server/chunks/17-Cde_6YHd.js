import TuyAPI from 'tuyapi';
import { e as error } from './index-C-arhqvZ.js';
import { d as private_env } from './shared-server-BfUoNEXY.js';
import { B as BaseCache } from './BaseCache-BtPY9_DY.js';
import { B as BaseLogger } from './BaseLogger-B58-fQ4u.js';
import 'date-fns';
import 'node:util';
import 'chalk';

const FILTER_LIFE_MAX = 43200;
const PUMP_TIME_MAX = 86400;
const UV_RUNTIME_MAX = 10800;
const IDENT = (value) => value;
const PROP_MAP = /* @__PURE__ */ new Map([
  [1, { key: "on", map: IDENT }],
  [3, { key: "waterTime", map: IDENT }],
  [4, { key: "filterLife", map: (value) => value / FILTER_LIFE_MAX * 100 }],
  [5, { key: "pumpTime", map: (value) => value / PUMP_TIME_MAX * 100 }],
  [6, { key: "waterReset", map: IDENT }],
  [7, { key: "filterReset", map: IDENT }],
  [8, { key: "pumpReset", map: IDENT }],
  [10, { key: "uv", map: IDENT }],
  [11, { key: "uvRuntime", map: (value) => value / UV_RUNTIME_MAX * 100 }],
  [
    12,
    {
      key: "waterLevel",
      map: (value) => value === "level_3" ? 100 : value === "level_2" ? 50 : 0
    }
  ],
  [101, { key: "waterLack", map: IDENT }],
  [102, { key: "ecoMode", map: IDENT }],
  [103, { key: "waterState", map: IDENT }],
  [104, { key: "waterEmpty", map: IDENT }]
]);
const ENABLED = private_env.TUYA_ENABLED === "1";
const CACHE_TIME = Number(private_env.TUYA_CACHE_TIME);
const CLIENT_ID = private_env.TUYA_CLIENT_ID;
const CLIENT_SECRET = private_env.TUYA_CLIENT_SECRET;
const PROTOCOL_VERSION = private_env.TUYA_PROTCOL_VERSION;
const DEVICE_IP = private_env.TUYA_DEVICE_IP;
const logger = new BaseLogger("TUYA");
const cache = new BaseCache(logger, CACHE_TIME);
async function getData(forceUpdate = false) {
  const device = new TuyAPI({
    id: CLIENT_ID,
    key: CLIENT_SECRET,
    ip: DEVICE_IP,
    version: PROTOCOL_VERSION,
    issueGetOnConnect: false
  });
  return cache.withDefault(forceUpdate, async () => {
    if (!ENABLED) {
      throw error(400, {
        message: `TUYA is disabled`,
        key: "tuya.disabled"
      });
    }
    await device.find();
    logger.debug("Device found");
    await device.connect();
    logger.debug("Device connected");
    const status = await device.get({ schema: true });
    if (typeof status !== "object") {
      throw error(500, {
        message: "Could not parse TUYA data",
        key: "tuya.status.invalid"
      });
    }
    device.disconnect();
    logger.debug("Device disconnected");
    const info = {};
    for (const [id, { key, map }] of PROP_MAP) {
      info[key] = map(status.dps[id]);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      ...info
    };
  });
}
const load = async () => {
  const info = await getData();
  return {
    info
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 17;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DW2jK82G.js')).default;
const server_id = "src/routes/screens/tuya/+page.server.ts";
const imports = ["_app/immutable/nodes/17.DW9OMIFW.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js","_app/immutable/chunks/Card.C7Fy4Ve5.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-Cde_6YHd.js.map
