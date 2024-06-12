import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetData } from './widget';

// ---------
// Widgets
// ---------

export const GALLERY_WIDGET_TYPE = 'gallery';
export const GALLERY_WIDGET_ACTIONS = ['', 'config'] as const;

export type GalleryWidgetAction = (typeof GALLERY_WIDGET_ACTIONS)[number];

export interface GalleryWidgetMainData extends WidgetData<GalleryWidgetAction> {
	action: '';
	image: GalleryImage;
}
export interface GalleryWidgetConfigData extends WidgetData<GalleryWidgetAction> {
	action: 'config';
	config: GalleryWidgetConfig;
	services: ServiceInstance[];
}
export type GalleryWidgetData = GalleryWidgetMainData | GalleryWidgetConfigData;

export interface GalleryWidgetConfig extends WidgetConfig {
	service: string;
}

// ---------
// Service
// ---------

export const GALLERY_SERVICE_TYPE = 'gallery';
export const GALLERY_SERVICE_ACTIONS = ['', 'config'] as const;

export type GalleryServiceAction = (typeof GALLERY_SERVICE_ACTIONS)[number];

export interface GalleryServiceData extends ServiceData<GalleryServiceAction> {
	images: GalleryImage[];
}

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
