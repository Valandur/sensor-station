import type { HolidaysTypes } from 'date-holidays';

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
	screen: CarouselItem;
	screenData: ServiceData;
	screenType: string;
	prevScreen: string | null;
	nextScreen: string | null;
	icons: CarouselIcon[];
	switchInterval: number;
	updateInterval: number;
	holiday: HolidaysTypes.Holiday | null;
}
export interface CarouselServiceConfigData extends ServiceData {
	type: 'config';
	config: CarouselServiceConfig;
	services: ServiceInstance[];
}
export type CarouselServiceData = CarouselServiceMainData | CarouselServiceConfigData;

export interface CarouselServiceConfig extends ServiceConfig {
	screens: CarouselItem[];
	icons: CarouselItem[];
	switchInterval: number;
	updateInterval: number;
	country: string;
	state: string;
}

// ---------
// Others
// ---------

export interface CarouselIcon extends CarouselItem {
	type: string;
	data: ServiceData;
}

export interface CarouselItem {
	name: string;
	action: string;
}
