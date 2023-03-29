import type { ComponentType } from 'svelte';

import Calendar, { calendarMeta } from '$lib/components/calendar.svelte';
import Games, { gamesMeta } from '$lib/components/games.svelte';
import News, { newsMeta } from '$lib/components/news.svelte';
import Uploads, { uploadsMeta } from '$lib/components/uploads.svelte';
import Weather, { weatherMeta } from '$lib/components/weather.svelte';
import Sbb, { sbbMeta } from '$lib/components/sbb.svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ComponentMeta<T = any> {
	getData: (params: string) => Promise<T | null>;
	skip?: (params: string, data: T | null) => Promise<boolean>;
}

export type ComponentMap = { [key: string]: [ComponentType, ComponentMeta] };

export const COMPONENT_MAP: ComponentMap = {
	calendar: [Calendar, calendarMeta],
	games: [Games, gamesMeta],
	news: [News, newsMeta],
	sbb: [Sbb, sbbMeta],
	uploads: [Uploads, uploadsMeta],
	weather: [Weather, weatherMeta]
};
