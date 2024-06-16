import { f as fail } from './index2-ahRAPocb.js';
import { s as servicesService } from './services-0YctC8u_.js';
import 'path';
import 'fs/promises';
import 'date-fns';
import 'node:util';
import 'chalk';
import 'node:fs/promises';
import 'googleapis';
import 'node:fs';
import 'node:path';
import 'node:stream';
import 'node:stream/promises';
import 'node:crypto';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';
import 'date-holidays';
import 'geo-tz/now';
import '@googlemaps/google-maps-services-js';
import 'serialport';
import 'node:os';
import 'xml2js';
import 'node-html-parser';
import 'rss-parser';
import 'html-entities';
import 'fetch-cookie';
import 'tuyapi';

const load = async ({ params, url, cookies }) => {
  const name = params.name;
  const action = params.action;
  const service = servicesService.getByName(name);
  const data = await service.get(action, { url, cookies });
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
      const result = await service.set(action, { url, cookies, form });
      await servicesService.save();
      if (result) {
        result.data.success = false;
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
const component = async () => component_cache ??= (await import('./_page.svelte-DFF92mXN.js')).default;
const server_id = "src/routes/services/[name]/[...action]/+page.server.ts";
const imports = ["_app/immutable/nodes/5.-qQfcfJu.js","_app/immutable/chunks/3.C4ySnAub.js","_app/immutable/chunks/index.UZGNPXQA.js","_app/immutable/chunks/services.Da1gGEVQ.js","_app/immutable/chunks/PageTitle.CWKVHOVo.js","_app/immutable/chunks/entry.1rdfPzjd.js","_app/immutable/chunks/swipe.B48ej6hc.js"];
const stylesheets = ["_app/immutable/assets/services.CbzwPK_l.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-CKjz8HKQ.js.map
