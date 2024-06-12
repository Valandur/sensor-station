import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetInstance, WidgetData } from './widget';

// ---------
// Widgets
// ---------

// ---------
// Service
// ---------

export const NETWORK_SERVICE_TYPE = 'network';
export const NETWORK_SERVICE_ACTIONS = [''] as const;

export type NetworkServiceAction = (typeof NETWORK_SERVICE_ACTIONS)[number];
export type NetworkServiceInstance = ServiceInstance<NetworkServiceConfig>;

export interface NetworkServiceData extends ServiceData<NetworkServiceConfig> {
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
