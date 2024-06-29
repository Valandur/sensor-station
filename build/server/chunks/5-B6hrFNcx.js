import { f as fail } from './index2-ahRAPocb.js';
import { s as servicesService } from './services-BuUeMYek.js';
import 'path';
import 'fs/promises';
import 'date-fns';
import 'node:util';
import 'chalk';
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
import 'node-wifi';
import 'xml2js';
import 'node-html-parser';
import 'rss-parser';
import 'html-entities';
import 'fetch-cookie';
import 'date-fns/parseISO';
import 'tough-cookie';
import 'tuyapi';

const load = async ({ params, url, cookies }) => {
  const name = params.name;
  const action = params.action;
  const service = servicesService.getByName(name);
  const data = await service.get(action, { url, cookies, embedded: false });
  return {
    name: service.name,
    type: service.type,
    action,
    data
  };
};
const actions = {
  default: async ({ params, request, url, cookies }) => {
    const form = await request.formData();
    const name = form.get("name");
    if (typeof name !== "string") {
      return fail(400, { name, error: true, message: "Invalid service name" });
    }
    const action = params.action;
    const service = servicesService.getByName(name);
    try {
      const result = await service.set(action, { url, cookies, form, embedded: false });
      await servicesService.save();
      if (result) {
        return result;
      } else {
        return { success: true };
      }
    } catch (err) {
      const msg = err && typeof err === "object" && "message" in err ? typeof err.message === "string" || typeof err.message === "boolean" || typeof err.message === "number" ? err.message.toString() : JSON.stringify(err.message) : JSON.stringify(err);
      return fail(400, { name, error: true, message: msg });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-ByKe8dYO.js')).default;
const server_id = "src/routes/services/[name]/[...action]/+page.server.ts";
const imports = ["_app/immutable/nodes/5.CNZOMAjH.js","_app/immutable/chunks/scheduler.DSLye_OD.js","_app/immutable/chunks/index.BOehDzsP.js","_app/immutable/chunks/services.CopCvyBd.js","_app/immutable/chunks/PageTitle.uuPF5wkz.js","_app/immutable/chunks/entry.do_HKeN-.js","_app/immutable/chunks/swipe.CS5eACr3.js"];
const stylesheets = ["_app/immutable/assets/services.BR_teu2-.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-B6hrFNcx.js.map
