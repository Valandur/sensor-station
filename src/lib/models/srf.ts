import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetData } from './widget';

// ---------
// Widgets
// ---------

export const SRF_WIDGET_TYPE = 'srf';
export const SRF_WIDGET_ACTIONS = ['', 'config', 'details'] as const;

export type SrfWidgetAction = (typeof SRF_WIDGET_ACTIONS)[number];

export interface SrfWidgetMainData extends WidgetData<SrfWidgetAction> {
	action: '';
	items: NewsItem[];
}
export interface SrfWidgetConfigData extends WidgetData<SrfWidgetAction> {
	action: 'config';
	config: SrfWidgetConfig;
	services: ServiceInstance[];
}
export interface SrfWidgetDetailsData extends WidgetData<SrfWidgetAction> {
	action: 'details';
	simple: boolean;
	head: string;
	body: string;
}
export type SrfWidgetData = SrfWidgetMainData | SrfWidgetConfigData | SrfWidgetDetailsData;

export interface SrfWidgetConfig extends WidgetConfig {
	service: string;
	itemsPerPage: number;
}

// ---------
// Service
// ---------

export const SRF_SERVICE_TYPE = 'srf';
export const SRF_SERVICE_ACTIONS = ['', 'config', 'details'] as const;

export type SrfServiceAction = (typeof SRF_SERVICE_ACTIONS)[number];

export interface SrfServiceMainData extends ServiceData<SrfServiceAction> {
	action: '';
	items: NewsItem[];
}
export interface SrfServiceConfigData extends ServiceData<SrfServiceAction> {
	action: 'config';
	config: SrfServiceConfig;
}
export interface SrfWidgetDetailsData extends WidgetData<SrfWidgetAction> {
	action: 'details';
	simple: boolean;
	head: string;
	body: string;
}
export type SrfServiceData = SrfServiceMainData | SrfServiceConfigData | SrfWidgetDetailsData;

export interface SrfServiceConfig extends ServiceConfig {
	feedId: string;
	simpleDetails: boolean;
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
