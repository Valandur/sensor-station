import { error } from '@sveltejs/kit';

import { wrap } from '$lib/counter';
import {
	SBB_ALERTS_WIDGET_TYPE,
	type SbbAlertsWidgetConfig,
	type SbbAlertsWidgetInstance,
	type SbbAlertsWidgetProps
} from '$lib/models/sbb-alerts';

import { BaseWidget, type WidgetValidateFailure } from '../BaseWidget';
import service from './service';

class SbbAlertsWidget extends BaseWidget<SbbAlertsWidgetConfig, SbbAlertsWidgetProps> {
	public override readonly type = SBB_ALERTS_WIDGET_TYPE;

	public constructor() {
		super('SBB_ALERTS');
	}

	public async props(
		{ name, config }: SbbAlertsWidgetInstance,
		page: number
	): Promise<SbbAlertsWidgetProps | null> {
		if (!config.serviceName) {
			error(400, {
				key: 'sbb_alerts.widget.config',
				message: 'Invalid sbb alerts widget config'
			});
		}

		const data = await service.getByName(config.serviceName);
		if (data.alerts.length === 0) {
			return null;
		}

		const [[alert]] = wrap(data.alerts.length, page, 1, data.alerts);

		return {
			name,
			alert
		};
	}

	public async validate(
		instance: SbbAlertsWidgetInstance,
		config: FormData
	): Promise<SbbAlertsWidgetConfig | WidgetValidateFailure> {
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

export default new SbbAlertsWidget();
