import type { ServiceConfig } from './service';

// ---------
// Service
// ---------

export const EPIC_GAMES_SERVICE_TYPE = 'epic-games';
export const EPIC_GAMES_SERVICE_ACTIONS = ['main', 'config'] as const;

export type EpicGamesServiceAction = (typeof EPIC_GAMES_SERVICE_ACTIONS)[number];

export interface EpicGamesServiceConfig extends ServiceConfig {
	itemsPerPage: number;
}

// ---------
// Others
// ---------

export interface GameItem {
	title: string;
	pct: number;
	startsAt: Date;
	endsAt: Date | null;
	image: string | null;
}

export interface RawGame {
	title: string;
	keyImages: {
		type: string;
		url: string;
	}[];
	promotions: {
		promotionalOffers: RawPromotionalOffer[];
		upcomingPromotionalOffers: RawPromotionalOffer[];
	};
}

export interface RawPromotionalOffer {
	promotionalOffers: {
		startDate: string;
		endDate: string;
		discountSetting: {
			discountType: string;
			discountPercentage: number;
		};
	}[];
}
