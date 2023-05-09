import { C as Counter } from './counter-b37d52dc.js';
import { basename } from 'node:path';
import { createWriteStream } from 'node:fs';
import { e as error } from './index-39e97e00.js';
import { mkdir, stat } from 'node:fs/promises';
import { parseISO } from 'date-fns';
import superagent from 'superagent';
import { b as private_env } from './shared-server-b7e48788.js';
import { B as BaseCache } from './BaseCache-8b1d2e36.js';
import { B as BaseLogger } from './BaseLogger-d23f9d0c.js';
import 'node:util';
import 'chalk';

const ENABLED = private_env.GAMES_ENABLED === "1";
const CACHE_TIME = Number(private_env.GAMES_CACHE_TIME);
const CACHE_PATH = "data/games";
const BASE_URL = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions";
const URL = `${BASE_URL}?locale=en-US&country=CH&allowCountries=CH`;
const logger = new BaseLogger("GAMES");
const cache = new BaseCache(logger, CACHE_TIME);
async function getData(force = false) {
  return cache.withDefault(force, async () => {
    if (!ENABLED) {
      throw error(400, {
        message: `Games is disabled`,
        key: "games.disabled"
      });
    }
    const { body } = await superagent.get(URL);
    const rawGames = body.data.Catalog.searchStore.elements;
    await mkdir(CACHE_PATH, { recursive: true });
    const games = [];
    for (const game of rawGames) {
      if (!game.promotions) {
        continue;
      }
      const pos = game.promotions.promotionalOffers;
      const offers = pos.flatMap((po) => po.promotionalOffers).concat(game.promotions.upcomingPromotionalOffers.flatMap((po) => po.promotionalOffers)).filter(
        (po) => po.discountSetting.discountType === "PERCENTAGE" && po.discountSetting.discountPercentage === 0
      ).map((po) => ({ start: parseISO(po.startDate), end: parseISO(po.endDate) }));
      const offer = offers[0];
      if (!offer) {
        continue;
      }
      const imgUrl = game.keyImages.find((i) => i.type === "OfferImageWide" || i.type === "DieselStoreFrontWide")?.url || null;
      const fileName = imgUrl ? basename(imgUrl) : null;
      if (imgUrl && fileName) {
        const localFilePath = `${CACHE_PATH}/${fileName}`;
        if (!await stat(localFilePath).catch(() => null)) {
          const stream = createWriteStream(localFilePath);
          superagent.get(imgUrl).pipe(stream);
          await new Promise((resolve) => stream.on("finish", () => resolve()));
        }
      }
      games.push({
        title: game.title,
        startsAt: offer.start,
        endsAt: offer.end,
        image: fileName
      });
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      games: games.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
    };
  });
}
const MAX_ITEMS = 2;
const counter = new Counter();
const load = async ({ url, parent }) => {
  const data = await getData();
  counter.max = data.games.length;
  let page = Number(url.searchParams.get("page") || "-");
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const games = counter.sliceAndWrap(data.games, MAX_ITEMS, page);
  const dataParent = await parent();
  return {
    games,
    nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 10;
const component = async () => (await import('./_page.svelte-84e7af3d.js')).default;
const server_id = "src/routes/screens/games/+page.server.ts";
const imports = ["_app/immutable/chunks/10.941d3c37.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/navigation.a811c17b.js","_app/immutable/chunks/singletons.7caf11e7.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-0d9dae5c.js.map
