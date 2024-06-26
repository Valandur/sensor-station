import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const SWISS_POST_SERVICE_TYPE = 'swiss-post';
export const SWISS_POST_SERVICE_ACTIONS = ['main', 'config'] as const;

export type SwissPostServiceAction = (typeof SWISS_POST_SERVICE_ACTIONS)[number];

export interface SwissPostServiceMainData extends ServiceData {
	type: 'data';
	prevPage: number;
	nextPage: number;
	shipment: Shipment;
}
export interface SwissPostServiceConfigData extends ServiceData {
	type: 'config';
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
