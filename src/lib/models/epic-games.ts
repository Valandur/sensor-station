import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetInstance, WidgetProps } from './widget';

// ---------
// Widgets
// ---------

export const EPIC_GAMES_WIDGET_TYPE = 'epic-games';

export type EpicGamesWidgetInstance = WidgetInstance<EpicGamesWidgetConfig>;

export interface EpicGamesWidgetConfig extends WidgetConfig {
	serviceName: string;
}

export interface EpicGamesWidgetProps extends WidgetProps {
	games: GameItem[];
}

// ---------
// Service
// ---------

export const EPIC_GAMES_SERVICE_TYPE = 'epic-games';

export type EpicGamesServiceInstance = ServiceInstance<EpicGamesServiceConfig>;

export interface EpicGamesServiceData extends ServiceData {
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
