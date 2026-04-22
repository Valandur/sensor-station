import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const SBB_DEPARTURES_SERVICE_TYPE = 'sbb-departures';
export const SBB_DEPARTURES_SERVICE_ACTIONS = ['main', 'config'] as const;

export type SbbDeparturesServiceAction = (typeof SBB_DEPARTURES_SERVICE_ACTIONS)[number];

export interface SbbDeparturesServiceMainData extends ServiceData {
	type: 'data';
	prevPage: number;
	nextPage: number;
	departures: SbbDeparture[];
}
export interface SbbDeparturesServiceConfigData extends ServiceData {
	type: 'config';
	config: SbbDeparturesServiceConfig;
}
export type SbbDeparturesServiceData =
	| SbbDeparturesServiceMainData
	| SbbDeparturesServiceConfigData;

export interface SbbDeparturesServiceConfig extends ServiceConfig {
	apiKey: string;
	stopPoint: string;
	itemsPerPage: number;
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
