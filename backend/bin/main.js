"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const news_1 = require("./news");
const weather_1 = require("./weather");
const pijuice_1 = require("./pijuice");
const main = async () => {
    const app = express_1.default();
    app.use(cors_1.default());
    app.use(body_parser_1.json());
    app.use(express_1.default.static(`../frontend/build`));
    console.log('pijuice...');
    const pijuice = new pijuice_1.PiJuice();
    await pijuice.init();
    app.get('/battery', (req, res) => {
        res.json({ status: pijuice.status, battery: pijuice.battery });
    });
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
    await new Promise((resolve) => app.listen(3000, '0.0.0.0', resolve));
    console.log('running...');
};
main().catch((err) => console.error(err));
