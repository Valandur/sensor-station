import { f as fail } from './index-H42hWO6o.js';
import { g as getScreens, b as saveScreens } from './data3-Kdiu0Rmi.js';
import 'node:fs/promises';
import 'node:path';
import './BaseLogger-SyOYFtXW.js';
import 'date-fns';
import 'node:util';
import 'chalk';

const load = async () => {
  const screens = await getScreens();
  return {
    screens
  };
};
const actions = {
  add: async ({ request }) => {
    const data = await request.formData();
    const newName = data.get("newName");
    if (typeof newName !== "string") {
      return fail(400, { newName, invalid: true });
    }
    const newParams = data.get("newParams");
    if (typeof newParams !== "string") {
      return fail(400, { newParams, invalid: true });
    }
    const screens = await getScreens();
    const newScreens = screens.concat({ name: newName, params: newParams });
    saveScreens(newScreens);
  },
  delete: async ({ request }) => {
    const data = await request.formData();
    const index = data.get("index");
    if (typeof index !== "string") {
      return fail(400, { index, invalid: true });
    }
    const idx = Number(index);
    if (!isFinite(idx)) {
      return fail(400, { index, invalid: true });
    }
    const screens = await getScreens();
    if (idx < 0 || idx > screens.length - 1) {
      return fail(400, { index, outOfRange: true });
    }
    const newScreens = screens.filter((_, i) => i !== idx);
    saveScreens(newScreens);
  },
  move: async ({ request }) => {
    const data = await request.formData();
    const index = data.get("index");
    if (typeof index !== "string") {
      return fail(400, { index, invalid: true });
    }
    const dir = data.get("dir");
    if (typeof dir !== "string" || dir !== "up" && dir !== "down") {
      return fail(400, { dir, invalid: true });
    }
    const idx = Number(index);
    if (!isFinite(idx)) {
      return fail(400, { index, invalid: true });
    }
    const screens = await getScreens();
    if (idx < 0 || idx > screens.length - 1) {
      return fail(400, { index, outOfRange: true });
    }
    let newScreens = [];
    if (dir === "up") {
      if (idx === 0) {
        return fail(400, { dir, notPossible: true });
      } else {
        newScreens = [
          ...screens.slice(0, idx - 1),
          screens[idx],
          screens[idx - 1],
          ...screens.slice(idx + 1)
        ];
      }
    } else {
      if (idx === screens.length - 2) {
        return fail(400, { dir, notPossible: true });
      } else {
        newScreens = [
          ...screens.slice(0, idx),
          screens[idx + 1],
          screens[idx],
          ...screens.slice(idx + 2)
        ];
      }
    }
    saveScreens(newScreens);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 21;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-s3qEu_0g.js')).default;
const server_id = "src/routes/settings/+page.server.ts";
const imports = ["_app/immutable/nodes/21.RAw-aelh.js","_app/immutable/chunks/4.3xRaw29T.js","_app/immutable/chunks/index.wgffNSnY.js","_app/immutable/chunks/each.6w4Ej4nR.js","_app/immutable/chunks/forms.HgM1faQG.js","_app/immutable/chunks/entry.UtEM1AVS.js","_app/immutable/chunks/index.-WvGjXqt.js","_app/immutable/chunks/PageLayout.T1G9AIqX.js","_app/immutable/chunks/PageTitle.hKPV8Aix.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=21-IsuKQvC9.js.map
