import type { SvelteComponent } from 'svelte';

import type { ServiceConfig } from './models/service';
import { CALENDAR_SERVICE_TYPE } from './models/calendar';
import { WEATHER_SERVICE_TYPE } from './models/weather';
import { EPIC_GAMES_SERVICE_TYPE } from './models/epic-games';
import { NETWORK_SERVICE_TYPE } from './models/network';
import { PRUSA_SERVICE_TYPE } from './models/prusa';

import CalendarServiceConfig from './components/calendar/ServiceConfig.svelte';
import WeatherServiceConfig from './components/weather/ServiceConfig.svelte';
import PrusaServiceConfig from './components/prusa/ServiceConfig.svelte';

type ServiceMap = {
	[key: string]: { config: typeof SvelteComponent<{ name: string; config: ServiceConfig }> | null };
};

export const SERVICES: ServiceMap = {
	[CALENDAR_SERVICE_TYPE]: {
		config: CalendarServiceConfig
	},
	[WEATHER_SERVICE_TYPE]: {
		config: WeatherServiceConfig
	},
	[EPIC_GAMES_SERVICE_TYPE]: {
		config: null
	},
	[NETWORK_SERVICE_TYPE]: {
		config: null
	},
	[PRUSA_SERVICE_TYPE]: {
		config: PrusaServiceConfig
	}
};
