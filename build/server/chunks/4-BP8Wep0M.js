import { f as fail } from './index2-ahRAPocb.js';
import { s as servicesService } from './services-BVBgM5TK.js';
import 'path';
import 'fs/promises';
import 'date-fns/format';
import 'node:util';
import 'chalk';
import 'date-fns';
import 'node:fs/promises';
import 'googleapis';
import 'date-holidays';
import 'date-fns/isSameDay';
import 'node:fs';
import 'node:path';
import 'node:stream';
import 'node:stream/promises';
import 'node:crypto';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';
import 'geo-tz/now';
import '@googlemaps/google-maps-services-js';
import 'serialport';
import 'node:os';
import 'node:dns/promises';
import 'node:child_process';
import 'node-wifi';
import 'xml2js';
import 'node-html-parser';
import 'rss-parser';
import 'html-entities';
import 'fetch-cookie';
import 'date-fns/parseISO';
import 'tough-cookie';
import 'tuyapi';

const load = async () => {
  const main = servicesService.getMain();
  const types = servicesService.getTypes().sort((a, b) => a.name.localeCompare(b.name));
  const services = servicesService.getInstances().sort((a, b) => a.name.localeCompare(b.name));
  return {
    main,
    types,
    services
  };
};
const actions = {
  save: async ({ request }) => {
    const data = await request.formData();
    const mainService = data.get("mainService");
    if (typeof mainService !== "string") {
      return fail(400, { message: "Invalid main service" });
    }
    servicesService.getByName(mainService);
    const mainAction = data.get("mainAction");
    if (typeof mainAction !== "string") {
      return fail(400, { message: "Invalid main action" });
    }
    await servicesService.setMain(mainService, mainAction);
  },
  add: async ({ request }) => {
    const data = await request.formData();
    const newName = data.get("newName");
    if (typeof newName !== "string") {
      return fail(400, { newName: "invalid" });
    }
    const newType = data.get("newType");
    if (typeof newType !== "string") {
      return fail(400, { newType: "invalid" });
    }
    try {
      await servicesService.add(newName, newType);
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        return err;
      }
      throw err;
    }
  },
  delete: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name");
    if (typeof name !== "string") {
      return fail(400, { name: "invalid" });
    }
    await servicesService.remove(name);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CWswgf77.js')).default;
const server_id = "src/routes/services/+page.server.ts";
const imports = ["_app/immutable/nodes/4.BT1e_Fe3.js","_app/immutable/chunks/scheduler.DSLye_OD.js","_app/immutable/chunks/index.BOehDzsP.js","_app/immutable/chunks/services.Bz_zstRo.js","_app/immutable/chunks/PageTitle.BjtMl_Ni.js","_app/immutable/chunks/entry.BPEvyJB0.js","_app/immutable/chunks/swipe.CS5eACr3.js"];
const stylesheets = ["_app/immutable/assets/services.BR_teu2-.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-BP8Wep0M.js.map
