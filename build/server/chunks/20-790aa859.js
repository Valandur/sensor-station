import { f as fail } from './index-39e97e00.js';
import { g as getUploads, s as storeUpload, a as saveUploads, d as deleteUpload } from './uploads-bb29aa9f.js';
import { parseISO } from 'date-fns';
import 'node:crypto';
import 'node:fs/promises';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';
import './shared-server-b7e48788.js';
import './BaseLogger-d23f9d0c.js';
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

const index = 20;
const component = async () => (await import('./_page.svelte-03d87b24.js')).default;
const server_id = "src/routes/uploads/+page.server.ts";
const imports = ["_app/immutable/chunks/20.10d82c8f.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/forms.390e815e.js","_app/immutable/chunks/parse.d12b0d5b.js","_app/immutable/chunks/singletons.850aac70.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/navigation.7746a0bd.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/20.99eaf8cf.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=20-790aa859.js.map
