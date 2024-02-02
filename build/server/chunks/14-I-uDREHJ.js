import { r as redirect, e as error } from './index-H42hWO6o.js';
import superagent from 'superagent';
import { d as private_env } from './shared-server-49TKSBDM.js';
import { B as BaseCache } from './BaseCache-CtKtXkXQ.js';
import { B as BaseLogger } from './BaseLogger-SyOYFtXW.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-_GgHEFX7.js')).default;
const server_id = "src/routes/screens/printer/+page.server.ts";
const imports = ["_app/immutable/nodes/14.sjeyn32t.js","_app/immutable/chunks/4.3xRaw29T.js","_app/immutable/chunks/index.wgffNSnY.js","_app/immutable/chunks/EmptyCard.i7c96Gnh.js","_app/immutable/chunks/de.5ejuWyRG.js","_app/immutable/chunks/constructFrom.5xxej_j7.js","_app/immutable/chunks/formatDistanceToNow.9hzICZZP.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-I-uDREHJ.js.map
