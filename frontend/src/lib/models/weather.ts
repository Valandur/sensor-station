import { gql } from '@urql/svelte';

export interface Weather {
	hourly: WeatherForecast[] | null;
	daily: WeatherForecast[] | null;
	alerts: WeatherAlert[] | null;
}

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
	content: string;
	tags: string[];
}

export interface GetWeatherData {
	weather: Weather;
}
export const GET_WEATHER = gql`
	query GetWeather {
		weather {
			hourly {
				ts
				img
				feelsLike
			}
			daily {
				ts
				img
				feelsLike
			}
			alerts {
				sender
				event
				start
				end
				content
				tags
			}
		}
	}
`;
