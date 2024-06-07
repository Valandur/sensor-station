import type { ServiceConfig, ServiceData } from './service';
import type { WidgetConfig, WidgetProps } from './widget';

// ---------
// Widgets
// ---------

export const SRF_WIDGET_TYPE = 'srf';

export interface SrfWidgetConfig extends WidgetConfig {
	serviceName: string;
}

export interface SrfWidgetProps extends WidgetProps {
	name: string;
	feedId: string;
	items: NewsItem[];
}

// ---------
// Service
// ---------

export const SRF_SERVICE_TYPE = 'srf';

export interface SrfServiceConfig extends ServiceConfig {
	feedId: string;
}

export interface SrfServiceData extends ServiceData {
	feedId: string;
	items: NewsItem[];
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
