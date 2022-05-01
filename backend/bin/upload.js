"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
const date_fns_1 = require("date-fns");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const image_size_1 = require("image-size");
const service_1 = require("./service");
const ITEMS_PATH = `data/upload/items.json`;
class Upload extends service_1.Service {
    constructor() {
        super(...arguments);
        this.items = [];
    }
    async init() {
        const json = JSON.parse(await (0, promises_1.readFile)(ITEMS_PATH, 'utf-8').catch(() => '[]'));
        this.items = json.map((item) => ({
            title: item.title,
            date: item.date ? (0, date_fns_1.parseISO)(item.date) : new Date(),
            img: item.img.startsWith('/') ? item.img : '/' + item.img,
            ratio: item.ratio
        }));
    }
    dispose() { }
    async save(image, title, date) {
        const path = `/upload/${image.md5}${(0, path_1.extname)(image.name)}`;
        image.mv(`data/${path}`);
        const size = (0, image_size_1.imageSize)(image.data);
        this.items.push({ img: path, title, date, ratio: size.width / size.height });
        await (0, promises_1.writeFile)(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
    }
    async edit(img, title, date) {
        const idx = this.items.findIndex((i) => i.img === img);
        if (idx < 0) {
            throw new Error(`Removing invalid image`);
        }
        this.items = this.items.map((item, i) => (i !== idx ? item : { ...item, title, date }));
        await (0, promises_1.writeFile)(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
    }
    async remove(img) {
        const idx = this.items.findIndex((i) => i.img === img);
        if (idx < 0) {
            throw new Error(`Removing invalid image`);
        }
        await (0, promises_1.rm)(`data/${img}`);
        this.items.splice(idx, 1);
        await (0, promises_1.writeFile)(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
    }
}
exports.Upload = Upload;
