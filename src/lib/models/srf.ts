import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetInstance, WidgetProps } from './widget';

// ---------
// Widgets
// ---------

export const SRF_WIDGET_TYPE = 'srf';

export type SrfWidgetInstance = WidgetInstance<SrfWidgetConfig>;

export interface SrfWidgetConfig extends WidgetConfig {
	serviceName: string;
}

export interface SrfWidgetProps extends WidgetProps {
	name: string;
	feedId: string;
	items: NewsItem[];
}

export interface SrfWidgetAction extends WidgetProps {
	simple: boolean;
	head: string;
	body: string;
}

// ---------
// Service
// ---------

export const SRF_SERVICE_TYPE = 'srf';

export type SrfServiceInstance = ServiceInstance<SrfServiceConfig>;

export interface SrfServiceConfig extends ServiceConfig {
	feedId: string;
	simpleDetails: boolean;
}

export interface SrfServiceData extends ServiceData {
	feedId: string;
	items: NewsItem[];
}

export interface SrfServiceAction extends ServiceData {
	simple: boolean;
	head: string;
	body: string;
}

// ---------
// Others
// ---------

export interface NewsItem {
	id: string;
	ts: Date;
	title: string;
	content: string;
	link: string;
	image: string;
}
