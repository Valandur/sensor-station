import { error, fail } from '@sveltejs/kit';

import { clamp } from '$lib/counter';
import type { WidgetActionFailure } from '$lib/models/widget';
import {
	SBB_DEPARTURES_SERVICE_TYPE,
	SBB_DEPARTURES_WIDGET_ACTIONS,
	type SbbDeparturesWidgetConfig,
	type SbbDeparturesWidgetData,
	type SbbDeparturesWidgetAction
} from '$lib/models/sbb-departures';

import { BaseWidget, type WidgetGetDataOptions, type WidgetSetDataOptions } from '../BaseWidget';
import serviceManager from '../services';
import type { SbbDeparturesService } from './service';

export class SbbDeparturesWidget extends BaseWidget<
	SbbDeparturesWidgetAction,
	SbbDeparturesWidgetConfig,
	SbbDeparturesWidgetData
> {
	public static readonly actions = SBB_DEPARTURES_WIDGET_ACTIONS;

	protected generateDefaultConfig(): SbbDeparturesWidgetConfig {
		return {
			service: serviceManager.getInstances(SBB_DEPARTURES_SERVICE_TYPE)[0]?.name ?? '',
			itemsPerPage: 6
		};
	}

	public async getData(
		action: SbbDeparturesWidgetAction,
		options: WidgetGetDataOptions
	): Promise<SbbDeparturesWidgetData> {
		if (action === 'config') {
			return {
				ts: new Date(),
				name: this.name,
				type: this.type,
				action,
				config: this.config,
				services: serviceManager.getInstances(SBB_DEPARTURES_SERVICE_TYPE)
			};
		}

		const service = serviceManager.getByName<SbbDeparturesService>(this.config.service);

		const data = await service.getData('', options);
		if (!data || data.action !== '') {
			error(400, { key: 'sbbDepartures.noData', message: 'No SBB departures data available' });
		}

		let page = Number(options.url.searchParams.get('page'));
		if (!isFinite(page)) {
			page = 0;
		}
		const [departures, prevPage, nextPage] = clamp(
			data.departures.length,
			page,
			this.config.itemsPerPage,
			data.departures
		);

		return {
			ts: new Date(),
			name: this.name,
			type: this.type,
			action,
			departures
		};
	}

	public async setData(
		action: SbbDeparturesWidgetAction,
		{ form }: WidgetSetDataOptions
	): Promise<void | WidgetActionFailure> {
		if (action !== 'config') {
			error(400, { key: 'sbbDepartures.action.invalid', message: 'Invalid SBB departures action' });
		}

		const service = form.get('service');
		if (typeof service !== 'string') {
			return fail(400, {
				key: 'sbbDepartures.service.invalid',
				message: 'Invalid SBB departures widget service'
			});
		}

		// Try to get the service to validate it exists
		serviceManager.getByName(service);

		const itemsPerPage = Number(form.get('itemsPerPage'));
		if (!isFinite(itemsPerPage)) {
			return fail(400, {
				key: 'sbbDepartures.itemsPerPage.invalid',
				message: 'Invalid number of items per page'
			});
		}

		this.config.service = service;
		this.config.itemsPerPage = itemsPerPage;
	}
}
