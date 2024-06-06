import { CALENDAR_WIDGET_TYPE } from './models/calendar';
import { WEATHER_WIDGET_TYPE } from './models/weather';

import CalendarMainComp from './components/calendar/Main.svelte';
import CalendarConfigComp from './components/calendar/Config.svelte';
import WeatherMainComp from './components/weather/Main.svelte';
import WeatherConfigComp from './components/weather/Config.svelte';

export const WIDGETS = {
	[CALENDAR_WIDGET_TYPE]: {
		main: CalendarMainComp,
		config: CalendarConfigComp
	},
	[WEATHER_WIDGET_TYPE]: {
		main: WeatherMainComp,
		config: WeatherConfigComp
	}
};
