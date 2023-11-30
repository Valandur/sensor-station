import { f as fail } from './index-0087e825.js';
import { g as getScreens, b as saveScreens } from './data3-99cb470a.js';
import 'node:fs/promises';
import 'node:path';
import './BaseLogger-c8654638.js';
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

const index = 20;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-dc4958dd.js')).default;
const server_id = "src/routes/settings/+page.server.ts";
const imports = ["_app/immutable/nodes/20.a8e6a358.js","_app/immutable/chunks/scheduler.f29c4489.js","_app/immutable/chunks/index.590f5f34.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/forms.d65cd5a8.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/chunks/singletons.11b689f7.js","_app/immutable/chunks/index.7b21c3ea.js","_app/immutable/chunks/navigation.ff1c13ff.js","_app/immutable/chunks/PageLayout.d39f9914.js","_app/immutable/chunks/PageTitle.ed68d073.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=20-37a0dcbe.js.map
