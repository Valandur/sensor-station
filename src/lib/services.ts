import type { Component } from 'svelte';

import { CAROUSEL_SERVICE_TYPE } from './models/carousel';
import { CALENDAR_SERVICE_TYPE } from './models/calendar';
import { EPIC_GAMES_SERVICE_TYPE } from './models/epic-games';
import { WEATHER_SERVICE_TYPE } from './models/weather';

import Carousel from './components/carousel/service.svelte';
import Calendar from './components/calendar/service.svelte';
import EpicGames from './components/epic-games/service.svelte';
import Weather from './components/weather/service.svelte';

type ServiceMap = {
	[key: string]: Component<{
		name: string;
		action: string;
		isEmbedded: boolean;
	}>;
};

export const SERVICES: ServiceMap = {
	[CAROUSEL_SERVICE_TYPE]: Carousel,
	[CALENDAR_SERVICE_TYPE]: Calendar,
	[EPIC_GAMES_SERVICE_TYPE]: EpicGames,
	[WEATHER_SERVICE_TYPE]: Weather
};
