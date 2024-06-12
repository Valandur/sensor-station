import type { ServiceConfig, ServiceData } from './service';

// ---------
// Widgets
// ---------

// ---------
// Service
// ---------

export const NETWORK_SERVICE_TYPE = 'network';
export const NETWORK_SERVICE_ACTIONS = [''] as const;

export type NetworkServiceAction = (typeof NETWORK_SERVICE_ACTIONS)[number];

export interface NetworkServiceData extends ServiceData<NetworkServiceAction> {
	interfaces: NetworkInterface[];
}

export interface NetworkServiceConfig extends ServiceConfig {}

// ---------
// Others
// ---------

export interface NetworkInterface {
	name: string;
	addresses: NetworkAddress[];
}

export interface NetworkAddress {
	family: 'IPv4' | 'IPv6';
	address: string;
	mac: string;
}
