import { f as fail } from './index2-ahRAPocb.js';
import { s as servicesService } from './services-hvqOe3c-.js';
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

const load = async () => {
  const types = servicesService.getTypes().sort((a, b) => a.name.localeCompare(b.name));
  const services = servicesService.getInstances().sort((a, b) => a.name.localeCompare(b.name));
  return {
    types,
    services
  };
};
const actions = {
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
const component = async () => component_cache ??= (await import('./_page.svelte-DflWZuRB.js')).default;
const server_id = "src/routes/services/+page.server.ts";
const imports = ["_app/immutable/nodes/4.BBab5yE4.js","_app/immutable/chunks/3.CIpb_NnJ.js","_app/immutable/chunks/index.wuN5Iy8Q.js","_app/immutable/chunks/services.ZfogjoJ9.js","_app/immutable/chunks/PageTitle.DkYuPY_b.js","_app/immutable/chunks/entry.DNWYZb8k.js","_app/immutable/chunks/swipe.5tBzsYLi.js"];
const stylesheets = ["_app/immutable/assets/services.CbzwPK_l.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-B-IEfQuQ.js.map
