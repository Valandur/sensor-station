import type { BaseData } from './BaseData';
import type { SbbAlert } from './SbbAlert';

export interface SbbData extends BaseData {
	alerts: SbbAlert[];
}
