import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetData } from './widget';

// ---------
// Widgets
// ---------

export const SBB_DEPARTURES_WIDGET_TYPE = 'sbb-departures';
export const SBB_DEPARTURES_WIDGET_ACTIONS = ['', 'config'] as const;

export type SbbDeparturesWidgetAction = (typeof SBB_DEPARTURES_WIDGET_ACTIONS)[number];

export interface SbbDeparturesWidgetMainData extends WidgetData<SbbDeparturesWidgetAction> {
	action: '';
	departures: SbbDeparture[];
}
export interface SbbDeparturesWidgetConfigData extends WidgetData<SbbDeparturesWidgetAction> {
	action: 'config';
	config: SbbDeparturesWidgetConfig;
	services: ServiceInstance[];
}
export type SbbDeparturesWidgetData = SbbDeparturesWidgetMainData | SbbDeparturesWidgetConfigData;

export interface SbbDeparturesWidgetConfig extends WidgetConfig {
	service: string;
	itemsPerPage: number;
}

// ---------
// Service
// ---------

export const SBB_DEPARTURES_SERVICE_TYPE = 'sbb-departures';
export const SBB_DEPARTURES_SERVICE_ACTIONS = ['', 'config'] as const;

export type SbbDeparturesServiceAction = (typeof SBB_DEPARTURES_SERVICE_ACTIONS)[number];

export interface SbbDeparturesServiceMainData extends ServiceData<SbbDeparturesServiceAction> {
	action: '';
	departures: SbbDeparture[];
}
export interface SbbDeparturesServiceConfigData extends ServiceData<SbbDeparturesServiceAction> {
	action: 'config';
	config: SbbDeparturesServiceConfig;
}
export type SbbDeparturesServiceData =
	| SbbDeparturesServiceMainData
	| SbbDeparturesServiceConfigData;

export interface SbbDeparturesServiceConfig extends ServiceConfig {
	apiKey: string;
	stopPoint: string;
}

// ---------
// Others
// ---------

export interface SbbDeparture {
	scheduled: Date;
	estimated: Date | null;
	delay: number;
	destination: string;
	lineName: string;
	type: string | null;
}
