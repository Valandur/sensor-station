"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const body_parser_1 = require("body-parser");
const news_1 = require("./news");
const reddit_1 = require("./reddit");
const weather_1 = require("./weather");
const upload_1 = require("./upload");
const pijuice_1 = require("./pijuice");
const main = async () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use((0, body_parser_1.json)());
    app.use(express_1.default.static(`../frontend/build`));
    if (!process.env.DISABLE_UPLOAD) {
        app.use('/web', express_1.default.static(`../frontend/build`));
        app.use((0, body_parser_1.urlencoded)({ extended: true }));
        app.use((0, express_fileupload_1.default)({ createParentPath: true }));
    }
    if (!process.env.DISABLE_PIJUICE) {
        console.log('pijuice...');
        const pijuice = new pijuice_1.PiJuice();
        await pijuice.init();
        app.get('/pijuice', (req, res) => {
            res.json({ status: pijuice.status, battery: pijuice.battery });
        });
    }
    console.log('weather...');
    const weather = new weather_1.Weather();
    await weather.init();
    app.get('/weather', (req, res) => {
        res.json({ forecasts: weather.forecasts, sensor: { temp: weather.sensorTemp, rh: weather.sensorRh } });
    });
    console.log('news...');
    const newsMap = new Map();
    app.get('/news/:id', async (req, res) => {
        const id = req.params.id;
        let news = newsMap.get(id);
        if (!news) {
            console.log(`setting up news ${id}`);
            news = new news_1.News(id, `https://www.srf.ch/news/bnf/rss/${id}`);
            newsMap.set(id, news);
            await news.init();
        }
        res.json(news.items);
    });
    app.get('/news/:id/:item', async (req, res) => {
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
    });
    if (!process.env.DISABLE_REDDIT) {
        console.log('reddit...');
        const redditMap = new Map();
        app.get('/reddit/:name', async (req, res) => {
            const name = req.params.name;
            let reddit = redditMap.get(name);
            if (!reddit) {
                console.log(`setting up reddit ${name}`);
                reddit = new reddit_1.Reddit(`https://www.reddit.com/r/${name}/hot/.rss`);
                redditMap.set(name, reddit);
                await reddit.init();
            }
            res.json(reddit.items);
        });
    }
    if (!process.env.DISABLE_UPLOAD) {
        console.log('upload...');
        const upload = new upload_1.Upload();
        await upload.init();
        app.use(express_1.default.static(`data`));
        app.get('/upload', async (req, res) => {
            res.json(upload.items);
        });
        app.post('/upload', async (req, res) => {
            if (!req.files) {
                return res.status(400).json({ error: 'No file uploaded' }).end();
            }
            const img = req.files.image;
            const descr = req.body.description;
            await upload.save(img, descr);
            res.json(upload.items);
        });
        app.delete('/upload', async (req, res) => {
            await upload.remove(req.body.img);
            res.json(upload.items);
        });
    }
    await new Promise((resolve) => app.listen(80, '0.0.0.0', resolve));
    console.log('running...');
};
main().catch((err) => console.error(err));
