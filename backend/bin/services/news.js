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
const MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;
class News extends service_1.Service {
    constructor() {
        super(...arguments);
        this.enabled = process.env.NEWS_ENABLED === '1';
        this.feedMap = new Map();
        this.update = async () => {
            for (const feed of this.feedMap.values()) {
                await this.updateFeed(feed);
            }
        };
    }
    async init() {
        if (!this.enabled) {
            this.log('NEWS DISABLED');
            return;
        }
        this.parser = new rss_parser_1.default({
            customFields: {
                item: ['description']
            }
        });
        await this.update();
        if (process.env.NEWS_UPDATE_INTERVAL) {
            const interval = 1000 * Number(process.env.NEWS_UPDATE_INTERVAL);
            this.timer = setInterval(this.update, interval);
            this.log('NEWS UPDATE STARTED', interval);
        }
        else {
            this.log('NEWS UPDATE DISABLED');
        }
    }
    dispose() {
        clearInterval(this.timer);
    }
    async updateFeed(newsFeed) {
        const feed = await this.parser.parseURL(newsFeed.feedUrl);
        const items = [];
        const feedItems = feed.items.filter((item) => !item.description.includes('Hier finden Sie')).slice(0, 10);
        for (let i = 0; i < feedItems.length; i++) {
            const item = feedItems[i];
            const [, img, description] = MATCHER.exec(item.description);
            const date = (0, date_fns_1.parse)(item.pubDate.substring(5), 'dd MMM yyyy HH:mm:ss x', new Date());
            items.push({
                ts: date.toISOString(),
                title: item.title,
                link: `/news/${newsFeed.name}/${i}`,
                origLink: item.link,
                description: description,
                img: `https://www.srf.ch/static/cms/images/${img}`
            });
        }
        newsFeed.items = items;
    }
    async getItems(feedId) {
        let newsFeed = this.feedMap.get(feedId);
        if (!newsFeed) {
            this.log(`NEWS SETTING UP ${feedId}`);
            newsFeed = { name: feedId, feedUrl: `https://www.srf.ch/news/bnf/rss/${feedId}`, items: [] };
            this.feedMap.set(feedId, newsFeed);
            await this.updateFeed(newsFeed);
        }
        return newsFeed.items;
    }
    async getArticle(feedId, itemId) {
        const { data } = await (0, axios_1.default)(this.feedMap.get(feedId).items[itemId].origLink);
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
