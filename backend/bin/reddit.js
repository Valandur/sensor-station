"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reddit = void 0;
const date_fns_1 = require("date-fns");
const rss_parser_1 = __importDefault(require("rss-parser"));
const probe_image_size_1 = __importDefault(require("probe-image-size"));
const service_1 = require("./service");
// Check if we have an actual image link in the content
const MATCHER = /<a href="([\w:\/\.]*?\.(jpg|jpeg|png|bmp|webp))">\[link\]/i;
class Reddit extends service_1.Service {
    constructor(feedUrl) {
        super();
        this.items = [];
        this.update = async () => {
            this.items = await this.getFeed(this.feedUrl);
        };
        this.feedUrl = feedUrl;
    }
    async init() {
        this.parser = new rss_parser_1.default({
            customFields: {
                item: ['media:thumbnail']
            }
        });
        await this.update();
        this.interval = setInterval(this.update, 10 * 60 * 1000);
    }
    dispose() {
        clearInterval(this.interval);
    }
    async getFeed(feedUrl) {
        const feed = await this.parser.parseURL(feedUrl);
        const items = [];
        const feedItems = feed.items.filter((i) => !!i['media:thumbnail'] && MATCHER.test(i.content)).slice(0, 10);
        for (const item of feedItems) {
            const imgUrl = item['media:thumbnail']['$'].url;
            const imgInfo = await (0, probe_image_size_1.default)(imgUrl);
            const title = item.title
                .replace(/[[({]?oc[\])}]?/gi, '')
                .replace(/[[({]?(\d+\s*[x×]\s*\d+)[\])}]?/gi, '')
                .split(/[,-.]/)
                .map((s) => s.trim())
                .filter((s) => !!s)
                .join('\n');
            items.push({ date: (0, date_fns_1.parseISO)(item.pubDate), title, img: imgUrl, ratio: imgInfo.width / imgInfo.height });
        }
        return items;
    }
}
exports.Reddit = Reddit;
