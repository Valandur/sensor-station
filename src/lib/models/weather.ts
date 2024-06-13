import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const WEATHER_SERVICE_TYPE = 'weather';
export const WEATHER_SERVICE_ACTIONS = ['config', 'daily', 'hourly', 'alerts'] as const;

export type WeatherServiceAction = (typeof WEATHER_SERVICE_ACTIONS)[number];

export interface WeatherServiceDailyData extends ServiceData {
	type: 'daily';
	location: WeatherLocation;
	daily: WeatherForecast[];
}
export interface WeatherServiceHourlyData extends ServiceData {
	type: 'hourly';
	location: WeatherLocation;
	hourly: WeatherForecast[];
}
export interface WeatherServiceAlertsData extends ServiceData {
	type: 'alerts';
	location: WeatherLocation;
	alert: WeatherAlert;
}
export interface WeatherServiceConfigData extends ServiceData {
	type: 'config';
	config: WeatherServiceConfig;
}
export type WeatherServiceData =
	| WeatherServiceDailyData
	| WeatherServiceHourlyData
	| WeatherServiceAlertsData
	| WeatherServiceConfigData;

export interface WeatherServiceConfig extends ServiceConfig {
	useGps: boolean;
	useGeo: boolean;
	lat: number;
	lng: number;
	minDiff: number;
	apiKey: string;
	itemsPerPage: number;
}

// ---------
// Others
// ---------

export interface WeatherAlert {
	sender: string;
	event: string;
	start: Date;
	end: Date;
	content: string;
	tags: string[];
}

export interface WeatherForecast {
	ts: Date;
	img: string;
	feelsLike: number;
}

export interface WeatherLocation {
	lat: number;
	lng: number;
	place?: string;
}

export const ICON_MAP: Record<number, string> = {
	200: 'thunderstorm',
	201: 'thunderstorm',
	202: 'thunderstorm',
	210: 'thunderstorm',
	211: 'thunderstorm',
	212: 'thunderstorm',
	221: 'thunderstorm',
	230: 'thunderstorm',
	231: 'thunderstorm',
	232: 'thunderstorm',

	300: 'drizzle',
	301: 'drizzle',
	302: 'drizzle',
	310: 'drizzle',
	311: 'drizzle',
	312: 'drizzle',
	313: 'drizzle',
	314: 'drizzle',
	321: 'drizzle',

	500: 'rain',
	501: 'rain',
	502: 'heavyrain',
	503: 'heavyrain',
	504: 'heavyrain',
	511: 'snow',
	520: 'drizzle',
	521: 'drizzle',
	522: 'drizzle',
	531: 'drizzle',

	600: 'snow',
	601: 'snow',
	602: 'heavysnow',
	611: 'snow',
	612: 'snow',
	613: 'snow',
	615: 'snow',
	616: 'snow',
	620: 'snow',
	621: 'snow',
	622: 'heavysnow',

	701: 'foggy',
	711: 'foggy',
	721: 'foggy',
	731: 'sandstorm',
	741: 'foggy',
	751: 'sand',
	761: 'sand',
	762: 'sand',
	771: 'wind',
	781: 'tornado',

	800: 'clear',

	801: 'clouds',
	802: 'clouds',
	803: 'overcast',
	804: 'overcast'
};
