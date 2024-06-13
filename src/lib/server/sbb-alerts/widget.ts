import { error, fail } from '@sveltejs/kit';

import { wrap } from '$lib/counter';
import type { WidgetActionFailure } from '$lib/models/widget';
import {
	SBB_ALERTS_SERVICE_TYPE,
	SBB_ALERTS_WIDGET_ACTIONS,
	type SbbAlertsWidgetAction,
	type SbbAlertsWidgetConfig,
	type SbbAlertsWidgetData
} from '$lib/models/sbb-alerts';

import { BaseWidget, type WidgetGetDataOptions, type WidgetSetDataOptions } from '../BaseWidget';
import serviceManager from '../services';
import type { SbbAlertsService } from './service';

export class SbbAlertsWidget extends BaseWidget<
	SbbAlertsWidgetAction,
	SbbAlertsWidgetConfig,
	SbbAlertsWidgetData
> {
	public static readonly actions = SBB_ALERTS_WIDGET_ACTIONS;

	protected generateDefaultConfig(): SbbAlertsWidgetConfig {
		return {
			service: serviceManager.getInstances(SBB_ALERTS_SERVICE_TYPE)[0]?.name ?? ''
		};
	}

	public async getData(
		action: SbbAlertsWidgetAction,
		options: WidgetGetDataOptions
	): Promise<SbbAlertsWidgetData | null> {
		if (action === 'config') {
			return {
				ts: new Date(),
				name: this.name,
				type: this.type,
				action,
				config: this.config,
				services: serviceManager.getInstances(SBB_ALERTS_SERVICE_TYPE)
			};
		}

		const service = serviceManager.getByName<SbbAlertsService>(this.config.service);

		const data = await service.getData('', options);
		if (!data || data.action !== '') {
			error(400, { key: 'sbbDepartures.noData', message: 'No SBB departures data available' });
		}

		let page = Number(options.url.searchParams.get('page'));
		if (!isFinite(page)) {
			page = 0;
		}
		const [[alert], prevPage, nextPage] = wrap(data.alerts.length, page, 1, data.alerts);

		return {
			ts: new Date(),
			name: this.name,
			type: this.type,
			action,
			alert
		};
	}

	public async setData(
		action: SbbAlertsWidgetAction,
		{ form }: WidgetSetDataOptions
	): Promise<void | WidgetActionFailure> {
		if (action !== 'config') {
			error(400, { key: 'sbbAlerts.action.invalid', message: 'Invalid SBB alerts action' });
		}

		const service = form.get('service');
		if (typeof service !== 'string') {
			return fail(400, {
				key: 'sbbAlerts.service.invalid',
				message: 'Invalid SBB alerts widget service'
			});
		}

		// Try to get the service to validate it exists
		serviceManager.getByName(service);

		this.config.service = service;
	}
}
