import { resolve, normalize } from 'path';
import { readFile } from 'fs/promises';
import { s as servicesService, L as Logger } from './services-Dd8MqIOo.js';
import './index2-ahRAPocb.js';
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

const logger = new Logger("MAIN");
await init();
const handle = async ({ event, resolve: resolve$1 }) => {
  const path = event.url.pathname;
  if (path.startsWith("/data/")) {
    const file = await readFile(resolve("." + normalize(path)));
    return new Response(file, { status: 200 });
  }
  const response = await resolve$1(event);
  return response;
};
const handleError = async ({ error, event }) => {
  logger.error(error);
  return {
    message: error instanceof Error ? error.message : JSON.stringify(error),
    params: { route: event.route, error: JSON.parse(JSON.stringify(error)) }
  };
};
async function init() {
  logger.info("Starting...");
  await servicesService.load();
}

export { handle, handleError };
//# sourceMappingURL=hooks.server-D_Y3BwRw.js.map
