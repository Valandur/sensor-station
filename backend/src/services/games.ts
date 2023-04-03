import superagent from 'superagent';
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
	public freeEpic: Game[] | null = null;

	protected override async doInit(): Promise<void> {}

	protected override async doStart(): Promise<void> {
		this.freeEpic = null;
	}

	protected override async doUpdate(): Promise<void> {
		const { body } = await superagent.get(URL);

		const rawGames = body.data.Catalog.searchStore.elements;

		const games: Game[] = [];
		for (const game of rawGames) {
			if (!game.promotions) {
				continue;
			}

			const pos = game.promotions.promotionalOffers as any[];

			const offers = pos
				.flatMap((po) => po.promotionalOffers)
				.concat(game.promotions.upcomingPromotionalOffers.flatMap((po: any) => po.promotionalOffers))
				.filter((po) => po.discountSetting.discountType === 'PERCENTAGE' && po.discountSetting.discountPercentage === 0)
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
					game.keyImages.find((i: any) => i.type === 'OfferImageWide' || i.type === 'DieselStoreFrontWide')?.url || null
			});
		}

		this.freeEpic = games.sort((a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime());
	}

	protected override async doStop(): Promise<void> {
		this.freeEpic = null;
	}

	protected override async doDispose(): Promise<void> {}
}
