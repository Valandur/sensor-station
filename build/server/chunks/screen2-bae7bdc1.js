import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { B as BaseLogger } from './BaseLogger-d23f9d0c.js';

const SCREENS_PATH = "data/screens.json";
const logger = new BaseLogger("SCREENS");
let screens = [];
await loadScreens();
function getScreenUrl(index, dir = "next") {
  const screen = screens[index];
  return `/screens/${screen.name}/${screen.params ?? ""}?screen=${index}&dir=${dir}`;
}
async function getScreens() {
  return screens;
}
async function saveScreens(newScreens) {
  screens = newScreens;
  logger.debug("Saving...");
  const startTime = process.hrtime.bigint();
  await writeFile(SCREENS_PATH, JSON.stringify(newScreens), "utf-8");
  const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
  logger.info("Saved", newScreens.length, "screens", diffTime, "ms");
}
async function loadScreens() {
  logger.debug("Loading...");
  const startTime = process.hrtime.bigint();
  await mkdir(dirname(SCREENS_PATH), { recursive: true });
  const newScreens = JSON.parse(await readFile(SCREENS_PATH, "utf-8").catch(() => "[]"));
  screens = newScreens;
  const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
  logger.info("Loaded", newScreens.length, "screens", diffTime, "ms");
}

export { getScreenUrl as a, getScreens as g, saveScreens as s };
//# sourceMappingURL=screen2-bae7bdc1.js.map
