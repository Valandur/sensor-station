import type { SvelteComponent } from 'svelte';

import type { ServiceData } from './models/service';
import { BATTERY_SERVICE_TYPE } from './models/battery';
import { CALENDAR_SERVICE_TYPE } from './models/calendar';
import { CAROUSEL_SERVICE_TYPE } from './models/carousel';
import { EPIC_GAMES_SERVICE_TYPE } from './models/epic-games';
import { GALLERY_SERVICE_TYPE } from './models/gallery';
import { HOLIDAY_SERVICE_TYPE } from './models/holiday';
import { MODEM_SERVICE_TYPE } from './models/modem';
import { NETWORK_SERVICE_TYPE } from './models/network';
import { PRUSA_SERVICE_TYPE } from './models/prusa';
import { SBB_ALERTS_SERVICE_TYPE } from './models/sbb-alerts';
import { SBB_DEPARTURES_SERVICE_TYPE } from './models/sbb-departures';
import { SRF_SERVICE_TYPE } from './models/srf';
import { SWISS_POST_SERVICE_TYPE } from './models/swiss-post';
import { TUYA_SERVICE_TYPE } from './models/tuya';
import { WEATHER_SERVICE_TYPE } from './models/weather';

import BatteryService from './components/battery/Service.svelte';
import CalendarService from './components/calendar/Service.svelte';
import CarouselService from './components/carousel/Service.svelte';
import EpicGamesService from './components/epic-games/Service.svelte';
import GalleryService from './components/gallery/Service.svelte';
import HolidayService from './components/holiday/Service.svelte';
import ModemService from './components/modem/Service.svelte';
import NetworkService from './components/network/Service.svelte';
import PrusaService from './components/prusa/Service.svelte';
import SbbAlertsService from './components/sbb-alerts/Service.svelte';
import SbbDeparturesService from './components/sbb-departures/Service.svelte';
import SrfService from './components/srf/Service.svelte';
import SwissPostService from './components/swiss-post/Service.svelte';
import TuyaService from './components/tuya/Service.svelte';
import WeatherService from './components/weather/Service.svelte';

type ServiceMap = {
	[key: string]: typeof SvelteComponent<{
		name?: string;
		action?: string;
		data?: ServiceData | null;
		form?: Record<string, any> | null;
		isEmbedded?: boolean;
	}>;
};

export const SERVICES: ServiceMap = {
	[BATTERY_SERVICE_TYPE]: BatteryService,
	[CALENDAR_SERVICE_TYPE]: CalendarService,
	[CAROUSEL_SERVICE_TYPE]: CarouselService,
	[EPIC_GAMES_SERVICE_TYPE]: EpicGamesService,
	[GALLERY_SERVICE_TYPE]: GalleryService,
	[HOLIDAY_SERVICE_TYPE]: HolidayService,
	[MODEM_SERVICE_TYPE]: ModemService,
	[NETWORK_SERVICE_TYPE]: NetworkService,
	[PRUSA_SERVICE_TYPE]: PrusaService,
	[SBB_ALERTS_SERVICE_TYPE]: SbbAlertsService,
	[SBB_DEPARTURES_SERVICE_TYPE]: SbbDeparturesService,
	[SRF_SERVICE_TYPE]: SrfService,
	[SWISS_POST_SERVICE_TYPE]: SwissPostService,
	[TUYA_SERVICE_TYPE]: TuyaService,
	[WEATHER_SERVICE_TYPE]: WeatherService
};
