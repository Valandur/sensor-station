import { basename } from 'node:path';
import { createWriteStream } from 'node:fs';
import { differenceInSeconds, parseISO } from 'date-fns';
import { error } from '@sveltejs/kit';
import { mkdir, stat } from 'fs/promises';
import superagent from 'superagent';

import { env } from '$env/dynamic/private';

import { Logger } from '$lib/logger';
import type { Game } from '$lib/models/Game';

export const ENABLED = env.GAMES_ENABLED === '1';
const CACHE_TIME = Number(env.GAMES_CACHE_TIME);
const CACHE_PATH = 'data/games';
const BASE_URL = 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions';
const URL = `${BASE_URL}?locale=en-US&country=CH&allowCountries=CH`;

const logger = new Logger('GAMES');

let games: Game[] = [];
let cachedAt = new Date(0);

export async function getFreeEpicGames(): Promise<Game[]> {
	if (!ENABLED) {
		throw error(400, { message: 'Games module is disabled', key: 'games.disabled' });
	}

	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		logger.debug('Using cached games');
		return games;
	}

	logger.debug('Updating...');
	const startTime = process.hrtime.bigint();

	try {
		await mkdir(CACHE_PATH, { recursive: true });

		const { body } = await superagent.get(URL);

		const rawGames: RawGame[] = body.data.Catalog.searchStore.elements;

		const newGames: Game[] = [];
		for (const game of rawGames) {
			if (!game.promotions) {
				continue;
			}

			const pos = game.promotions.promotionalOffers;

			const offers = pos
				.flatMap((po) => po.promotionalOffers)
				.concat(game.promotions.upcomingPromotionalOffers.flatMap((po) => po.promotionalOffers))
				.filter(
					(po) =>
						po.discountSetting.discountType === 'PERCENTAGE' &&
						po.discountSetting.discountPercentage === 0
				)
				.map((po) => ({ start: parseISO(po.startDate), end: parseISO(po.endDate) }));

			const offer = offers[0];
			if (!offer) {
				continue;
			}

			const imgUrl =
				game.keyImages.find((i) => i.type === 'OfferImageWide' || i.type === 'DieselStoreFrontWide')
					?.url || null;
			const fileName = imgUrl ? basename(imgUrl) : null;

			if (imgUrl && fileName) {
				const localFilePath = `${CACHE_PATH}/${fileName}`;
				if (!(await stat(localFilePath).catch(() => null))) {
					const stream = createWriteStream(localFilePath);
					superagent.get(imgUrl).pipe(stream);
					await new Promise<void>((resolve) => stream.on('finish', () => resolve()));
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
		cachedAt = new Date();

		return games;
	} catch (err) {
		throw logger.toSvelteError(err);
	} finally {
		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		logger.info('Updated', diffTime, 'ms');
	}
}

interface RawGame {
	title: string;
	keyImages: {
		type: string;
		url: string;
	}[];
	promotions: {
		promotionalOffers: PromotionalOffer[];
		upcomingPromotionalOffers: PromotionalOffer[];
	};
}

interface PromotionalOffer {
	promotionalOffers: {
		startDate: string;
		endDate: string;
		discountSetting: {
			discountType: string;
			discountPercentage: number;
		};
	}[];
}
