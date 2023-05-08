import type { NetworkAddress } from './NetworkAddress';

export interface NetworkInterface {
	name: string;
	addresses: NetworkAddress[];
}
