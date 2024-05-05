import type { BaseData } from './BaseData';

export interface TuyaInfo extends BaseData {
	on: boolean;
	waterTime: number;
	filterLife: number;
	pumpTime: number;
	waterReset: boolean;
	filterReset: boolean;
	pumpReset: boolean;
	uv: boolean;
	uvRuntime: number;
	waterLevel: number;
	waterLack: boolean;
	ecoMode: number;
	waterState: boolean;
	waterEmpty: boolean;
}
