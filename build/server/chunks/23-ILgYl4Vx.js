import { f as fail } from './index-C-arhqvZ.js';
import { g as getUploads, a as storeUpload, b as saveUploads, d as deleteUpload } from './data6-B313NgUA.js';
import { parseISO } from 'date-fns';
import 'node:crypto';
import 'node:fs/promises';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';
import './shared-server-BfUoNEXY.js';
import './BaseLogger-B58-fQ4u.js';
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

const index = 23;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DV5XbZeJ.js')).default;
const server_id = "src/routes/uploads/+page.server.ts";
const imports = ["_app/immutable/nodes/23.BEJoLu9o.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/forms.7u27LRK9.js","_app/immutable/chunks/entry.BmXhHqWg.js","_app/immutable/chunks/index.DknyqqiT.js","_app/immutable/chunks/format.BMwO3m9q.js","_app/immutable/chunks/de.DgNxBmDO.js","_app/immutable/chunks/parseISO.CrzjWr8W.js"];
const stylesheets = ["_app/immutable/assets/23.FC2lCCOD.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=23-ILgYl4Vx.js.map
