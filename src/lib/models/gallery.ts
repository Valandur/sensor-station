import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const GALLERY_SERVICE_TYPE = 'gallery';
export const GALLERY_SERVICE_ACTIONS = ['main', 'config'] as const;

export type GalleryServiceAction = (typeof GALLERY_SERVICE_ACTIONS)[number];

export interface GalleryServiceMainData extends ServiceData {
	type: 'data';
	prevPage: number;
	nextPage: number;
	image: GalleryImage;
}
export interface GalleryServiceConfigData extends ServiceData {
	type: 'config';
	images: GalleryImage[];
}
export type GalleryServiceData = GalleryServiceMainData | GalleryServiceConfigData;

export interface GalleryServiceConfig extends ServiceConfig {
	images: GalleryImage[];
}

// ---------
// Others
// ---------

export interface GalleryImage {
	ts: Date;
	title: string;
	img: string;
	ratio: number;
}
