import { r as redirect, e as error } from './index-39e97e00.js';
import { C as Counter } from './counter-b37d52dc.js';
import { basename } from 'node:path';
import { createWriteStream } from 'node:fs';
import { differenceInSeconds, parseISO } from 'date-fns';
import { mkdir, stat } from 'fs/promises';
import superagent from 'superagent';
import { b as private_env } from './shared-server-b7e48788.js';
import { L as Logger } from './logger-515117da.js';
import 'node:util';
import 'chalk';

const ENABLED = private_env.GAMES_ENABLED === "1";
const CACHE_TIME = Number(private_env.GAMES_CACHE_TIME);
const CACHE_PATH = "data/games";
const BASE_URL = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions";
const URL = `${BASE_URL}?locale=en-US&country=CH&allowCountries=CH`;
const logger = new Logger("GAMES");
let games = [];
let cachedAt = /* @__PURE__ */ new Date(0);
async function getFreeEpicGames() {
  if (!ENABLED) {
    throw error(400, { message: "Games module is disabled", key: "games.disabled" });
  }
  if (differenceInSeconds(/* @__PURE__ */ new Date(), cachedAt) <= CACHE_TIME) {
    logger.debug("Using cached games");
    return games;
  }
  logger.debug("Updating...");
  const startTime = process.hrtime.bigint();
  try {
    await mkdir(CACHE_PATH, { recursive: true });
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
      newGames.push({
        title: game.title,
        startsAt: offer.start,
        endsAt: offer.end,
        image: fileName
      });
    }
    games = newGames.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
    cachedAt = /* @__PURE__ */ new Date();
    return games;
  } catch (err) {
    throw logger.toSvelteError(err);
  } finally {
    const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
    logger.info("Updated", diffTime, "ms");
  }
}
const MAX_ITEMS = 2;
const counter = new Counter();
const load = async ({ url, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  const allGames = await getFreeEpicGames();
  counter.max = allGames.length;
  let page = Number(url.searchParams.get("page") || "-");
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

const index = 12;
const component = async () => (await import('./_page.svelte-e2d1264f.js')).default;
const server_id = "src/routes/screens/games/+page.server.ts";
const imports = ["_app/immutable/chunks/12.f8ae00d0.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/navigation.4b0cd3b4.js","_app/immutable/chunks/singletons.057fe037.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-03fc052e.js.map
