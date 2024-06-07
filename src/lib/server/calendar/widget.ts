import { error } from '@sveltejs/kit';

import { CounterType, fit, slice } from '$lib/counter';
import {
	CALENDAR_WIDGET_TYPE,
	type CalendarWidgetConfig,
	type CalendarWidgetProps
} from '$lib/models/calendar';

import { BaseWidget, type WidgetValidateFailure } from '../BaseWidget';
import service from './service';

const ITEMS_PER_PAGE = 6;

class CalendarWidget extends BaseWidget<CalendarWidgetConfig, CalendarWidgetProps> {
	public override readonly type = CALENDAR_WIDGET_TYPE;

	public constructor() {
		super('CALENDAR');
	}

	public async props(config: CalendarWidgetConfig, page: number): Promise<CalendarWidgetProps> {
		if (!config.serviceName) {
			error(400, { key: 'calendar.widget.config', message: 'Invalid calendar widget config' });
		}

		const data = await service.getByName(config.serviceName);
		const events = slice(CounterType.Clamp, data.events.length, page, ITEMS_PER_PAGE, data.events);
		const prevPage = page > 0 ? page - 1 : 0;
		const nextPage = fit(CounterType.Clamp, data.events.length, page + 1, ITEMS_PER_PAGE);
		return {
			prevPage,
			nextPage,
			events
		};
	}

	public async validate(config: FormData): Promise<CalendarWidgetConfig | WidgetValidateFailure> {
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

export default new CalendarWidget();
