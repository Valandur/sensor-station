import type { BaseData } from './BaseData';
import type { NetworkInterface } from './NetworkInterface';

export interface NetworkData extends BaseData {
	interfaces: NetworkInterface[];
}
