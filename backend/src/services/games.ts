import axios from 'axios';
import { parseISO } from 'date-fns';

import { Service } from './service';

const URL =
	'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=CH&allowCountries=CH';

export interface Game {
	title: string;
	startsAt: string;
	endsAt: string;
	image: string | null;
}

export class Games extends Service {
	private timer: NodeJS.Timer | null = null;

	public updatedAt: Date | null = null;
	public freeEpic: Game[] | null = null;

	protected override async doInit(): Promise<void> {}

	protected override async doStart(): Promise<void> {
		await this.update();

		if (process.env['GAMES_UPDATE_INTERVAL']) {
			const interval = 1000 * Number(process.env['GAMES_UPDATE_INTERVAL']);
			this.timer = setInterval(this.update, interval);
			this.log('UPDATE STARTED', interval);
		} else {
			this.log('UPDATE DISABLED');
		}
	}

	protected override async doStop(): Promise<void> {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}

		this.updatedAt = null;
		this.freeEpic = null;
	}

	protected override async doDispose(): Promise<void> {}

	private update = async () => {
		try {
			const { data } = await axios.request({
				method: 'GET',
				url: URL
			});

			const rawGames = data.data.Catalog.searchStore.elements;

			const games: Game[] = [];
			for (const game of rawGames) {
				if (!game.promotions) {
					continue;
				}

				const pos = game.promotions.promotionalOffers as any[];

				const offers = pos
					.flatMap((po) => po.promotionalOffers)
					.concat(game.promotions.upcomingPromotionalOffers.flatMap((po: any) => po.promotionalOffers))
					.filter(
						(po) => po.discountSetting.discountType === 'PERCENTAGE' && po.discountSetting.discountPercentage === 0
					)
					.map((po) => ({ start: po.startDate, end: po.endDate }));

				const offer = offers[0];
				if (!offer) {
					continue;
				}

				games.push({
					title: game.title,
					startsAt: offer.start,
					endsAt: offer.end,
					image:
						game.keyImages.find((i: any) => i.type === 'OfferImageWide' || i.type === 'DieselStoreFrontWide')?.url ||
						null
				});
			}

			this.freeEpic = games.sort((a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime());
		} catch (err) {
			this.error(err);
		}
	};
}
