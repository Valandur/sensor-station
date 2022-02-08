"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const probe_image_size_1 = __importDefault(require("probe-image-size"));
const service_1 = require("./service");
const ITEMS_PATH = `data/upload/items.json`;
class Upload extends service_1.Service {
    constructor() {
        super(...arguments);
        this.items = [];
    }
    async init() {
        this.items = JSON.parse((0, fs_1.readFileSync)(ITEMS_PATH, 'utf-8'));
        this.items = this.items.map((i) => ({ ...i, img: i.img.startsWith('/') ? i.img : '/' + i.img }));
    }
    dispose() { }
    async save(image, description) {
        const path = `/upload/${image.md5}${(0, path_1.extname)(image.name)}`;
        image.mv(`data/${path}`);
        const imgInfo = await (0, probe_image_size_1.default)(`http://localhost/${path}`);
        this.items.push({ img: path, title: description, ratio: imgInfo.width / imgInfo.height });
        (0, fs_1.writeFileSync)(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
    }
    async remove(img) {
        const idx = this.items.findIndex((i) => i.img === img);
        if (idx < 0) {
            throw new Error(`Removing invalid image`);
        }
        (0, fs_1.rmSync)(`data/${img}`);
        this.items.splice(idx, 1);
        (0, fs_1.writeFileSync)(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
    }
}
exports.Upload = Upload;
