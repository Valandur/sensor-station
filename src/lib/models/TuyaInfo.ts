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
	waterLevel: string;
	waterLack: boolean;
	waterType: number;
	waterState: boolean;
	waterEmpty: boolean;
}
