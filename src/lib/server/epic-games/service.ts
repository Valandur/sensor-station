import { basename } from 'node:path';
import { createWriteStream } from 'node:fs';
import { error } from '@sveltejs/kit';
import { mkdir, stat } from 'node:fs/promises';
import { parseISO } from 'date-fns';
import superagent from 'superagent';
import { env } from '$env/dynamic/private';

import {
	EPIC_GAMES_SERVICE_TYPE,
	type EpicGamesServiceConfig,
	type EpicGamesServiceData,
	type GameItem,
	type RawGame
} from '$lib/models/epic-games';

import { BaseService } from '../BaseService';

const ENABLED = env.EPIC_GAMES_ENABLED === '1';
const CACHE_PATH = 'data/games';
const BASE_URL = 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions';
const URL = `${BASE_URL}?locale=en-US&country=CH&allowCountries=CH`;

class EpicGamesService extends BaseService<EpicGamesServiceConfig, EpicGamesServiceData> {
	public override readonly type = EPIC_GAMES_SERVICE_TYPE;

	public constructor() {
		super('EPIC_GAMES');
	}

	public get(
		config: EpicGamesServiceConfig,
		forceUpdate?: boolean | undefined
	): Promise<EpicGamesServiceData> {
		return this.cache.with(
			{
				force: forceUpdate,
				resultCacheTime: config.resultCacheTime,
				errorCacheTime: config.errorCacheTime
			},
			async () => {
				if (!ENABLED) {
					throw error(400, {
						message: `Games is disabled`,
						key: 'games.disabled'
					});
				}

				const res = await fetch(URL);
				const body = await res.json();

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
						game.keyImages.find(
							(i) => i.type === 'OfferImageWide' || i.type === 'DieselStoreFrontWide'
						)?.url ||
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
			}
		);
	}

	public validate(config: FormData): Promise<EpicGamesServiceConfig> {
		throw new Error('Method not implemented.');
	}
}

export default new EpicGamesService();
