"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Games = void 0;
const axios_1 = __importDefault(require("axios"));
const date_fns_1 = require("date-fns");
const service_1 = require("./service");
class Games extends service_1.Service {
    timer = null;
    updatedAt = null;
    freeEpic = null;
    async doInit() { }
    async doStart() {
        await this.update();
        if (process.env['EPIC_UPDATE_INTERVAL']) {
            const interval = 1000 * Number(process.env['EPIC_UPDATE_INTERVAL']);
            this.timer = setInterval(this.update, interval);
            this.log('UPDATE STARTED', interval);
        }
        else {
            this.log('UPDATE DISABLED');
        }
    }
    async doStop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.updatedAt = null;
        this.freeEpic = null;
    }
    async doDispose() { }
    update = async () => {
        try {
            const { data } = await axios_1.default.request({
                method: 'GET',
                url: 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=CH&allowCountries=CH'
            });
            const rawGames = data.data.Catalog.searchStore.elements;
            const games = [];
            for (const game of rawGames) {
                if (!game.promotions) {
                    continue;
                }
                const pos = game.promotions.promotionalOffers;
                const offers = pos
                    .flatMap((po) => po.promotionalOffers)
                    .concat(game.promotions.upcomingPromotionalOffers.flatMap((po) => po.promotionalOffers))
                    .filter((po) => po.discountSetting.discountType === 'PERCENTAGE' && po.discountSetting.discountPercentage === 0)
                    .map((po) => ({ start: po.startDate, end: po.endDate }));
                const offer = offers[0];
                if (!offer) {
                    continue;
                }
                games.push({
                    title: game.title,
                    startsAt: offer.start,
                    endsAt: offer.end,
                    image: game.keyImages.find((i) => i.type === 'OfferImageWide' || i.type === 'DieselStoreFrontWide')?.url ||
                        null
                });
            }
            this.freeEpic = games.sort((a, b) => (0, date_fns_1.parseISO)(a.startsAt).getTime() - (0, date_fns_1.parseISO)(b.startsAt).getTime());
        }
        catch (err) {
            this.error(err);
        }
    };
}
exports.Games = Games;
