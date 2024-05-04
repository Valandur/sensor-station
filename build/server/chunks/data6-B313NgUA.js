import { createHash } from 'node:crypto';
import { e as error } from './index-C-arhqvZ.js';
import { parseISO } from 'date-fns';
import { writeFile, rm, readFile, readdir } from 'node:fs/promises';
import getDimensions from 'get-video-dimensions';
import imageSize from 'image-size';
import mime from 'mime-types';
import { d as private_env } from './shared-server-BfUoNEXY.js';
import { B as BaseLogger } from './BaseLogger-B58-fQ4u.js';

const ENABLED = private_env.UPLOADS_ENABLED === "1";
const UPLOADS_FILE = "data/uploads.json";
const UPLOADS_DIR = "data/uploads";
const logger = new BaseLogger("UPLOADS");
let uploads = [];
async function getUploads() {
  if (!ENABLED) {
    throw error(400, {
      message: `Uploads is disabled`,
      key: "uploads.disabled"
    });
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
  logger.debug("Saving...");
  const startTime = process.hrtime.bigint();
  await writeFile(UPLOADS_FILE, JSON.stringify(newUploads), "utf-8");
  const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
  logger.info("Saved", newUploads.length, "uploads", diffTime, "ms");
}
async function setup() {
  logger.debug("Loading...");
  const startTime = process.hrtime.bigint();
  const newUploads = JSON.parse(
    await readFile(UPLOADS_FILE, "utf-8").catch(() => "[]")
  ).map((item) => ({ ...item, ts: parseISO(item.ts) }));
  let added = false;
  const files = await readdir(UPLOADS_DIR).catch(() => []);
  for (const file of files) {
    if (newUploads.some((item) => item.img === file)) {
      continue;
    }
    logger.warn(`Found upload file without data entry: ${file}`);
    const ratio = await getRatio(`${UPLOADS_DIR}/${file}`);
    newUploads.push({ ts: /* @__PURE__ */ new Date(), title: "", img: file, ratio });
    added = true;
  }
  uploads = newUploads;
  const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
  logger.info("Loaded", newUploads.length, "uploads", diffTime, "ms");
  if (added) {
    await saveUploads(newUploads);
  }
}
async function getRatio(fileName, data) {
  if (fileName.endsWith(".mp4")) {
    try {
      const dims = await getDimensions(fileName);
      return dims.width / dims.height;
    } catch (err) {
      logger.warn("Could not get video size", err);
    }
  } else {
    try {
      const size = imageSize(data ? data : await readFile(fileName));
      if (!size.height || !size.width) {
        throw new Error(`Missing size information: ${JSON.stringify(size)}`);
      }
      return size.orientation && size.orientation >= 5 ? size.height / size.width : size.width / size.height;
    } catch (err) {
      logger.warn("Could not get image size", err);
    }
  }
  return 1;
}

export { storeUpload as a, saveUploads as b, deleteUpload as d, getUploads as g, setup as s };
//# sourceMappingURL=data6-B313NgUA.js.map
