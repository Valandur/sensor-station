import { error } from '@sveltejs/kit';

import {
	PRUSA_WIDGET_TYPE,
	type PrusaWidgetConfig,
	type PrusaWidgetInstance,
	type PrusaWidgetProps
} from '$lib/models/prusa';

import { BaseWidget, type WidgetValidateFailure } from '../BaseWidget';
import service from './service';

class PrusaWidget extends BaseWidget<PrusaWidgetConfig, PrusaWidgetProps> {
	public override readonly type = PRUSA_WIDGET_TYPE;

	public constructor() {
		super('PRUSA');
	}

	public async props(
		{ name, config }: PrusaWidgetInstance,
		page: number
	): Promise<PrusaWidgetProps | null> {
		if (!config.serviceName) {
			error(400, {
				key: 'prusa.widget.config',
				message: 'Invalid prusa widget config'
			});
		}

		const data = await service.getByName(config.serviceName);

		if (!data.job || !data.job.id) {
			// Skip this widget when we have no job
			return null;
		}

		return {
			name,
			job: data.job,
			printer: data.printer,
			storage: data.storage
		};
	}

	public async validate(
		instance: PrusaWidgetInstance,
		config: FormData
	): Promise<PrusaWidgetConfig | WidgetValidateFailure> {
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

export default new PrusaWidget();
