import { createWriteStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { basename } from 'node:path';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import type { ReadableStream } from 'node:stream/web';
import { env } from '$env/dynamic/private';
import { error, fail } from '@sveltejs/kit';
import { parseISO } from 'date-fns';

import type { ServiceActionFailure } from '$lib/models/service';
import { clamp } from '$lib/counter';
import {
	EPIC_GAMES_SERVICE_TYPE,
	EPIC_GAMES_SERVICE_ACTIONS,
	type EpicGamesServiceAction,
	type EpicGamesServiceConfig,
	type EpicGamesServiceConfigData,
	type EpicGamesServiceMainData,
	type GameItem,
	type RawGame
} from '$lib/models/epic-games';

import { Cache } from '../Cache';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

interface CacheData {
	ts: Date;
	games: GameItem[];
}

const ENABLED = env.EPIC_GAMES_ENABLED === '1';
const BASE_URL = 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions';
const URL = `${BASE_URL}?locale=en-US&country=CH&allowCountries=CH`;

export class EpicGamesService extends BaseService<EpicGamesServiceAction, EpicGamesServiceConfig> {
	public static readonly actions = EPIC_GAMES_SERVICE_ACTIONS;
	public override readonly type = EPIC_GAMES_SERVICE_TYPE;

	private readonly cache: Cache<CacheData> = new Cache(this.logger);

	protected getDefaultConfig(): EpicGamesServiceConfig {
		return {
			itemsPerPage: 2
		};
	}

	protected getActions(): ServiceActions<EpicGamesServiceAction> {
		return {
			config: {
				get: this.getConfig.bind(this),
				set: this.setConfig.bind(this)
			},
			main: {
				get: this.getData.bind(this)
			},
			preview: {
				get: this.getData.bind(this)
			}
		};
	}

	public async getConfig(_: ServiceGetDataOptions): Promise<EpicGamesServiceConfigData> {
		if (!ENABLED) {
			error(400, {
				message: `Epic Games is disabled`,
				key: 'epicGames.disabled'
			});
		}

		return {
			ts: new Date(),
			type: 'config',
			config: this.config
		};
	}

	public async setConfig({ form }: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const itemsPerPage = Number(form.get('itemsPerPage'));
		if (!isFinite(itemsPerPage)) {
			return fail(400, {
				key: 'calendar.itemsPerPage.invalid',
				message: 'Invalid number of items per page'
			});
		}

		this.config.itemsPerPage = itemsPerPage;
	}

	public async getData({ url }: ServiceGetDataOptions): Promise<EpicGamesServiceMainData> {
		if (!ENABLED) {
			error(400, {
				message: `Epic Games is disabled`,
				key: 'epicGames.disabled'
			});
		}

		const forceUpdate = url.searchParams.has('force');

		const data = await this.cache.with(
			{
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				const res = await fetch(URL);
				const body = await res.json();

				const rawGames: RawGame[] = body.data.Catalog.searchStore.elements;

				const folderPath = `data/${this.name}`;
				await mkdir(folderPath, { recursive: true });

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

					let imgFilePath: string | null = null;
					const imgUrl =
						game.keyImages.find(
							(i) => i.type === 'OfferImageWide' || i.type === 'DieselStoreFrontWide'
						)?.url ??
						game.keyImages[0]?.url ??
						null;

					if (imgUrl) {
						imgFilePath = `${folderPath}/${basename(imgUrl)}`;

						if (!(await stat(imgFilePath).catch(() => null))) {
							const res = await fetch(imgUrl);
							const stream = createWriteStream(imgFilePath);
							await finished(Readable.fromWeb(res.body as ReadableStream<Uint8Array>).pipe(stream));
						}
					}

					games.push({
						title: game.title,
						pct: offer.pct,
						startsAt: offer.start,
						endsAt: offer.end,
						image: imgFilePath
					});
				}

				return {
					ts: new Date(),
					games: games.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
				};
			}
		);

		let page = Number(url.searchParams.get('page'));
		if (!isFinite(page)) {
			page = 0;
		}
		const [games, prevPage, nextPage] = clamp(
			data.games.length,
			page,
			this.config.itemsPerPage,
			data.games
		);

		return {
			ts: data.ts,
			type: 'data',
			games
		};
	}
}
