"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Games = void 0;
const superagent_1 = __importDefault(require("superagent"));
const date_fns_1 = require("date-fns");
const service_1 = require("./service");
const URL = 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=CH&allowCountries=CH';
class Games extends service_1.Service {
    freeEpic = null;
    async doInit() { }
    async doStart() {
        this.freeEpic = null;
    }
    async doUpdate() {
        const { body } = await superagent_1.default.get(URL);
        const rawGames = body.data.Catalog.searchStore.elements;
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
                image: game.keyImages.find((i) => i.type === 'OfferImageWide' || i.type === 'DieselStoreFrontWide')?.url || null
            });
        }
        this.freeEpic = games.sort((a, b) => (0, date_fns_1.parseISO)(a.startsAt).getTime() - (0, date_fns_1.parseISO)(b.startsAt).getTime());
    }
    async doStop() {
        this.freeEpic = null;
    }
    async doDispose() { }
}
exports.Games = Games;
//# sourceMappingURL=games.js.map