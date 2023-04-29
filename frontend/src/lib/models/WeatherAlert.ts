export interface WeatherAlert {
	sender: string;
	event: string;
	start: Date;
	end: Date;
	content: string;
	tags: string[];
}
