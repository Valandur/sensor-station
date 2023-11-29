import type { BaseData } from './BaseData';
import type { SbbAlert } from './SbbAlert';
import type { SbbDeparture } from './SbbDeparture';

export interface SbbData extends BaseData {
	alerts: SbbAlert[];
	departures: SbbDeparture[];
}
