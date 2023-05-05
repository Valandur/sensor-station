import { f as fail } from './index-39e97e00.js';
import { g as getScreens, s as saveScreens } from './screen2-533d4d19.js';
import 'node:fs/promises';
import 'node:path';
import './counter-b37d52dc.js';
import './logger-515117da.js';
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

const index = 17;
const component = async () => (await import('./_page.svelte-6412315e.js')).default;
const server_id = "src/routes/settings/+page.server.ts";
const imports = ["_app/immutable/chunks/17.e5a9dd79.js","_app/immutable/chunks/index.dd49bebd.js","_app/immutable/chunks/forms.5379c4b7.js","_app/immutable/chunks/parse.d12b0d5b.js","_app/immutable/chunks/singletons.9760eb6e.js","_app/immutable/chunks/index.ad955a6c.js","_app/immutable/chunks/navigation.0042e1e0.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-41def12a.js.map
