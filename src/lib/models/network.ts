import type { WiFiNetwork } from 'node-wifi';

import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const NETWORK_SERVICE_TYPE = 'network';
export const NETWORK_SERVICE_ACTIONS = ['main', 'config', 'icon'] as const;

export type NetworkServiceAction = (typeof NETWORK_SERVICE_ACTIONS)[number];

export interface NetworkServiceMainData extends ServiceData {
	type: 'data';
	connected: boolean;
	interfaces: NetworkInterface[];
}
export interface NetworkServiceConfigData extends ServiceData {
	type: 'config';
	connections: WiFiNetwork[];
}
export type NetworkServiceData = NetworkServiceConfigData | NetworkServiceMainData;

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
