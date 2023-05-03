import { differenceInSeconds, parseISO } from 'date-fns';
import { env } from '$env/dynamic/private';
import superagent from 'superagent';

import type { Game } from '$lib/models/Game';

export const ENABLED = env.GAMES_ENABLED === '1';
const CACHE_TIME = Number(env.GAMES_CACHE_TIME);
const BASE_URL = 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions';
const URL = `${BASE_URL}?locale=en-US&country=CH&allowCountries=CH`;

let games: Game[] = [];
let cachedAt = new Date(0);

export async function getFreeEpicGames(): Promise<Game[]> {
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
