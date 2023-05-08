import type { BaseData } from './BaseData';

export interface SensorData extends BaseData {
	temp: number;
	rh: number;
}
