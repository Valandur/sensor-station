"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const promises_1 = require("fs/promises");
const fastify_1 = __importDefault(require("fastify"));
const static_1 = __importDefault(require("@fastify/static"));
const fastify_file_upload_1 = __importDefault(require("fastify-file-upload"));
const cors_1 = __importDefault(require("@fastify/cors"));
const mercurius_1 = __importDefault(require("mercurius"));
const path_1 = require("path");
const image_size_1 = __importDefault(require("image-size"));
const get_video_dimensions_1 = __importDefault(require("get-video-dimensions"));
const child_process_1 = require("child_process");
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
        await this.webApp.register(fastify_file_upload_1.default);
        await this.webApp.register(static_1.default, {
            root: (0, path_1.resolve)('data', 'server', 'uploads'),
            prefix: '/uploads',
            decorateReply: false
        });
        this.webApp.post('/uploads', async (req, res) => {
            const files = req.raw.files;
            const file = files?.[0];
            if (!file) {
                res.status(400);
                res.send({ error: 'No file uploaded' });
                return;
            }
            const ts = req.body.ts;
            const title = req.body.title;
            const img = `${file.md5}${(0, path_1.extname)(file.name).toLowerCase()}`;
            const fileName = `./data/server/uploads/${img}`;
            file.mv(fileName);
            const ratio = await this.getRatio(fileName, file.data);
            if (this.uploadItems) {
                this.uploadItems.push({ ts, title, img, ratio });
                await (0, promises_1.writeFile)('./data/server/uploads.json', JSON.stringify(this.uploadItems), 'utf-8');
            }
            res.status(201).send();
        });
        this.webApp.put('/uploads/:img', async (req, res) => {
            const img = req.params.img;
            const ts = req.body.ts;
            const title = req.body.title;
            if (this.uploadItems) {
                this.uploadItems = this.uploadItems.map((item) => (item.img !== img ? item : { ...item, ts, title }));
                await (0, promises_1.writeFile)('./data/server/uploads.json', JSON.stringify(this.uploadItems), 'utf-8');
            }
            res.status(200).send();
        });
        this.webApp.delete('/uploads/:img', async (req, res) => {
            const img = req.params.img;
            if (this.uploadItems) {
                if (!this.uploadItems.some((item) => item.img === img)) {
                    throw new Error(`Image not found`);
                }
                await (0, promises_1.rm)(`./data/server/uploads/${img}`);
                this.uploadItems = this.uploadItems.filter((item) => item.img !== img);
                await (0, promises_1.writeFile)('./data/server/uploads.json', JSON.stringify(this.uploadItems), 'utf-8');
            }
            res.status(200).send();
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
                await (0, promises_1.writeFile)('./data/server/uploads.json', JSON.stringify(this.uploadItems), 'utf-8');
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
}
exports.Server = Server;
//# sourceMappingURL=server.js.map