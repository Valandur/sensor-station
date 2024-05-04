import TuyAPI from 'tuyapi';
import { e as error } from './index-C-arhqvZ.js';
import { d as private_env } from './shared-server-BfUoNEXY.js';
import { B as BaseCache } from './BaseCache-BtPY9_DY.js';
import { B as BaseLogger } from './BaseLogger-B58-fQ4u.js';
import 'date-fns';
import 'node:util';
import 'chalk';

const PROP_MAP = /* @__PURE__ */ new Map([
  [1, "on"],
  [3, "waterTime"],
  [4, "filterLife"],
  [5, "pumpTime"],
  [6, "waterReset"],
  [7, "filterReset"],
  [8, "pumpReset"],
  [10, "uv"],
  [11, "uvRuntime"],
  [12, "waterLevel"],
  [101, "waterLack"],
  [102, "waterType"],
  [103, "waterState"],
  [104, "waterEmpty"]
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
    ip: PROTOCOL_VERSION,
    version: DEVICE_IP,
    issueGetOnConnect: false
  });
  device.on("error", (err) => console.error(err));
  return cache.withDefault(forceUpdate, async () => {
    if (!ENABLED) {
      throw error(400, {
        message: `TUYA is disabled`,
        key: "tuya.disabled"
      });
    }
    await device.find();
    console.log("Device found");
    await device.connect();
    console.log("Device connected");
    const status = await device.get({ schema: true });
    if (typeof status !== "object") {
      throw error(500, {
        message: "Could not parse TUYA data",
        key: "tuya.status.invalid"
      });
    }
    device.disconnect();
    const info = {};
    for (const [prop, key] of PROP_MAP) {
      info[key] = status.dps[prop];
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
const component = async () => component_cache ??= (await import('./_page.svelte-NMWUH1Vf.js')).default;
const server_id = "src/routes/screens/tuya/+page.server.ts";
const imports = ["_app/immutable/nodes/17.CCpy0d7t.js","_app/immutable/chunks/4.DHRwv-0e.js","_app/immutable/chunks/index.B2WFuJON.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-CV_FKmx7.js.map
