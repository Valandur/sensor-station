import { r as redirect, e as error } from './index-C-arhqvZ.js';
import superagent from 'superagent';
import { d as private_env } from './shared-server-BfUoNEXY.js';
import { B as BaseCache } from './BaseCache-BtPY9_DY.js';
import { B as BaseLogger } from './BaseLogger-B58-fQ4u.js';
import 'date-fns';
import 'node:util';
import 'chalk';

const ENABLED = private_env.PRINTER_ENABLED === "1";
const CACHE_TIME = Number(private_env.PRINTER_CACHE_TIME);
const API_URL = private_env.PRINTER_API_URL;
const API_KEY = private_env.PRINTER_API_KEY;
const logger = new BaseLogger("PRINTER");
const cache = new BaseCache(logger, CACHE_TIME);
async function getData(forceUpdate = false) {
  if (!ENABLED) {
    throw error(400, {
      message: `Printer is disabled`,
      key: "printer.disabled"
    });
  }
  return cache.withDefault(forceUpdate, async () => {
    const statusUrl = `${API_URL}/api/v1/status`;
    const { body } = await superagent.get(statusUrl).set("X-API-Key", API_KEY);
    return {
      ts: /* @__PURE__ */ new Date(),
      ...body
    };
  });
}
const load = async ({ parent }) => {
  const info = await getData();
  const dataParent = await parent();
  if ((!info.job || !info.job.id) && dataParent.skipScreen) {
    throw redirect(302, dataParent.skipScreen);
  }
  return {
    info
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B_bUK7VB.js')).default;
const server_id = "src/routes/screens/printer/+page.server.ts";
const imports = ["_app/immutable/nodes/14.Bfgbeu_U.js","_app/immutable/chunks/4.DHRwv-0e.js","_app/immutable/chunks/index.B2WFuJON.js","_app/immutable/chunks/EmptyCard.Dl6qkHxx.js","_app/immutable/chunks/de.oFxG6rdj.js","_app/immutable/chunks/formatDistanceToNow.CVSQz8Ye.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-CKVCBbQB.js.map
