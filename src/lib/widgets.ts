import type { SvelteComponent } from 'svelte';

import { CALENDAR_WIDGET_TYPE } from './models/calendar';
import { WEATHER_WIDGET_TYPE } from './models/weather';
import type { WidgetConfig } from './models/widget';
import type { ServiceInstance } from './models/service';
import CalendarWidgetConfig from './components/calendar/WidgetConfig.svelte';
import CalendarWidgetMain from './components/calendar/WidgetMain.svelte';
import WeatherWidgetConfig from './components/weather/WidgetConfig.svelte';
import WeatherWidgetMain from './components/weather/WidgetMain.svelte';

type WidgetMap = {
	[key: string]: {
		main: typeof SvelteComponent<any>;
		config:
			| typeof SvelteComponent<{ name: string; config: WidgetConfig; services: ServiceInstance[] }>
			| null;
	};
};

export const WIDGETS: WidgetMap = {
	[CALENDAR_WIDGET_TYPE]: {
		main: CalendarWidgetMain,
		config: CalendarWidgetConfig
	},
	[WEATHER_WIDGET_TYPE]: {
		main: WeatherWidgetMain,
		config: WeatherWidgetConfig
	}
};
