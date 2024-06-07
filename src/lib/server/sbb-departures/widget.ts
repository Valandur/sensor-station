import { error } from '@sveltejs/kit';

import { clamp } from '$lib/counter';
import {
	SBB_DEPARTURES_WIDGET_TYPE,
	type SbbDeparturesWidgetConfig,
	type SbbDeparturesWidgetInstance,
	type SbbDeparturesWidgetProps
} from '$lib/models/sbb-departures';

import { BaseWidget, type WidgetValidateFailure } from '../BaseWidget';
import service from './service';

const ITEMS_PER_PAGE = 6;

class SbbDeparturesWidget extends BaseWidget<SbbDeparturesWidgetConfig, SbbDeparturesWidgetProps> {
	public override readonly type = SBB_DEPARTURES_WIDGET_TYPE;

	public constructor() {
		super('SBB_DEPARTURES');
	}

	public async props(
		{ name, config }: SbbDeparturesWidgetInstance,
		page: number
	): Promise<SbbDeparturesWidgetProps> {
		if (!config.serviceName) {
			error(400, {
				key: 'sbb_departures.widget.config',
				message: 'Invalid sbb departures widget config'
			});
		}

		const data = await service.getByName(config.serviceName);
		const [departures, prevPage, nextPage] = clamp(
			data.departures.length,
			page,
			ITEMS_PER_PAGE,
			data.departures
		);

		return {
			name,
			prevPage,
			nextPage,
			departures
		};
	}

	public async validate(
		instance: SbbDeparturesWidgetInstance,
		config: FormData
	): Promise<SbbDeparturesWidgetConfig | WidgetValidateFailure> {
		const serviceName = config.get('serviceName');
		if (typeof serviceName !== 'string') {
			throw new Error('Invalid service name');
		}
		const serviceInstance = this.services.byName(serviceName, true);
		if (serviceInstance.type !== service.type) {
			throw new Error('Invalid service type');
		}

		return {
			serviceName
		};
	}
}

export default new SbbDeparturesWidget();
