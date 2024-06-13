import type { SvelteComponent } from 'svelte';

import type { WidgetData } from './models/widget';
import { CALENDAR_WIDGET_TYPE } from './models/calendar';
import { EPIC_GAMES_WIDGET_TYPE } from './models/epic-games';
import { GALLERY_WIDGET_TYPE } from './models/gallery';
import { SBB_ALERTS_WIDGET_TYPE } from './models/sbb-alerts';
import { SBB_DEPARTURES_WIDGET_TYPE } from './models/sbb-departures';
import { SRF_WIDGET_TYPE } from './models/srf';
import { SWISS_POST_WIDGET_TYPE } from './models/swiss-post';

import CalendarWidget from './components/calendar/Widget.svelte';
import EpicGamesWidget from './components/epic-games/Widget.svelte';
import GalleryWidget from './components/gallery/Widget.svelte';
import SbbAlertsWidget from './components/sbb-alerts/Widget.svelte';
import SbbDeparturesWidget from './components/sbb-departures/Widget.svelte';
import SrfWidget from './components/srf/Widget.svelte';
import SwissPostWidget from './components/swiss-post/Widget.svelte';

type WidgetMap = {
	[key: string]: typeof SvelteComponent<{
		name: string;
		data: WidgetData | null;
		form: Record<string, any> | null;
		isEmbedded?: boolean;
	}>;
};

export const WIDGETS: WidgetMap = {
	[CALENDAR_WIDGET_TYPE]: CalendarWidget,
	[EPIC_GAMES_WIDGET_TYPE]: EpicGamesWidget,
	[GALLERY_WIDGET_TYPE]: GalleryWidget,
	[SBB_ALERTS_WIDGET_TYPE]: SbbAlertsWidget,
	[SBB_DEPARTURES_WIDGET_TYPE]: SbbDeparturesWidget,
	[SRF_WIDGET_TYPE]: SrfWidget,
	[SWISS_POST_WIDGET_TYPE]: SwissPostWidget
};
