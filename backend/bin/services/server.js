"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const promises_1 = require("fs/promises");
const fastify_1 = __importDefault(require("fastify"));
const static_1 = __importDefault(require("@fastify/static"));
const cors_1 = __importDefault(require("@fastify/cors"));
const mercurius_1 = __importDefault(require("mercurius"));
const path_1 = require("path");
const image_size_1 = __importDefault(require("image-size"));
const get_video_dimensions_1 = __importDefault(require("get-video-dimensions"));
const child_process_1 = require("child_process");
const crypto_1 = require("crypto");
const mime_types_1 = __importDefault(require("mime-types"));
const date_fns_1 = require("date-fns");
const service_1 = require("./service");
const server_gql_1 = require("./server-gql");
class Server extends service_1.Service {
    uploadsEnabled = process.env['SERVER_UPLOAD_ENABLED'] === '1';
    screens = [];
    uploadItems = null;
    webApp = null;
    async doInit() {
        await (0, promises_1.mkdir)('./data/server/uploads', { recursive: true });
        this.webApp = (0, fastify_1.default)({ maxParamLength: 255 });
        await this.webApp.register(cors_1.default, { origin: true, credentials: true });
        const resolvers = {
            Query: {
                battery: () => ({
                    status: () => this.app.battery.status
                }),
                calendar: () => ({
                    events: () => this.app.calendar.events
                }),
                games: () => ({
                    freeEpic: () => this.app.games.freeEpic
                }),
                modem: () => ({
                    status: () => this.app.modem.status
                }),
                network: () => ({
                    interfaces: () => this.app.modem.interfaces
                }),
                news: () => ({
                    items: ({ feed }) => this.app.news.getItems(feed)
                }),
                sbb: () => ({
                    alerts: () => this.app.sbb.alerts
                }),
                screens: () => this.screens,
                sensors: () => ({
                    newest: () => this.app.sensor.newest,
                    recordings: () => this.app.sensor.getRecordings()
                }),
                uploads: () => ({
                    items: () => this.uploadItems
                }),
                weather: () => ({
                    hourly: () => this.app.weather.hourly,
                    daily: () => this.app.weather.daily,
                    alerts: () => this.app.weather.alerts
                })
            },
            Mutation: {
                saveScreens: async (_, { screens }) => {
                    this.screens = screens;
                    await (0, promises_1.writeFile)('./data/server/screens.json', JSON.stringify(screens), 'utf-8');
                    return this.screens;
                },
                saveUpload: async (_, { img, ts, title }) => {
                    // If 'img' looks like a data url then we're uploading a new image, otherwise upading an existing one
                    if (img.startsWith('data:')) {
                        const data = Buffer.from(img.substring(img.indexOf(',')), 'base64');
                        const hash = (0, crypto_1.createHash)('md5').update(ts, 'utf-8').update(title, 'utf-8').update(data).digest('hex');
                        const ext = mime_types_1.default.extension(img.substring(5, img.indexOf(';')));
                        img = `${hash}.${ext}`;
                        const fileName = `./data/server/uploads/${img}`;
                        await (0, promises_1.writeFile)(fileName, data);
                        const ratio = await this.getRatio(fileName, data);
                        if (this.uploadItems) {
                            this.uploadItems.push({ ts, title, img, ratio });
                            await this.saveUploadItems();
                        }
                    }
                    else {
                        if (this.uploadItems) {
                            this.uploadItems = this.uploadItems.map((item) => (item.img !== img ? item : { ...item, ts, title }));
                            await this.saveUploadItems();
                        }
                    }
                    return this.uploadItems;
                },
                deleteUpload: async (_, { img }) => {
                    if (this.uploadItems) {
                        if (!this.uploadItems.some((item) => item.img === img)) {
                            throw new Error(`Image not found`);
                        }
                        await (0, promises_1.rm)(`./data/server/uploads/${img}`);
                        this.uploadItems = this.uploadItems.filter((item) => item.img !== img);
                        await this.saveUploadItems();
                    }
                    return this.uploadItems;
                },
                restart: async () => {
                    (0, child_process_1.exec)('sudo /sbin/shutdown -r now', (msg) => this.log(msg));
                    return true;
                }
            }
        };
        await this.webApp.register(mercurius_1.default, { schema: server_gql_1.GQL_SCHEMA, resolvers, graphiql: true });
        await this.webApp.register(static_1.default, { root: (0, path_1.resolve)('..', 'frontend', 'build') });
        this.webApp.get('/news/:id/:item', async (req, res) => {
            const page = await this.app.news.getArticle(req.params.id, req.params.item);
            res.type('text/html');
            res.send(page);
        });
        // Exit here if we don't need any of the upload stuff
        if (!this.uploadsEnabled) {
            this.log('UPLOADS DISABLED');
            return;
        }
        await this.webApp.register(static_1.default, {
            root: (0, path_1.resolve)('data', 'server', 'uploads'),
            prefix: '/data/server/uploads',
            decorateReply: false
        });
    }
    async doStart() {
        this.screens = JSON.parse(await (0, promises_1.readFile)('./data/server/screens.json', 'utf-8').catch(() => '[]'));
        this.log(`Loaded ${this.screens.length} screens`);
        if (this.uploadsEnabled) {
            const items = JSON.parse(await (0, promises_1.readFile)('./data/server/uploads.json', 'utf-8').catch(() => '[]'));
            this.log(`Loaded ${items.length} uploaded images`);
            let added = false;
            const files = await (0, promises_1.readdir)('./data/server/uploads');
            for (const file of files) {
                if (items.some((item) => item.img === file)) {
                    continue;
                }
                this.warn(`Found upload file without data entry: ${file}`);
                const ratio = await this.getRatio(`./data/server/uploads/${file}`);
                items.push({ ts: new Date().toISOString(), title: '', img: file, ratio });
                added = true;
            }
            this.uploadItems = items;
            if (added) {
                await this.saveUploadItems();
            }
        }
        if (!this.webApp) {
            throw new Error('WebApp not available');
        }
        const port = (process.env['SERVER_PORT'] ? Number(process.env['SERVER_PORT']) : 80) || 80;
        const addr = await this.webApp.listen({ port, host: '0.0.0.0' });
        this.log(`RUNNING ON ${addr}...`);
    }
    async doStop() {
        if (this.webApp) {
            await this.webApp.close();
        }
        this.screens = [];
        this.uploadItems = null;
    }
    async doDispose() {
        if (this.webApp) {
            this.webApp = null;
        }
    }
    async getRatio(fileName, data) {
        if (fileName.endsWith('.mp4')) {
            try {
                const dims = await (0, get_video_dimensions_1.default)(fileName);
                return dims.width / dims.height;
            }
            catch (err) {
                this.error('Could not get video size', err);
            }
        }
        else {
            try {
                const size = (0, image_size_1.default)(data ? data : await (0, promises_1.readFile)(fileName));
                if (!size.height || !size.width) {
                    throw new Error(`Missing size information: ${JSON.stringify(size)}`);
                }
                return size.orientation && size.orientation >= 5 ? size.height / size.width : size.width / size.height; // If the image is rotated 90° switch the ratio
            }
            catch (err) {
                this.error('Could not get image size', err);
            }
        }
        return 1;
    }
    async saveUploadItems() {
        if (!this.uploadItems) {
            return;
        }
        this.uploadItems = this.uploadItems.sort((a, b) => (0, date_fns_1.parseISO)(a.ts).getTime() - (0, date_fns_1.parseISO)(b.ts).getTime());
        await (0, promises_1.writeFile)('./data/server/uploads.json', JSON.stringify(this.uploadItems), 'utf-8');
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map