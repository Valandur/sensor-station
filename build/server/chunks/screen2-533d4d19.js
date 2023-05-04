import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { C as Counter } from './counter-b37d52dc.js';
import { L as Logger } from './logger-515117da.js';

const SCREENS_PATH = "data/screens.json";
const logger = new Logger("SCREENS");
let loaded = false;
let screens = [];
const counter = new Counter();
function getScreenUrl(index, dir = "next") {
  const idx = counter.wrap(index);
  const screen = screens[idx];
  return `/screens/${screen.name}/${screen.params ?? ""}?screen=${idx}&dir=${dir}`;
}
async function getScreens() {
  if (loaded) {
    return screens;
  }
  logger.debug("Loading...");
  const startTime = process.hrtime.bigint();
  await mkdir(dirname(SCREENS_PATH), { recursive: true });
  const newScreens = JSON.parse(await readFile(SCREENS_PATH, "utf-8").catch(() => "[]"));
  loaded = true;
  screens = newScreens;
  counter.max = newScreens.length;
  const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
  logger.info("Loaded", newScreens.length, "screens", diffTime, "ms");
  return screens;
}
async function saveScreens(newScreens) {
  loaded = true;
  screens = newScreens;
  counter.max = newScreens.length;
  logger.debug("Saving...");
  const startTime = process.hrtime.bigint();
  await writeFile(SCREENS_PATH, JSON.stringify(newScreens), "utf-8");
  const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
  logger.info("Saved", newScreens.length, "screens", diffTime, "ms");
}

export { getScreenUrl as a, getScreens as g, saveScreens as s };
//# sourceMappingURL=screen2-533d4d19.js.map
