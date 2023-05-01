import { createHash } from 'crypto';
import { b as private_env } from './shared-server-b7e48788.js';
import { parseISO } from 'date-fns';
import { readFile, readdir, writeFile, rm } from 'fs/promises';
import getDimensions from 'get-video-dimensions';
import imageSize from 'image-size';
import mime from 'mime-types';

const ENABLED = private_env.UPLOADS_ENABLED === "1";
const UPLOADS_DIR = "data/uploads";
const UPLOADS_FILE = "data/uploads.json";
let loaded = false;
let uploads = [];
async function getUploads() {
  if (loaded) {
    return uploads;
  }
  const items = JSON.parse(
    await readFile(UPLOADS_FILE, "utf-8").catch(() => "[]")
  ).map((item) => ({ ...item, ts: parseISO(item.ts) }));
  console.log(`Loaded ${items.length} uploaded images`);
  let added = false;
  const files = await readdir(UPLOADS_DIR).catch(() => []);
  for (const file of files) {
    if (file === "uploads.json" || items.some((item) => item.img === file)) {
      continue;
    }
    console.warn(`Found upload file without data entry: ${file}`);
    const ratio = await getRatio(`${UPLOADS_DIR}/${file}`);
    items.push({ ts: /* @__PURE__ */ new Date(), title: "", img: file, ratio });
    added = true;
  }
  loaded = true;
  uploads = items;
  if (added) {
    await saveUploads(items);
  }
  return uploads;
}
async function storeUpload(ts, title, file) {
  const data = Buffer.from(await file.arrayBuffer());
  const hash = createHash("md5").update(ts.toISOString(), "utf-8").update(title, "utf-8").update(data).digest("hex");
  const ext = mime.extension(file.type);
  const img = `${hash}.${ext}`;
  const fileName = `${UPLOADS_DIR}/${img}`;
  await writeFile(fileName, data);
  const ratio = await getRatio(fileName, data);
  const uploads2 = await getUploads();
  const newUploads = uploads2.concat({ ts, title, img, ratio });
  await saveUploads(newUploads);
  return newUploads;
}
async function deleteUpload(index) {
  const uploads2 = await getUploads();
  const item = uploads2[index];
  await rm(`${UPLOADS_DIR}/${item.img}`);
  const newUploads = uploads2.filter((_, i) => i !== index);
  await saveUploads(newUploads);
}
async function saveUploads(newUploads) {
  uploads = newUploads.sort((a, b) => a.ts.getTime() - b.ts.getTime());
  await writeFile(UPLOADS_FILE, JSON.stringify(newUploads), "utf-8");
}
async function getRatio(fileName, data) {
  if (fileName.endsWith(".mp4")) {
    try {
      const dims = await getDimensions(fileName);
      return dims.width / dims.height;
    } catch (err) {
      console.error("Could not get video size", err);
    }
  } else {
    try {
      const size = imageSize(data ? data : await readFile(fileName));
      if (!size.height || !size.width) {
        throw new Error(`Missing size information: ${JSON.stringify(size)}`);
      }
      return size.orientation && size.orientation >= 5 ? size.height / size.width : size.width / size.height;
    } catch (err) {
      console.error("Could not get image size", err);
    }
  }
  return 1;
}

export { ENABLED as E, saveUploads as a, deleteUpload as d, getUploads as g, storeUpload as s };
//# sourceMappingURL=uploads-2dd5eb7c.js.map
