import type { ServiceConfig } from './service';

// ---------
// Service
// ---------

export const CAROUSEL_SERVICE_TYPE = 'carousel';
export const CAROUSEL_SERVICE_ACTIONS = ['main', 'config'] as const;

export type CarouselServiceAction = (typeof CAROUSEL_SERVICE_ACTIONS)[number];

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
}

export interface CarouselItem {
	name: string;
	action: string;
}
