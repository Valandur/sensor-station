import { readFile, writeFile } from 'fs/promises';
import { C as Counter } from './counter-b37d52dc.js';

const SCREENS_PATH = "data/screens.json";
let loaded = false;
let screens = [];
const counter = new Counter();
function getScreenUrl(newIndex, dir = "next") {
  const idx = counter.wrap(newIndex);
  const screen = screens[idx];
  return `/screens/${screen.name}/${screen.params ?? ""}?screen=${idx}&dir=${dir}`;
}
async function getScreens() {
  if (loaded) {
    return screens;
  }
  const newScreens = JSON.parse(await readFile(SCREENS_PATH, "utf-8").catch(() => "[]"));
  console.log(`Loaded ${newScreens.length} screens`);
  loaded = true;
  screens = newScreens;
  counter.max = newScreens.length;
  return screens;
}
async function saveScreens(newScreens) {
  loaded = true;
  screens = newScreens;
  counter.max = newScreens.length;
  await writeFile(SCREENS_PATH, JSON.stringify(newScreens), "utf-8");
}

export { getScreenUrl as a, getScreens as g, saveScreens as s };
//# sourceMappingURL=screen2-685638f9.js.map
