import type { WeatherPlace } from './WeatherPlace';

export interface WeatherLocation {
	lat: number;
	lng: number;
	place?: WeatherPlace;
}
