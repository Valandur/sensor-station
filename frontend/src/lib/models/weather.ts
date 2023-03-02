import { gql } from '@urql/svelte';

export interface WeatherForecast {
	ts: string;
	img: string;
	feelsLike: number;
}

export interface WeatherAlert {
	sender: string;
	event: string;
	start: string;
	end: string;
	description: string;
	tags: string[];
}

export interface GetWeatherData {
	forecasts: WeatherForecast[];
	alerts: WeatherAlert[];
	sensors: {
		ts: string;
		temp: number;
		rh: number;
	};
}
export const GET_WEATHER = gql`
	query GetWeather {
		forecasts {
			ts
			img
			feelsLike
		}
		alerts {
			sender
			event
			start
			end
			description
			tags
		}
		sensors {
			ts
			temp
			rh
		}
	}
`;
