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

export interface WeatherDaily {
	weather: {
		daily: WeatherForecast[] | null;
	};
}
export const WEATHER_DAILY = gql`
	fragment WeatherDaily on Query {
		weather {
			daily {
				ts
				img
				feelsLike
			}
		}
	}
`;

export interface WeatherHourly {
	weather: {
		hourly: WeatherForecast[] | null;
	};
}
export const WEATHER_HOURLY = gql`
	fragment WeatherHourly on Query {
		weather {
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
