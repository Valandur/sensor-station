import { error, fail } from '@sveltejs/kit';

import { wrap } from '$lib/counter';
import type { WidgetActionFailure } from '$lib/models/widget';
import {
	SWISS_POST_SERVICE_TYPE,
	SWISS_POST_WIDGET_ACTIONS,
	type SwissPostWidgetAction,
	type SwissPostWidgetConfig,
	type SwissPostWidgetData
} from '$lib/models/swiss-post';

import { BaseWidget, type WidgetGetDataOptions, type WidgetSetDataOptions } from '../BaseWidget';
import serviceManager from '../services';
import type { SwissPostService } from './service';

export class SwissPostWidget extends BaseWidget<
	SwissPostWidgetAction,
	SwissPostWidgetConfig,
	SwissPostWidgetData
> {
	public static readonly actions = SWISS_POST_WIDGET_ACTIONS;

	protected generateDefaultConfig(): SwissPostWidgetConfig {
		return {
			service: serviceManager.getInstances(SWISS_POST_SERVICE_TYPE)[0]?.name
		};
	}

	public async getData(
		action: SwissPostWidgetAction,
		options: WidgetGetDataOptions
	): Promise<SwissPostWidgetData | null> {
		if (action === 'config') {
			return {
				ts: new Date(),
				name: this.name,
				type: this.type,
				action,
				config: this.config,
				services: serviceManager.getInstances(SWISS_POST_SERVICE_TYPE)
			};
		}

		const service = serviceManager.getByName<SwissPostService>(this.config.service);

		const data = await service.getData('', options);
		if (!data || data.action !== '') {
			error(400, { key: 'post.noData', message: 'No post data available' });
		}

		let page = Number(options.url.searchParams.get('page'));
		if (!isFinite(page)) {
			page = 0;
		}
		const [[shipment], prevPage, nextPage] = wrap(data.shipments.length, page, 1, data.shipments);

		return {
			ts: new Date(),
			name: this.name,
			type: this.type,
			action,
			shipment
		};
	}

	public async setData(
		action: SwissPostWidgetAction,
		{ form }: WidgetSetDataOptions
	): Promise<void | WidgetActionFailure> {
		if (action !== 'config') {
			error(400, { key: 'post.action.invalid', message: 'Invalid post action' });
		}

		const service = form.get('service');
		if (typeof service !== 'string') {
			return fail(400, {
				key: 'post.service.invalid',
				message: 'Invalid post widget service'
			});
		}

		// Try to get the service to validate it exists
		serviceManager.getByName(service);

		this.config.service = service;
	}
}
