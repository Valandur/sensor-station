import { differenceInSeconds, parseISO } from 'date-fns';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import superagent from 'superagent';

import { Counter } from '$lib/counter';
import type { Game } from '$lib/models/Game';

import type { PageServerLoad } from './$types';

const ENABLED = env.GAMES_ENABLED === '1';
const CACHE_TIME = Number(env.GAMES_CACHE_TIME);
const MAX_ITEMS = 2;
const BASE_URL = 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions';
const URL = `${BASE_URL}?locale=en-US&country=CH&allowCountries=CH`;

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	let page = Number(url.searchParams.get('page') || '-');

	const allGames = await getFreeEpicGames();
	counter.max = allGames.length;

	if (!isFinite(page)) {
		page = counter.increment();
	}

	const games = counter.sliceAndWrap(allGames, MAX_ITEMS, page);
	const dataParent = await parent();

	return {
		games,
		nextPage: `?screen=${dataParent.index}&page=${counter.wrap(page + 1)}`,
		prevPage: `?screen=${dataParent.index}&page=${counter.wrap(page - 1)}`
	};
};

let games: Game[] = [];
let cachedAt = new Date(0);

async function getFreeEpicGames(): Promise<Game[]> {
	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		return games;
	}

	const { body } = await superagent.get(URL);

	const rawGames = body.data.Catalog.searchStore.elements;

	const newGames: Game[] = [];
	for (const game of rawGames) {
		if (!game.promotions) {
			continue;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const pos = game.promotions.promotionalOffers as any[];

		const offers = pos
			.flatMap((po) => po.promotionalOffers)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.concat(game.promotions.upcomingPromotionalOffers.flatMap((po: any) => po.promotionalOffers))
			.filter(
				(po) =>
					po.discountSetting.discountType === 'PERCENTAGE' &&
					po.discountSetting.discountPercentage === 0
			)
			.map((po) => ({ start: po.startDate, end: po.endDate }));

		const offer = offers[0];
		if (!offer) {
			continue;
		}

		newGames.push({
			title: game.title,
			startsAt: parseISO(offer.start),
			endsAt: parseISO(offer.end),
			image:
				game.keyImages.find(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(i: any) => i.type === 'OfferImageWide' || i.type === 'DieselStoreFrontWide'
				)?.url || null
		});
	}

	games = newGames.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
	cachedAt = new Date();

	return games;
}
