import type { TuyaInfo } from '$lib/models/TuyaInfo';

export const PROP_MAP: Map<number, keyof Omit<TuyaInfo, 'ts'>> = new Map([
	[1, 'on'],
	[3, 'waterTime'],
	[4, 'filterLife'],
	[5, 'pumpTime'],
	[6, 'waterReset'],
	[7, 'filterReset'],
	[8, 'pumpReset'],
	[10, 'uv'],
	[11, 'uvRuntime'],
	[12, 'waterLevel'],
	[101, 'waterLack'],
	[102, 'waterType'],
	[103, 'waterState'],
	[104, 'waterEmpty']
]);
