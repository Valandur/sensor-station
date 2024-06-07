import type { SvelteComponent } from 'svelte';

import type { ServiceConfig } from './models/service';
import { CALENDAR_SERVICE_TYPE } from './models/calendar';
import { WEATHER_SERVICE_TYPE } from './models/weather';
import { PRUSA_SERVICE_TYPE } from './models/prusa';
import { TUYA_SERVICE_TYPE } from './models/tuya';
import { SRF_SERVICE_TYPE } from './models/srf';

import CalendarServiceConfig from './components/calendar/ServiceConfig.svelte';
import WeatherServiceConfig from './components/weather/ServiceConfig.svelte';
import PrusaServiceConfig from './components/prusa/ServiceConfig.svelte';
import TuyaServiceConfig from './components/tuya/ServiceConfig.svelte';
import SrfServiceConfig from './components/srf/ServiceConfig.svelte';

type ServiceMap = {
	[key: string]: {
		config: typeof SvelteComponent<{ name: string; config: ServiceConfig }>;
		action?: typeof SvelteComponent<{ name: string; action: string }>;
	};
};

export const SERVICES: ServiceMap = {
	[CALENDAR_SERVICE_TYPE]: {
		config: CalendarServiceConfig
	},
	[WEATHER_SERVICE_TYPE]: {
		config: WeatherServiceConfig
	},
	[PRUSA_SERVICE_TYPE]: {
		config: PrusaServiceConfig
	},
	[TUYA_SERVICE_TYPE]: {
		config: TuyaServiceConfig
	},
	[SRF_SERVICE_TYPE]: {
		config: SrfServiceConfig
	}
};
