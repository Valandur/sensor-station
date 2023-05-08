import type { BaseData } from './BaseData';
import type { WeatherAlert } from './WeatherAlert';
import type { WeatherForecast } from './WeatherForecast';
import type { WeatherLocation } from './WeatherLocation';

export interface WeatherData extends BaseData {
	location: WeatherLocation;
	alerts: WeatherAlert[];
	hourly: WeatherForecast[];
	daily: WeatherForecast[];
}
