import { error, fail } from '@sveltejs/kit';

import { clamp } from '$lib/counter';
import type { WidgetActionFailure } from '$lib/models/widget';
import {
	CALENDAR_SERVICE_TYPE,
	CALENDAR_WIDGET_ACTIONS,
	type CalendarWidgetAction,
	type CalendarWidgetConfig,
	type CalendarWidgetData
} from '$lib/models/calendar';

import { BaseWidget, type WidgetGetDataOptions, type WidgetSetDataOpations } from '../BaseWidget';
import serviceManager from '../services';
import { CalendarService } from './service';

export class CalendarWidget extends BaseWidget<
	CalendarWidgetAction,
	CalendarWidgetConfig,
	CalendarWidgetData
> {
	public static readonly actions = CALENDAR_WIDGET_ACTIONS;

	protected generateDefaultConfig(): CalendarWidgetConfig {
		return {
			itemsPerPage: 6,
			service: serviceManager.getInstances(CALENDAR_SERVICE_TYPE)[0]?.name ?? ''
		};
	}

	public async getData(
		action: CalendarWidgetAction,
		options: WidgetGetDataOptions
	): Promise<CalendarWidgetData | null> {
		if (action === 'config') {
			return {
				ts: new Date(),
				name: this.name,
				type: this.type,
				action,
				config: this.config,
				services: serviceManager.getInstances(CALENDAR_SERVICE_TYPE)
			};
		}

		const service = serviceManager.getByName<CalendarService>(this.config.service);

		const data = await service.getData('', options);
		if (!data || data.action !== '') {
			error(400, { key: 'calendar.noData', message: 'No calendar data available' });
		}

		let page = Number(options.url.searchParams.get('page'));
		if (!isFinite(page)) {
			page = 0;
		}
		const [events, prevPage, nextPage] = clamp(
			data.events.length,
			page,
			this.config.itemsPerPage,
			data.events
		);

		return {
			ts: new Date(),
			name: this.name,
			type: this.type,
			action,
			events,
			prevPage,
			nextPage
		};
	}

	public async setData(
		action: CalendarWidgetAction,
		{ form }: WidgetSetDataOpations
	): Promise<void | WidgetActionFailure> {
		if (action !== 'config') {
			error(400, { key: 'calendar.action.invalid', message: 'Invalid action' });
		}

		const service = form.get('service');
		if (typeof service !== 'string') {
			return fail(400, {
				key: 'calendar.servie.invalid',
				message: 'Invalid calendar widget service'
			});
		}

		// Try to get the service to validate it exists
		serviceManager.getByName(service);

		const itemsPerPage = Number(form.get('itemsPerPage'));
		if (!isFinite(itemsPerPage)) {
			return fail(400, {
				key: 'calendar.itemsPerPage.invalid',
				message: 'Invalid number of items per page'
			});
		}

		this.config = {
			service,
			itemsPerPage
		};
	}
}
