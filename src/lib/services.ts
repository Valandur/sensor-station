import type { SvelteComponent } from 'svelte';

import type { ServiceData } from './models/service';
import { CALENDAR_SERVICE_TYPE } from './models/calendar';
import { CAROUSEL_SERVICE_TYPE } from './models/carousel';
import { EPIC_GAMES_SERVICE_TYPE } from './models/epic-games';

import CalendarService from './components/calendar/Service.svelte';
import CarouselService from './components/carousel/Service.svelte';
import EpicGamesService from './components/epic-games/Service.svelte';

type ServiceMap = {
	[key: string]: typeof SvelteComponent<{
		name: string;
		data: ServiceData | null;
		form: Record<string, any> | null;
	}>;
};

export const SERVICES: ServiceMap = {
	[CALENDAR_SERVICE_TYPE]: CalendarService,
	[CAROUSEL_SERVICE_TYPE]: CarouselService,
	[EPIC_GAMES_SERVICE_TYPE]: EpicGamesService
};
