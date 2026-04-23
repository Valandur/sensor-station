import type { Component } from 'svelte';

import { CAROUSEL_SERVICE_TYPE } from './models/carousel';
import { CALENDAR_SERVICE_TYPE } from './models/calendar';
import { EPIC_GAMES_SERVICE_TYPE } from './models/epic-games';
import { GALLERY_SERVICE_TYPE } from './models/gallery';
import { PRUSA_SERVICE_TYPE } from './models/prusa';
import { SRF_SERVICE_TYPE } from './models/srf';
import { WEATHER_SERVICE_TYPE } from './models/weather';

import Carousel from './components/carousel/service.svelte';
import Calendar from './components/calendar/service.svelte';
import EpicGames from './components/epic-games/service.svelte';
import Gallery from './components/gallery/service.svelte';
import Prusa from './components/prusa/service.svelte';
import Srf from './components/srf/service.svelte';
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
	[GALLERY_SERVICE_TYPE]: Gallery,
	[PRUSA_SERVICE_TYPE]: Prusa,
	[SRF_SERVICE_TYPE]: Srf,
	[WEATHER_SERVICE_TYPE]: Weather
};
