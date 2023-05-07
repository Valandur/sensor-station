export interface ModemInfo {
	ts: Date;
	isConnected: boolean;
	operator: string | null;
	signal: number | null;
	time: Date | null;
	timeTz: string | null;
	lat: number | null;
	lng: number | null;
	gpsTz: string | null;
}
