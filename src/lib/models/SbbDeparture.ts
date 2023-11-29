export interface SbbDeparture {
	scheduled: Date;
	estimated: Date;
	delay: number;
	destination: string;
	lineName: string;
}
