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
	gps: ModemLocation | null;
	geo: ModemLocation | null;
}

export interface ModemLocation {
	lat: number;
	lng: number;
	tz: string | null;
}
