import { error } from '@sveltejs/kit';

import { wrap } from '$lib/counter';
import {
	SRF_WIDGET_TYPE,
	type SrfWidgetAction,
	type SrfWidgetConfig,
	type SrfWidgetInstance,
	type SrfWidgetProps
} from '$lib/models/srf';

import { BaseWidget, type WidgetValidateFailure } from '../BaseWidget';
import service from './service';

const ITEMS_PER_PAGE = 3;

class SrfWidget extends BaseWidget<SrfWidgetConfig, SrfWidgetProps, SrfWidgetAction> {
	public override readonly type = SRF_WIDGET_TYPE;

	public constructor() {
		super('EPIC_GAMES');
	}

	public async props({ name, config }: SrfWidgetInstance, page: number): Promise<SrfWidgetProps> {
		if (!config.serviceName) {
			error(400, { key: 'srf.widget.config', message: 'Invalid srf widget config' });
		}

		const data = await service.getByName(config.serviceName);
		const [items, prevPage, nextPage] = wrap(data.items.length, page, ITEMS_PER_PAGE, data.items);
		return {
			name,
			prevPage,
			nextPage,
			feedId: data.feedId,
			items
		};
	}

	public async validate(
		instance: SrfWidgetInstance,
		config: FormData
	): Promise<SrfWidgetConfig | WidgetValidateFailure> {
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

	public override async action(
		{ name, config }: SrfWidgetInstance,
		action: string
	): Promise<SrfWidgetAction | null> {
		if (!config.serviceName) {
			error(400, { key: 'srf.widget.config', message: 'Invalid srf widget config' });
		}

		const data = await service.actionByName(config.serviceName, action);
		if (!data) {
			error(404, {
				key: 'srf.widget.action.noData',
				message: `Service ${config.serviceName} returned no data for ${action}`
			});
		}

		return {
			name,
			simple: data.simple,
			head: data.head,
			body: data.body
		};
	}
}

export default new SrfWidget();
