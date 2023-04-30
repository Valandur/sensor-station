export interface ModemInfo {
	ts: Date;
	cached: boolean;
	isConnected: boolean;
	operator: string | null;
	signal: number | null;
	time: Date | null;
	tzOffset: string | null;
	lat: number | null;
	lng: number | null;
	tzName: string | null;
}
