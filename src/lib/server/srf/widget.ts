import { error } from '@sveltejs/kit';

import { CounterType, fit, slice } from '$lib/counter';
import { SRF_WIDGET_TYPE, type SrfWidgetConfig, type SrfWidgetProps } from '$lib/models/srf';

import { BaseWidget, type WidgetValidateFailure } from '../BaseWidget';
import service from './service';

const ITEMS_PER_PAGE = 3;

class SrfWidget extends BaseWidget<SrfWidgetConfig, SrfWidgetProps> {
	public override readonly type = SRF_WIDGET_TYPE;

	public constructor() {
		super('EPIC_GAMES');
	}

	public async props(name: string, config: SrfWidgetConfig, page: number): Promise<SrfWidgetProps> {
		if (!config.serviceName) {
			error(400, { key: 'srf.widget.config', message: 'Invalid srf widget config' });
		}

		const data = await service.getByName(config.serviceName);
		const items = slice(CounterType.Wrap, data.items.length, page, ITEMS_PER_PAGE, data.items);
		const prevPage = fit(CounterType.Wrap, data.items.length, page - 1, ITEMS_PER_PAGE);
		const nextPage = fit(CounterType.Wrap, data.items.length, page + 1, ITEMS_PER_PAGE);
		return {
			name,
			prevPage,
			nextPage,
			feedId: data.feedId,
			items
		};
	}

	public async validate(
		name: string,
		config: FormData
	): Promise<SrfWidgetConfig | WidgetValidateFailure> {
		const serviceName = config.get('serviceName');
		if (typeof serviceName !== 'string') {
			throw new Error('Invalid service name');
		}
		const instance = this.services.byName(serviceName, true);
		if (instance.type !== service.type) {
			throw new Error('Invalid service type');
		}

		return {
			serviceName
		};
	}
}

export default new SrfWidget();
