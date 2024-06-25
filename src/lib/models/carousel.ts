import type { ServiceConfig, ServiceData, ServiceInstance } from './service';

// ---------
// Service
// ---------

export const CAROUSEL_SERVICE_TYPE = 'carousel';
export const CAROUSEL_SERVICE_ACTIONS = ['main', 'preview', 'config'] as const;

export type CarouselServiceAction = (typeof CAROUSEL_SERVICE_ACTIONS)[number];

export interface CarouselServiceMainData extends ServiceData {
	type: 'data';
	index: number;
	screen: CarouselScreen;
	screenData: ServiceData;
	screenType: string;
	prevScreen: string | null;
	nextScreen: string | null;
	switchInterval: number;
	updateInterval: number;
	icons: CarouselIcon[];
}
export interface CarouselServiceConfigData extends ServiceData {
	type: 'config';
	config: CarouselServiceConfig;
	services: ServiceInstance[];
}
export type CarouselServiceData = CarouselServiceMainData | CarouselServiceConfigData;

export interface CarouselServiceConfig extends ServiceConfig {
	screens: CarouselScreen[];
	switchInterval: number;
	updateInterval: number;
}

// ---------
// Others
// ---------

export interface CarouselIcon {
	name: string;
	type: string;
	action: string;
	data: ServiceData;
}

export interface CarouselScreen {
	name: string;
	action: string;
	icon: string;
}
