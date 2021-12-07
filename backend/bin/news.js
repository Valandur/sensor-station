"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
const axios_1 = __importDefault(require("axios"));
const date_fns_1 = require("date-fns");
const rss_parser_1 = __importDefault(require("rss-parser"));
const service_1 = require("./service");
const UPDATE_INTERVAL = 60 * 60 * 1000;
const MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;
class News extends service_1.Service {
    constructor(name, feedUrl) {
        super();
        this.items = [];
        this.update = async () => {
            this.items = await this.getFeed(this.feedUrl);
        };
        this.name = name;
        this.feedUrl = feedUrl;
    }
    async init() {
        this.parser = new rss_parser_1.default({
            customFields: {
                item: ['description']
            }
        });
        await this.update();
        this.interval = setInterval(this.update, UPDATE_INTERVAL);
    }
    dispose() {
        clearInterval(this.interval);
    }
    async getFeed(feedUrl) {
        const feed = await this.parser.parseURL(feedUrl);
        const items = [];
        const feedItems = feed.items.filter((item) => !item.description.includes('Hier finden Sie')).slice(0, 10);
        for (let i = 0; i < feedItems.length; i++) {
            const item = feedItems[i];
            const [, img, description] = MATCHER.exec(item.description);
            const date = date_fns_1.parse(item.pubDate.substring(5), 'dd MMM yyyy HH:mm:ss x', new Date());
            items.push({
                date: date,
                title: item.title,
                link: `/news/${this.name}/${i}`,
                origLink: item.link,
                description: description,
                img: `https://www.srf.ch/static/cms/images/${img}`
            });
        }
        return items;
    }
    async getArticle(id) {
        const { data } = await axios_1.default(this.items[id].origLink);
        let page = data;
        const headerStart = page.indexOf('<header');
        const mainStart = page.indexOf('<!-- Begin of main wrapper');
        page = page.substring(0, headerStart) + page.substring(mainStart);
        const mainEnd = page.indexOf('<!-- end of main wrapper-->');
        const scriptStart = page.indexOf('<span id="config__js"', mainEnd);
        page = page.substring(0, mainEnd) + page.substring(scriptStart);
        const headStart = page.indexOf('<head>') + 6;
        page = page.substring(0, headStart) + '<base href="https://www.srf.ch/">' + page.substring(headStart);
        page = page.replace('<div class="affix-placeholder affix-placeholder--compact js-affix-placeholder"></div>', '');
        return page;
    }
}
exports.News = News;
