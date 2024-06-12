import type { ServiceConfig, ServiceData } from './service';
import type { WidgetConfig, WidgetData, WidgetInstance } from './widget';

// ---------
// Widgets
// ---------

// ---------
// Service
// ---------

export const CAROUSEL_SERVICE_TYPE = 'carousel';
export const CAROUSEL_SERVICE_ACTIONS = ['', 'config', 'live'] as const;

export type CarouselServiceAction = (typeof CAROUSEL_SERVICE_ACTIONS)[number];

export interface CarouselServiceMainData extends ServiceData<CarouselServiceAction> {
	action: '' | 'live';
	index: number;
	screenWidget: WidgetInstance;
	screenData: WidgetData;
	prevScreen: string | null;
	nextScreen: string | null;
	switchInterval: number;
	updateInterval: number;
}
export interface CarouselServiceConfigData extends ServiceData<CarouselServiceAction> {
	action: 'config';
	config: CarouselServiceConfig;
	widgets: WidgetInstance[];
}
export type CarouselServiceData = CarouselServiceMainData | CarouselServiceConfigData;

export interface CarouselServiceConfig extends ServiceConfig {
	screens: { widget: string }[];
	switchInterval: number;
	updateInterval: number;
}

// ---------
// Others
// ---------

export interface CarouselScreen {
	widget: WidgetInstance;
}
