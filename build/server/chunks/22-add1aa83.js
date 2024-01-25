import { f as fail } from './index-0087e825.js';
import { g as getUploads, a as storeUpload, b as saveUploads, d as deleteUpload } from './data6-678fab74.js';
import { parseISO } from 'date-fns';
import 'node:crypto';
import 'node:fs/promises';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';
import './shared-server-b7e48788.js';
import './BaseLogger-c8654638.js';
import 'node:util';
import 'chalk';

const load = async () => {
  const uploads = getUploads();
  return {
    uploads
  };
};
const actions = {
  add: async ({ request }) => {
    const data = await request.formData();
    const newDateStr = data.get("newDate");
    if (typeof newDateStr !== "string") {
      return fail(400, { newDate: newDateStr, invalid: true });
    }
    const newDate = parseISO(newDateStr);
    const newTitle = data.get("newTitle");
    if (typeof newTitle !== "string") {
      return fail(400, { newTitle, invalid: true });
    }
    const newImage = data.get("newImage");
    if (!newImage || typeof newImage === "string") {
      return fail(400, { newImage, invalid: true });
    }
    await storeUpload(newDate, newTitle, newImage);
  },
  save: async ({ request }) => {
    const data = await request.formData();
    const index = data.get("index");
    if (typeof index !== "string") {
      return fail(400, { index, invalid: true });
    }
    const idx = Number(index);
    if (!isFinite(idx)) {
      return fail(400, { index, invalid: true });
    }
    const dateStr = data.get("date");
    if (typeof dateStr !== "string") {
      return fail(400, { date: dateStr, invalid: true });
    }
    const date = parseISO(dateStr);
    const title = data.get("title");
    if (typeof title !== "string") {
      return fail(400, { title, invalid: true });
    }
    const uploads = await getUploads();
    if (idx < 0 || idx > uploads.length - 1) {
      return fail(400, { index, outOfRange: true });
    }
    const newUploads = uploads.map(
      (upload, i) => i !== idx ? upload : { ...upload, date, title }
    );
    saveUploads(newUploads);
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
    await deleteUpload(idx);
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
    const uploads = await getUploads();
    if (idx < 0 || idx > uploads.length - 1) {
      return fail(400, { index, outOfRange: true });
    }
    let newUploads = [];
    if (dir === "up") {
      if (idx === 0) {
        return fail(400, { dir, notPossible: true });
      } else {
        newUploads = [
          ...uploads.slice(0, idx - 1),
          uploads[idx],
          uploads[idx - 1],
          ...uploads.slice(idx + 1)
        ];
      }
    } else {
      if (idx === uploads.length - 2) {
        return fail(400, { dir, notPossible: true });
      } else {
        newUploads = [
          ...uploads.slice(0, idx),
          uploads[idx + 1],
          uploads[idx],
          ...uploads.slice(idx + 2)
        ];
      }
    }
    saveUploads(newUploads);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 22;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-ea3aa3ce.js')).default;
const server_id = "src/routes/uploads/+page.server.ts";
const imports = ["_app/immutable/nodes/22.b093626d.js","_app/immutable/chunks/scheduler.4295992e.js","_app/immutable/chunks/index.48621620.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/forms.bd6da71b.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/chunks/singletons.e964b54d.js","_app/immutable/chunks/index.c59decee.js","_app/immutable/chunks/navigation.3349dfc3.js","_app/immutable/chunks/index.bb59ecb5.js","_app/immutable/chunks/index.abc68696.js","_app/immutable/chunks/index.00c12b3f.js","_app/immutable/chunks/index.171fecba.js"];
const stylesheets = ["_app/immutable/assets/22.99eaf8cf.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=22-add1aa83.js.map
