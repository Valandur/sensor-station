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
	content: string;
	tags: string[];
}

export interface WeatherForecasts {
	weather: {
		daily: WeatherForecast[] | null;
		hourly: WeatherForecast[] | null;
	};
}
export const WEATHER_FORECASTS = gql`
	fragment WeatherForecasts on Query {
		weather {
			daily {
				ts
				img
				feelsLike
			}
			hourly {
				ts
				img
				feelsLike
			}
		}
	}
`;

export interface WeatherAlerts {
	weather: {
		alerts: WeatherAlert[] | null;
	};
}
export const WEATHER_ALERTS = gql`
	fragment WeatherAlerts on Query {
		weather {
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
