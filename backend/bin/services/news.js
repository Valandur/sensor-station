"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
const date_fns_1 = require("date-fns");
const rss_parser_1 = __importDefault(require("rss-parser"));
const superagent_1 = __importDefault(require("superagent"));
const service_1 = require("./service");
const MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;
class News extends service_1.Service {
    parser = null;
    feedMap = new Map();
    async doInit() {
        this.parser = new rss_parser_1.default({
            customFields: {
                item: ['description']
            }
        });
    }
    async doStart() {
        this.feedMap = new Map();
    }
    async doUpdate() {
        for (const feed of this.feedMap.values()) {
            await this.updateFeed(feed);
        }
    }
    async doStop() {
        this.feedMap.clear();
    }
    async doDispose() {
        if (this.parser) {
            this.parser = null;
        }
    }
    async updateFeed(newsFeed) {
        if (!this.parser) {
            throw new Error(`Parser is not available`);
        }
        const feed = await this.parser.parseURL(newsFeed.feedUrl);
        const items = [];
        const feedItems = feed.items.filter((item) => !item.description.includes('Hier finden Sie')).slice(0, 10);
        for (const item of feedItems) {
            if (!item.guid || !item.title || !item.link) {
                continue;
            }
            const match = MATCHER.exec(item.description);
            if (!match) {
                continue;
            }
            const [, img, content] = match;
            const date = item.pubDate ? (0, date_fns_1.parse)(item.pubDate.substring(5), 'dd MMM yyyy HH:mm:ss x', new Date()) : new Date();
            const id = Buffer.from(item.guid, 'utf-8').toString('base64');
            items.push({
                id,
                ts: date.toISOString(),
                title: item.title,
                link: item.link,
                content: content || '',
                img: `https://www.srf.ch/static/cms/images/${img}`
            });
        }
        newsFeed.items = items;
    }
    async getItems(feedId) {
        let newsFeed = this.feedMap.get(feedId);
        if (!newsFeed) {
            this.log(`SETTING UP ${feedId}`);
            newsFeed = { name: feedId, feedUrl: `https://www.srf.ch/news/bnf/rss/${feedId}`, items: [] };
            this.feedMap.set(feedId, newsFeed);
            await this.updateFeed(newsFeed);
        }
        return newsFeed.items;
    }
    async getArticle(feedId, itemId) {
        const link = this.feedMap.get(feedId)?.items.find((i) => i.id === itemId)?.link;
        if (!link) {
            throw new Error(`Article not found ${feedId} - ${itemId}`);
        }
        const { text } = await superagent_1.default.get(link);
        let page = text;
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
//# sourceMappingURL=news.js.map