import { r as redirect } from './index2-ahRAPocb.js';
import { exec } from 'node:child_process';
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

const load = async () => {
  const main = servicesService.getMain();
  if (main) {
    throw redirect(302, `/services/${main.name}/${main.action}`);
  }
  throw redirect(302, "/services");
};
const actions = {
  restart: async () => {
    exec("sudo /sbin/shutdown -r now", (msg) => console.log(msg));
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 3;
const server_id = "src/routes/+page.server.ts";
const imports = [];
const stylesheets = [];
const fonts = [];

export { fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-DpM6eUQx.js.map
