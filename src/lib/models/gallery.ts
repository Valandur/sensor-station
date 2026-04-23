import type { ServiceConfig } from './service';

// ---------
// Service
// ---------

export const GALLERY_SERVICE_TYPE = 'gallery';
export const GALLERY_SERVICE_ACTIONS = ['main', 'config'] as const;

export type GalleryServiceAction = (typeof GALLERY_SERVICE_ACTIONS)[number];

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
