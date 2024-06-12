import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetData } from './widget';

// ---------
// Widgets
// ---------

export const EPIC_GAMES_WIDGET_TYPE = 'epic-games';
export const EPIC_GAMES_WIDGET_ACTIONS = ['', 'config'] as const;

export type EpicGamesWidgetAction = (typeof EPIC_GAMES_WIDGET_ACTIONS)[number];

export interface EpicGamesWidgetMainData extends WidgetData<EpicGamesWidgetAction> {
	action: '';
	games: GameItem[];
	prevPage: number;
	nextPage: number;
}
export interface EpicGamesWidgetConfigData extends WidgetData<EpicGamesWidgetAction> {
	action: 'config';
	config: EpicGamesWidgetConfig;
	services: ServiceInstance[];
}
export type EpicGamesWidgetData = EpicGamesWidgetMainData | EpicGamesWidgetConfigData;

export interface EpicGamesWidgetConfig extends WidgetConfig {
	service: string;
	itemsPerPage: number;
}

// ---------
// Service
// ---------

export const EPIC_GAMES_SERVICE_TYPE = 'epic-games';
export const EPIC_GAMES_SERVICE_ACTIONS = [''] as const;

export type EpicGamesServiceAction = (typeof EPIC_GAMES_SERVICE_ACTIONS)[number];

export interface EpicGamesServiceData extends ServiceData<EpicGamesServiceAction> {
	games: GameItem[];
}

export interface EpicGamesServiceConfig extends ServiceConfig {}

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
