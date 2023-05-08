import type { BaseData } from './BaseData';

export interface ModemData extends BaseData {
	operator: string | null;
	signal: number | null;
	time: Date | null;
	timeTz: string | null;
	lat: number | null;
	lng: number | null;
	gpsTz: string | null;
}
