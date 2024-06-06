import type { BaseConfig } from './BaseConfig';
import type { BaseData } from './BaseData';
import type { WidgetInstance } from './widget';

export interface CarouselScreen {
	widget: WidgetInstance;
}

export interface CarouselData extends BaseData {
	screens: CarouselScreen[];
	switchInterval: number;
	updateInterval: number;
}

export interface CarouselConfig extends BaseConfig {}
