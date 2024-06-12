import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetData } from './widget';

// ---------
// Widgets
// ---------

export const SWISS_POST_WIDGET_TYPE = 'swiss-post';
export const SWISS_POST_WIDGET_ACTIONS = ['', 'config'] as const;

export type SwissPostWidgetAction = (typeof SWISS_POST_WIDGET_ACTIONS)[number];

export interface SwissPostWidgetMainData extends WidgetData<SwissPostWidgetAction> {
	action: '';
	shipment: Shipment;
}

export interface SwissPostWidgetConfigData extends WidgetData<SwissPostWidgetAction> {
	action: 'config';
	config: SwissPostWidgetConfig;
	services: ServiceInstance[];
}
export type SwissPostWidgetData = SwissPostWidgetMainData | SwissPostWidgetConfigData;

export interface SwissPostWidgetConfig extends WidgetConfig {
	service: string;
}

// ---------
// Service
// ---------

export const SWISS_POST_SERVICE_TYPE = 'swiss-post';
export const SWISS_POST_SERVICE_ACTIONS = ['', 'config'] as const;

export type SwissPostServiceAction = (typeof SWISS_POST_SERVICE_ACTIONS)[number];

export interface SwissPostServiceMainData extends ServiceData<SwissPostServiceAction> {
	action: '';
	shipments: Shipment[];
}
export interface SwissPostServiceConfigData extends ServiceData<SwissPostServiceAction> {
	action: 'config';
	config: SwissPostServiceConfig;
}

export type SwissPostServiceData = SwissPostServiceMainData | SwissPostServiceConfigData;

export interface SwissPostServiceConfig extends ServiceConfig {
	username: string;
	password: string;
}

// ---------
// Others
// ---------

export type RecursiveMap = Map<string, [string, RecursiveMap]>;

export interface Shipment {
	id: string;
	number: string;
	type: string;
	sender: string | null;
	arrival: string | null;
	status: string | null;
	dims: { x: number; y: number; z: number } | null;
	weight: number | null;
}
