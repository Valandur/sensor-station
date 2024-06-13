import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const EPIC_GAMES_SERVICE_TYPE = 'epic-games';
export const EPIC_GAMES_SERVICE_ACTIONS = ['main', 'preview', 'config'] as const;

export type EpicGamesServiceAction = (typeof EPIC_GAMES_SERVICE_ACTIONS)[number];

export interface EpicGamesServiceMainData extends ServiceData {
	type: 'data';
	games: GameItem[];
}
export interface EpicGamesServiceConfigData extends ServiceData {
	type: 'config';
	config: EpicGamesServiceConfig;
}
export type EpicGamesServiceData = EpicGamesServiceMainData | EpicGamesServiceConfigData;

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
