import { r as redirect, e as error } from './index-39e97e00.js';
import { C as Counter } from './counter-b37d52dc.js';
import { differenceInSeconds, parseISO } from 'date-fns';
import { b as private_env } from './shared-server-b7e48788.js';
import superagent from 'superagent';

const ENABLED = private_env.GAMES_ENABLED === "1";
const CACHE_TIME = Number(private_env.GAMES_CACHE_TIME);
const BASE_URL = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions";
const URL = `${BASE_URL}?locale=en-US&country=CH&allowCountries=CH`;
let games = [];
let cachedAt = /* @__PURE__ */ new Date(0);
async function getFreeEpicGames() {
  if (differenceInSeconds(/* @__PURE__ */ new Date(), cachedAt) <= CACHE_TIME) {
    return games;
  }
  const { body } = await superagent.get(URL);
  const rawGames = body.data.Catalog.searchStore.elements;
  const newGames = [];
  for (const game of rawGames) {
    if (!game.promotions) {
      continue;
    }
    const pos = game.promotions.promotionalOffers;
    const offers = pos.flatMap((po) => po.promotionalOffers).concat(game.promotions.upcomingPromotionalOffers.flatMap((po) => po.promotionalOffers)).filter(
      (po) => po.discountSetting.discountType === "PERCENTAGE" && po.discountSetting.discountPercentage === 0
    ).map((po) => ({ start: po.startDate, end: po.endDate }));
    const offer = offers[0];
    if (!offer) {
      continue;
    }
    newGames.push({
      title: game.title,
      startsAt: parseISO(offer.start),
      endsAt: parseISO(offer.end),
      image: game.keyImages.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (i) => i.type === "OfferImageWide" || i.type === "DieselStoreFrontWide"
      )?.url || null
    });
  }
  games = newGames.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  cachedAt = /* @__PURE__ */ new Date();
  return games;
}
const MAX_ITEMS = 2;
const counter = new Counter();
const load = async ({ url, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  let page = Number(url.searchParams.get("page") || "-");
  const allGames = await getFreeEpicGames().catch((err) => error(500, err.message));
  if (!("length" in allGames)) {
    console.error(allGames);
    throw allGames;
  }
  counter.max = allGames.length;
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const games2 = counter.sliceAndWrap(allGames, MAX_ITEMS, page);
  const dataParent = await parent();
  return {
    games: games2,
    nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 13;
const component = async () => (await import('./_page.svelte-17bd3d51.js')).default;
const server_id = "src/routes/(main)/screens/games/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-games-page.svelte.37c63ed4.js","_app/immutable/chunks/index.376c5e2b.js","_app/immutable/chunks/navigation.ea51746c.js","_app/immutable/chunks/singletons.ecd09117.js","_app/immutable/chunks/index.5120e63e.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-67db566e.js.map
