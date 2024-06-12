import { error, fail } from '@sveltejs/kit';

import { wrap } from '$lib/counter';
import type { WidgetActionFailure } from '$lib/models/widget';
import {
	SRF_SERVICE_TYPE,
	SRF_WIDGET_ACTIONS,
	type SrfWidgetAction,
	type SrfWidgetConfig,
	type SrfWidgetData
} from '$lib/models/srf';

import { BaseWidget, type WidgetGetDataOptions, type WidgetSetDataOptions } from '../BaseWidget';
import serviceManager from '../services';
import type { SrfService } from './service';

export class SrfWidget extends BaseWidget<SrfWidgetAction, SrfWidgetConfig, SrfWidgetData> {
	public static readonly actions = SRF_WIDGET_ACTIONS;

	protected generateDefaultConfig(): SrfWidgetConfig {
		return {
			service: serviceManager.getInstances(SRF_SERVICE_TYPE)[0]?.name ?? '',
			itemsPerPage: 3
		};
	}

	public async getData(
		action: SrfWidgetAction,
		options: WidgetGetDataOptions
	): Promise<SrfWidgetData | null> {
		if (action === 'config') {
			return {
				ts: new Date(),
				name: this.name,
				type: this.type,
				action,
				config: this.config,
				services: serviceManager.getInstances(SRF_SERVICE_TYPE)
			};
		}

		const service = serviceManager.getByName<SrfService>(this.config.service);

		if (action === 'details') {
			const data = await service.getData('details', options);
			if (!data || data.action !== 'details') {
				error(400, { key: 'srf.widget.noData', message: 'No SRF data available' });
			}

			return {
				ts: new Date(),
				name: this.name,
				type: this.type,
				action,
				simple: data.simple,
				head: data.head,
				body: data.body
			};
		}

		const data = await service.getData('', options);
		if (!data || data.action !== '') {
			error(400, { key: 'srf.widget.noData', message: 'No SRF data available' });
		}

		let page = Number(options.url.searchParams.get('page'));
		if (!isFinite(page)) {
			page = 0;
		}
		const [items, prevPage, nextPage] = wrap(
			data.items.length,
			page,
			this.config.itemsPerPage,
			data.items
		);

		return {
			ts: new Date(),
			name: this.name,
			type: this.type,
			action,
			items
		};
	}

	public async setData(
		action: SrfWidgetAction,
		{ form }: WidgetSetDataOptions
	): Promise<void | WidgetActionFailure> {
		if (action !== 'config') {
			error(400, { key: 'srf.action.invalid', message: 'Invalid SRF action' });
		}

		const service = form.get('service');
		if (typeof service !== 'string') {
			return fail(400, {
				key: 'srf.service.invalid',
				message: 'Invalid SRF widget service'
			});
		}

		// Try to get the service to validate it exists
		serviceManager.getByName(service);

		const itemsPerPage = Number(form.get('itemsPerPage'));
		if (!isFinite(itemsPerPage)) {
			return fail(400, {
				key: 'srf.itemsPerPage.invalid',
				message: 'Invalid number of items per page'
			});
		}

		this.config.service = service;
		this.config.itemsPerPage = itemsPerPage;
	}
}
