import { basename } from 'node:path';
import { createWriteStream } from 'node:fs';
import { error } from '@sveltejs/kit';
import { mkdir, stat } from 'node:fs/promises';
import { parseISO } from 'date-fns';
import superagent from 'superagent';

import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { GameItem } from '$lib/models/GameItem';
import type { GamesData } from '$lib/models/GameData';

import type { RawGame } from './types';

const ENABLED = env.GAMES_ENABLED === '1';
const CACHE_TIME = Number(env.GAMES_CACHE_TIME);
const CACHE_PATH = 'data/games';
const BASE_URL = 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions';
const URL = `${BASE_URL}?locale=en-US&country=CH&allowCountries=CH`;

const logger = new BaseLogger('GAMES');
const cache = new BaseCache<GamesData>(logger, CACHE_TIME);

export async function getData(force = false) {
	if (!ENABLED) {
		throw error(400, {
			message: `Games is disabled`,
			key: 'games.disabled'
		});
	}

	return cache.withDefault(force, async () => {
		const { body } = await superagent.get(URL);

		const rawGames: RawGame[] = body.data.Catalog.searchStore.elements;

		await mkdir(CACHE_PATH, { recursive: true });

		const games: GameItem[] = [];
		for (const game of rawGames) {
			if (!game.promotions) {
				continue;
			}

			const pos = game.promotions.promotionalOffers;

			const offers = pos
				.flatMap((po) => po.promotionalOffers)
				.concat(game.promotions.upcomingPromotionalOffers.flatMap((po) => po.promotionalOffers))
				.filter((po) => po.discountSetting.discountType === 'PERCENTAGE')
				.map((po) => ({
					start: parseISO(po.startDate),
					end: po.endDate ? parseISO(po.endDate) : null,
					pct: po.discountSetting.discountPercentage
				}));

			const offer = offers[0];
			if (!offer) {
				continue;
			}

			const imgUrl =
				game.keyImages.find((i) => i.type === 'OfferImageWide' || i.type === 'DieselStoreFrontWide')
					?.url ||
				game.keyImages[0]?.url ||
				null;
			const fileName = imgUrl ? basename(imgUrl) : null;

			if (imgUrl && fileName) {
				const localFilePath = `${CACHE_PATH}/${fileName}`;
				if (!(await stat(localFilePath).catch(() => null))) {
					const stream = createWriteStream(localFilePath);
					superagent.get(imgUrl).pipe(stream);
					await new Promise<void>((resolve) => stream.on('finish', () => resolve()));
				}
			}

			games.push({
				title: game.title,
				pct: offer.pct,
				startsAt: offer.start,
				endsAt: offer.end,
				image: fileName
			});
		}

		return {
			ts: new Date(),
			games: games.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
		};
	});
}
