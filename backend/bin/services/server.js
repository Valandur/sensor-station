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
const service_1 = require("./service");
const server_gql_1 = require("./server-gql");
class Server extends service_1.Service {
    constructor() {
        super(...arguments);
        this.enabled = process.env.SERVER_ENABLED === '1';
        this.uploadEnabled = process.env.SERVER_UPLOAD_ENABLED === '1';
        this.items = [];
        this.screens = [];
    }
    async init() {
        if (!this.enabled) {
            this.log('SERVER DISABLED');
            return;
        }
        await this.app.storage.run('CREATE TABLE IF NOT EXISTS screens (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, params TEXT)');
        this.screens = await this.app.storage.all('SELECT * FROM screens');
        this.log(`Loaded ${this.screens.length} screens`);
        this.webApp = (0, fastify_1.default)();
        await this.webApp.register(cors_1.default, {
            origin: true,
            credentials: true
        });
        const resolvers = {
            Query: {
                battery: () => this.app.battery.status,
                modem: () => this.app.modem.status,
                interfaces: () => this.app.modem.interfaces,
                forecasts: () => this.app.weather.forecasts,
                alerts: () => this.app.weather.alerts,
                sensors: () => this.app.sensor.newest,
                news: (_, { feed }) => this.app.news.getItems(feed),
                recordings: () => this.app.sensor.getRecordings(),
                uploads: () => this.items,
                events: () => this.app.calendar.events,
                screens: () => this.screens
            },
            Mutation: {
                saveScreens: async (_, { screens }) => {
                    await this.app.storage.run('DELETE FROM screens');
                    await this.app.storage.runPrepared('INSERT INTO screens (id, name, params) VALUES (?, ?, ?) ON CONFLICT (id) DO UPDATE SET name = excluded.name, params = excluded.params', screens.map((screen) => [screen.id, screen.name, screen.params]));
                    this.screens = await this.app.storage.all('SELECT * FROM screens');
                    return this.screens;
                }
            }
        };
        this.webApp.register(mercurius_1.default, { schema: server_gql_1.GQL_SCHEMA, resolvers, graphiql: true });
        this.webApp.get('/news/:id/:item', async (req, res) => {
            const id = req.params.id;
            const item = Number(req.params.item);
            const page = await this.app.news.getArticle(id, item);
            res.type('text/html');
            res.send(page);
        });
        this.webApp.register(static_1.default, {
            root: (0, path_1.resolve)('..', 'frontend2')
        });
        // Exit here if we don't need any of the upload stuff
        if (!this.uploadEnabled) {
            this.log('SERVER UPLOAD DISABLED');
            return;
        }
        this.webApp.register(fastify_file_upload_1.default);
        this.webApp.register(static_1.default, {
            root: (0, path_1.resolve)('data', 'upload'),
            prefix: '/upload',
            decorateReply: false
        });
        await this.app.storage.run('CREATE TABLE IF NOT EXISTS uploads (id INTEGER PRIMARY KEY AUTOINCREMENT, ts DATETIME, title TEXT, img TEXT, ratio DOUBLE)');
        this.items = await this.app.storage.all('SELECT * FROM uploads');
        this.log(`Loaded ${this.items.length} uploaded images`);
        this.webApp.post('/upload', async (req, res) => {
            const files = req.raw.files;
            if (!files) {
                res.status(400);
                res.send({ error: 'No file uploaded' });
                return;
            }
            const file = files[0];
            const title = req.body.title;
            const ts = req.body.ts;
            const path = `/upload/${file.md5}${(0, path_1.extname)(file.name)}`;
            file.mv(`data/${path}`);
            const size = (0, image_size_1.default)(file.data);
            const ratio = size.orientation >= 5 ? size.height / size.width : size.width / size.height; // If the image is rotated 90° switch the ratio
            const id = await this.app.storage.run('INSERT INTO uploads (ts, title, img, ratio) VALUES (?, ?, ?, ?)', [
                ts,
                title,
                path,
                ratio
            ]);
            this.items.push({ id, ts, title, img: path, ratio });
            res.status(201).send();
        });
        this.webApp.put('/upload/:id', async (req, res) => {
            const id = req.params.id;
            const ts = req.body.ts;
            const title = req.body.title;
            const img = req.body.img;
            this.items = this.items.map((item) => (item.id !== id ? item : { ...item, ts, title, img }));
            await this.app.storage.run('UPDATE uploads SET ts = ?, title = ?, img = ? WHERE id = ?', [ts, title, img, id]);
            res.status(200).send();
        });
        this.webApp.delete('/upload/:id', async (req, res) => {
            const id = req.params.id;
            const item = this.items.find((item) => item.id === id);
            if (!item) {
                throw new Error(`Image not found`);
            }
            await (0, promises_1.rm)(`data/${item.img}`);
            this.items = this.items.filter((item) => item.id !== id);
            await this.app.storage.run('DELETE FROM uploads WHERE id = ?', [item.id]);
            res.status(200).send();
        });
    }
    async start() {
        const port = (process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 80) || 80;
        const addr = await this.webApp.listen({ port, host: '0.0.0.0' });
        this.log(`SERVER RUNNING ON ${addr}...`);
    }
}
exports.Server = Server;
