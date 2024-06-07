import type { SvelteComponent } from 'svelte';

import type { WidgetConfig } from './models/widget';
import type { ServiceInstance } from './models/service';
import { CALENDAR_WIDGET_TYPE } from './models/calendar';
import { WEATHER_WIDGET_TYPE } from './models/weather';
import { EPIC_GAMES_WIDGET_TYPE } from './models/epic-games';
import { PRUSA_WIDGET_TYPE } from './models/prusa';
import { TUYA_WIDGET_TYPE } from './models/tuya';
import { SRF_WIDGET_TYPE } from './models/srf';
import CalendarWidgetConfig from './components/calendar/WidgetConfig.svelte';
import CalendarWidgetMain from './components/calendar/WidgetMain.svelte';
import WeatherWidgetConfig from './components/weather/WidgetConfig.svelte';
import WeatherWidgetMain from './components/weather/WidgetMain.svelte';
import EpicGamesWidgetMain from './components/epic-games/WidgetMain.svelte';
import EpicGamesWidgetConfig from './components/epic-games/WidgetConfig.svelte';
import PrusaWidgetMain from './components/prusa/WidgetMain.svelte';
import PrusaWidgetConfig from './components/prusa/WidgetConfig.svelte';
import TuyaWidgetMain from './components/tuya/WidgetMain.svelte';
import TuyaWidgetConfig from './components/tuya/WidgetConfig.svelte';
import SrfWidgetMain from './components/srf/WidgetMain.svelte';
import SrfWidgetConfig from './components/srf/WidgetConfig.svelte';

type WidgetMap = {
	[key: string]: {
		main: typeof SvelteComponent<any>;
		config?: typeof SvelteComponent<{
			name: string;
			config: WidgetConfig;
			services: ServiceInstance[];
		}>;
		action?: typeof SvelteComponent<{
			name: string;
			action: string;
		}>;
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
	},
	[EPIC_GAMES_WIDGET_TYPE]: {
		main: EpicGamesWidgetMain,
		config: EpicGamesWidgetConfig
	},
	[PRUSA_WIDGET_TYPE]: {
		main: PrusaWidgetMain,
		config: PrusaWidgetConfig
	},
	[TUYA_WIDGET_TYPE]: {
		main: TuyaWidgetMain,
		config: TuyaWidgetConfig
	},
	[SRF_WIDGET_TYPE]: {
		main: SrfWidgetMain,
		config: SrfWidgetConfig
	}
};
