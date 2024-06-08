import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetInstance, WidgetProps } from './widget';

// ---------
// Widgets
// ---------

export const GALLERY_WIDGET_TYPE = 'gallery';

export type GalleryWidgetInstance = WidgetInstance<GalleryWidgetConfig>;

export interface GalleryWidgetConfig extends WidgetConfig {
	serviceName: string;
}

export interface GalleryWidgetProps extends WidgetProps {
	image: GalleryImage;
}

// ---------
// Service
// ---------

export const GALLERY_SERVICE_TYPE = 'gallery';

export type GalleryServiceInstance = ServiceInstance<GalleryServiceConfig>;

export interface GalleryServiceData extends ServiceData {
	images: GalleryImage[];
}

export interface GalleryServiceConfig extends ServiceConfig {}

// ---------
// Others
// ---------

export interface GalleryImage {
	ts: Date;
	title: string;
	img: string;
	ratio: number;
}
