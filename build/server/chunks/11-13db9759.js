import { differenceInSeconds, parseISO } from 'date-fns';
import { b as private_env } from './shared-server-b7e48788.js';
import { r as redirect } from './index-39e97e00.js';
import superagent from 'superagent';
import { C as Counter } from './counter-b37d52dc.js';

const ENABLED = private_env.GAMES_ENABLED === "1";
const CACHE_TIME = Number(private_env.GAMES_CACHE_TIME);
const MAX_ITEMS = 2;
const BASE_URL = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions";
const URL = `${BASE_URL}?locale=en-US&country=CH&allowCountries=CH`;
const counter = new Counter();
const load = async ({ url, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  let page = Number(url.searchParams.get("page") || "-");
  const allGames = await getFreeEpicGames();
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

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 11;
const component = async () => (await import('./_page.svelte-6b91fd49.js')).default;
const server_id = "src/routes/(main)/screens/games/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-games-page.svelte.cd5af77d.js","_app/immutable/chunks/index.71ce2ac2.js","_app/immutable/chunks/navigation.8cde14e2.js","_app/immutable/chunks/singletons.236baa5f.js","_app/immutable/chunks/index.b74bfe1d.js","_app/immutable/chunks/index.9432a293.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.c9025710.js","_app/immutable/chunks/index.5a0c5ef2.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-13db9759.js.map
