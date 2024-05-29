import type { BaseData } from './BaseData';

export interface ModemData extends BaseData {
	cellular: {
		operator: string | null;
		signal: number | null;
		netType: string | null;
		mcc: number | null;
		mnc: number | null;
		lac: number | null;
		cid: number | null;
		time: Date | null;
		tz: string | null;
	};
	gps: {
		lat: number;
		lng: number;
		tz: string | null;
	} | null;
	geo: {
		lat: number;
		lng: number;
		tz: string | null;
	} | null;
}
