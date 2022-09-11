"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const date_fns_1 = require("date-fns");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const image_size_1 = __importDefault(require("image-size"));
const path_1 = require("path");
const body_parser_1 = require("body-parser");
const promises_1 = require("fs/promises");
const service_1 = require("./service");
const ITEMS_PATH = `data/upload/items.json`;
class Server extends service_1.Service {
    constructor() {
        super(...arguments);
        this.enabled = !process.env.SERVER_DISABLED;
        this.uploadEnabled = !process.env.SERVER_UPLOAD_DISABLED;
        this.cbs = [];
        this.items = [];
    }
    async init() {
        if (!this.enabled) {
            console.log('SERVER DISABLED');
            return;
        }
        this.webApp = (0, express_1.default)();
        this.webApp.use((0, cors_1.default)());
        this.webApp.use((0, body_parser_1.json)());
        this.webApp.use(express_1.default.static(`../frontend/build`));
        this.webApp.options('*', (0, cors_1.default)());
        // General data route
        this.webApp.get('/data', (req, res) => {
            res.json({
                battery: this.app.battery.status,
                modem: this.app.modem.status,
                interfaces: this.app.modem.interfaces
            });
        });
        // News
        this.webApp.get('/news/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const items = await this.app.news.getItems(id);
                res.json(items);
            }
            catch (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
        });
        this.webApp.get('/news/:id/:item', async (req, res) => {
            try {
                const id = req.params.id;
                const item = Number(req.params.item);
                const page = await this.app.news.getArticle(id, item);
                res.send(page);
            }
            catch (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
        });
        // Weather
        this.webApp.get('/weather', (req, res) => {
            res.json({
                forecasts: this.app.weather.forecasts,
                alerts: this.app.weather.alerts,
                temp: this.app.sensor.temperature,
                rh: this.app.sensor.relativeHumidity
            });
        });
        // Recordings
        this.webApp.get('/recordings/:year/:month', (req, res) => {
            try {
                const year = req.params.year;
                const month = req.params.month;
                res.setHeader('content-type', 'text/csv');
                res.setHeader('content-disposition', `attachment;filename=recordings_${year}_${month}.csv`);
                this.app.sensor.createReadStream(year, month).pipe(res);
            }
            catch (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
        });
        if (!this.uploadEnabled) {
            console.log('SERVER UPLOAD DISABLED');
            return;
        }
        this.webApp.use('/web', express_1.default.static(`../frontend/build`));
        this.webApp.use((0, body_parser_1.urlencoded)({ extended: true }));
        this.webApp.use((0, express_fileupload_1.default)({ createParentPath: true }));
        // TODO: Only expose uploads folder
        this.webApp.use(express_1.default.static(`data`));
        const itemsJson = JSON.parse(await (0, promises_1.readFile)(ITEMS_PATH, 'utf-8').catch(() => '[]'));
        this.items = itemsJson.map((item) => ({
            title: item.title,
            date: item.date ? (0, date_fns_1.parseISO)(item.date) : new Date(),
            img: item.img.startsWith('/') ? item.img : '/' + item.img,
            ratio: item.ratio
        }));
        console.log(`Loaded ${this.items.length} uploaded images`);
        this.webApp.get('/upload', async (req, res) => {
            res.json(this.items);
        });
        this.webApp.post('/upload', async (req, res) => {
            try {
                if (!req.files) {
                    return res.status(400).json({ error: 'No file uploaded' }).end();
                }
                const img = req.files.image;
                const title = req.body.title;
                let date = (0, date_fns_1.parseISO)(req.body.date);
                if (!(0, date_fns_1.isValid)(date)) {
                    date = new Date();
                }
                await this.save(img, title, date);
                res.json(this.items);
            }
            catch (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
        });
        this.webApp.put('/upload', async (req, res) => {
            try {
                const img = req.body.img;
                const title = req.body.title;
                const date = (0, date_fns_1.parseISO)(req.body.date);
                await this.edit(img, title, date);
                res.json(this.items);
            }
            catch (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
        });
        this.webApp.delete('/upload', async (req, res) => {
            try {
                await this.remove(req.body.img);
                res.json(this.items);
            }
            catch (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
        });
    }
    async register(cb) {
        this.cbs.push(cb);
    }
    async run() {
        if (!this.enabled) {
            this.cbs = [];
            return;
        }
        for (const cb of this.cbs) {
            await cb(this.webApp);
        }
        this.cbs = [];
        const port = (process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 80) || 80;
        await new Promise((resolve) => this.webApp.listen(port, '0.0.0.0', resolve));
        console.log(`SERVER RUNNING ON 0.0.0.0:${port}...`);
    }
    async save(image, title, date) {
        const path = `/upload/${image.md5}${(0, path_1.extname)(image.name)}`;
        image.mv(`data/${path}`);
        const size = (0, image_size_1.default)(image.data);
        const ratio = size.orientation >= 5 ? size.height / size.width : size.width / size.height; // If the image is rotated 90° switch the ratio
        this.items.push({ img: path, title, date, ratio });
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
exports.Server = Server;
