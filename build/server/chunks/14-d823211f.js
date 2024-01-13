import { r as redirect, e as error } from './index-0087e825.js';
import superagent from 'superagent';
import { b as private_env } from './shared-server-b7e48788.js';
import { B as BaseCache } from './BaseCache-36285add.js';
import { B as BaseLogger } from './BaseLogger-c8654638.js';
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
  return cache.withDefault(forceUpdate, async () => {
    if (!ENABLED) {
      throw error(400, {
        message: `Printer is disabled`,
        key: "printer.disabled"
      });
    }
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
const component = async () => component_cache ??= (await import('./_page.svelte-d0056595.js')).default;
const server_id = "src/routes/screens/printer/+page.server.ts";
const imports = ["_app/immutable/nodes/14.c28f2ae0.js","_app/immutable/chunks/scheduler.4295992e.js","_app/immutable/chunks/index.48621620.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/EmptyCard.ba84940f.js","_app/immutable/chunks/index.abc68696.js","_app/immutable/chunks/index.00c12b3f.js","_app/immutable/chunks/index.c36e9de8.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-d823211f.js.map
