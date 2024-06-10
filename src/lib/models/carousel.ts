import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetInstance, WidgetProps } from './widget';

// ---------
// Widgets
// ---------

export const CAROUSEL_WIDGET_TYPE = 'carousel';

export type CarouselWidgetInstance = WidgetInstance<CarouselWidgetConfig>;

export interface CarouselWidgetConfig extends WidgetConfig {
	serviceName: string;
}

export interface CarouselWidgetProps extends WidgetProps {
	screens: CarouselScreen[];
	switchInterval: number;
	updateInterval: number;
}

// ---------
// Service
// ---------

export const CAROUSEL_SERVICE_TYPE = 'carousel';

export type CarouselServiceInstance = ServiceInstance<CarouselServiceConfig>;

export interface CarouselServiceData extends ServiceData {
	screens: CarouselScreen[];
	switchInterval: number;
	updateInterval: number;
}

export interface CarouselServiceConfig extends ServiceConfig {
	switchInterval: number;
	updateInterval: number;
}

// ---------
// Others
// ---------

export interface CarouselScreen {
	widget: WidgetInstance;
}
