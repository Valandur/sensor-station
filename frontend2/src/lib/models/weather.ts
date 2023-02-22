export type RawWeatherData = {
	forecasts: {
		ts: string;
		img: string;
		feelsLike: number;
	}[];
	alerts: {
		sender: string;
		event: string;
		start: string;
		end: string;
		description: string;
		tags: string[];
	}[];
	temp: number;
	rh: number;
};

export interface WeatherItem {
	ts: Date;
	img: string;
	feelsLike: number;
}

export interface WeatherAlert {
	sender: string;
	event: string;
	start: Date;
	end: Date;
	description: string;
	tags: string[];
}
