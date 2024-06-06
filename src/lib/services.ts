import type { SvelteComponent } from 'svelte';

import { CALENDAR_SERVICE_TYPE } from './models/calendar';
import { WEATHER_SERVICE_TYPE } from './models/weather';
import type { ServiceConfig } from './models/service';
import CalendarServiceConfig from './components/calendar/ServiceConfig.svelte';
import WeatherServiceConfig from './components/weather/ServiceConfig.svelte';

type ServiceMap = {
	[key: string]: { config: typeof SvelteComponent<{ name: string; config: ServiceConfig }> | null };
};

export const SERVICES: ServiceMap = {
	[CALENDAR_SERVICE_TYPE]: {
		config: CalendarServiceConfig
	},
	[WEATHER_SERVICE_TYPE]: {
		config: WeatherServiceConfig
	}
};
