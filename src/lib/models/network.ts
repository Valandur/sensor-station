import type { ServiceConfig, ServiceData } from './service';

// ---------
// Widgets
// ---------

// ---------
// Service
// ---------

export const NETWORK_SERVICE_TYPE = 'network';

export interface NetworkServiceData extends ServiceData {
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
