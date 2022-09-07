"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const body_parser_1 = require("body-parser");
require("dotenv/config");
require("./types");
const modem_1 = require("./modem");
const news_1 = require("./news");
const battery_1 = require("./battery");
const upload_1 = require("./upload");
const weather_1 = require("./weather");
const date_fns_1 = require("date-fns");
const promises_1 = require("fs/promises");
const main = async () => {
    let app = null;
    if (!process.env.DISABLE_SERVER) {
        app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        app.use((0, body_parser_1.json)());
        app.use(express_1.default.static(`../frontend/build`));
        app.options('*', (0, cors_1.default)());
        if (!process.env.DISABLE_UPLOAD) {
            console.log('upload...');
            const upload = new upload_1.Upload();
            await upload.init();
            app.use('/web', express_1.default.static(`../frontend/build`));
            app.use((0, body_parser_1.urlencoded)({ extended: true }));
            app.use((0, express_fileupload_1.default)({ createParentPath: true }));
            app.use(express_1.default.static(`data`));
            app.get('/upload', async (req, res) => {
                res.json(upload.items);
            });
            app.post('/upload', async (req, res) => {
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
                    await upload.save(img, title, date);
                    res.json(upload.items);
                }
                catch (err) {
                    console.error(err);
                    res.status(500).send(err.message);
                }
            });
            app.put('/upload', async (req, res) => {
                try {
                    const img = req.body.img;
                    const title = req.body.title;
                    const date = (0, date_fns_1.parseISO)(req.body.date);
                    await upload.edit(img, title, date);
                    res.json(upload.items);
                }
                catch (err) {
                    console.error(err);
                    res.status(500).send(err.message);
                }
            });
            app.delete('/upload', async (req, res) => {
                try {
                    await upload.remove(req.body.img);
                    res.json(upload.items);
                }
                catch (err) {
                    console.error(err);
                    res.status(500).send(err.message);
                }
            });
        }
        else {
            console.log('UPLOAD DISABLED');
        }
    }
    else {
        console.log('SERVER DISABLED');
    }
    // Battery
    console.log('battery...');
    const battery = new battery_1.Battery();
    if (!process.env.DISABLE_BATTERY) {
        await battery.init();
    }
    else {
        console.log('BATTERY DISABLED');
    }
    // Modem
    console.log('modem...');
    const modem = new modem_1.Modem();
    if (!process.env.DISABLE_MODEM) {
        await modem.init();
    }
    else {
        console.log('MODEM DISABLED');
    }
    if (app) {
        // General data route
        app.get('/data', (req, res) => {
            res.json({
                battery: battery.status,
                modem: modem.status,
                interfaces: modem.interfaces
            });
        });
    }
    // Weather
    console.log('weather...');
    const weather = new weather_1.Weather();
    await weather.init();
    if (process.env.RECORDING_INTERVAL) {
        await (0, promises_1.mkdir)('./data/recordings/', { recursive: true });
        const record = async () => {
            try {
                await weather.update();
                const { temp, rh } = weather.status;
                const date = new Date();
                const fileName = `./data/recordings/${(0, date_fns_1.format)(date, 'yyyy_MM')}.txt`;
                if (!(await (0, promises_1.stat)(fileName).catch(() => false))) {
                    await (0, promises_1.writeFile)(fileName, `${date.toISOString()},${temp},${rh}\n`, 'utf-8');
                }
                else {
                    await (0, promises_1.appendFile)(fileName, `${date.toISOString()},${temp},${rh}\n`, 'utf-8');
                }
                console.log(`Recorded temp & rh`, date, temp, rh);
            }
            catch (err) {
                console.error(err);
            }
        };
        await record();
        setInterval(record, 1000 * Number(process.env.RECORDING_INTERVAL));
    }
    if (app) {
        app.get('/weather', (req, res) => {
            res.json(weather.status);
        });
    }
    console.log('news...');
    const newsMap = new Map();
    if (app) {
        app.get('/news/:id', async (req, res) => {
            try {
                const id = req.params.id;
                let news = newsMap.get(id);
                if (!news) {
                    console.log(`setting up news ${id}`);
                    news = new news_1.News(id, `https://www.srf.ch/news/bnf/rss/${id}`);
                    newsMap.set(id, news);
                    await news.init();
                }
                res.json(news.items);
            }
            catch (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
        });
        app.get('/news/:id/:item', async (req, res) => {
            try {
                const id = req.params.id;
                let news = newsMap.get(id);
                if (!news) {
                    console.log(`setting up news ${id}`);
                    news = new news_1.News(id, `https://www.srf.ch/news/bnf/rss/${id}`);
                    newsMap.set(id, news);
                    await news.init();
                }
                const item = Number(req.params.item);
                const page = await news.getArticle(item);
                res.send(page);
            }
            catch (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
        });
    }
    if (app) {
        const port = process.env.PORT ? Number(process.env.PORT) : 80;
        await new Promise((resolve) => app.listen(port || 80, '0.0.0.0', resolve));
        console.log(`running on 0.0.0.0:${port}...`);
    }
};
main().catch((err) => console.error(err));
