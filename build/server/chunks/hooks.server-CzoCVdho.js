import { resolve, normalize } from 'path';
import { readFile } from 'fs/promises';
import { d as private_env } from './shared-server-49TKSBDM.js';
import { B as BaseLogger } from './BaseLogger-SyOYFtXW.js';
import { s as setup$1 } from './data-XNdO4b4k.js';
import { s as setup$2 } from './data3-Kdiu0Rmi.js';
import { mkdir, stat, appendFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import './index-H42hWO6o.js';
import { isSameMinute, format } from 'date-fns';
import { B as BaseCache } from './BaseCache-CtKtXkXQ.js';
import { s as setup$3 } from './data6-V1-qFLRv.js';
import 'node:util';
import 'chalk';
import 'node:crypto';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';

private_env.SENSOR_ENABLED === "1";
const CACHE_TIME = Number(private_env.SENSOR_CACHE_TIME);
private_env.SENSOR_DEVICE_PATH;
Number(private_env.SENSOR_DHT_TYPE);
Number(private_env.SENSOR_DHT_PIN);
const RECORDING_INTERVAL = Number(private_env.SENSOR_RECORDING_INTERVAL);
const RECORDING_FORMAT = private_env.SENSOR_RECORDING_FORMAT;
const RECORDINGS_PATH = "data/sensor/recording";
const logger$1 = new BaseLogger("SENSOR");
const cache = new BaseCache(logger$1, CACHE_TIME);
let recordTimer = null;
let lastRecordedTs = /* @__PURE__ */ new Date(0);
function setup() {
  if (recordTimer) {
    logger$1.info("Recording stopped");
    clearInterval(recordTimer);
    recordTimer = null;
  }
  if (!RECORDING_INTERVAL) {
    return;
  }
  logger$1.info("Recording started", RECORDING_INTERVAL);
  recordTimer = setInterval(() => record(), RECORDING_INTERVAL * 1e3);
}
async function record() {
  try {
    const data = cache.getDefaultData();
    if (!data) {
      logger$1.warn("No data to record");
      return;
    }
    if (isSameMinute(lastRecordedTs, data.ts)) {
      logger$1.debug("Skipping recording because no new data is available");
      return;
    }
    const fileName = `${RECORDINGS_PATH}_${format(/* @__PURE__ */ new Date(), RECORDING_FORMAT)}.csv`;
    await mkdir(dirname(fileName), { recursive: true });
    if (!await stat(fileName).catch(() => null)) {
      await appendFile(fileName, csvHeader(), "utf-8");
    }
    const recordedData = JSON.parse(JSON.stringify(data));
    await appendFile(RECORDINGS_PATH, dataToCsv(recordedData), "utf-8");
    lastRecordedTs = recordedData.ts;
    logger$1.debug(`Recorded`, recordedData.ts, recordedData.temp, recordedData.rh);
  } catch (err) {
    logger$1.error(err);
  }
}
function csvHeader() {
  return `Timestamp,Temperature,RH`;
}
function dataToCsv(d) {
  return `${d.ts},${d.temp},${d.rh}
`;
}
const logger = new BaseLogger("MAIN");
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
    key: "unhandled",
    params: { route: event.route, error: JSON.parse(JSON.stringify(error)) }
  };
};
async function init() {
  logger.info("Starting...");
  setup$1();
  setup$2();
  setup();
  setup$3();
}

export { handle, handleError };
//# sourceMappingURL=hooks.server-CzoCVdho.js.map
