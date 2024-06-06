import type { ServiceConfig, ServiceData } from './service';
import type { WidgetInstance } from './widget';

export interface CarouselScreen {
	widget: WidgetInstance;
}

export interface CarouselServiceData extends ServiceData {
	screens: CarouselScreen[];
	switchInterval: number;
	updateInterval: number;
}

export interface CarouselServiceConfig extends ServiceConfig {}
