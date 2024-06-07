import { error } from '@sveltejs/kit';

import {
	TUYA_WIDGET_TYPE,
	type TuyaWidgetConfig,
	type TuyaWidgetInstance,
	type TuyaWidgetProps
} from '$lib/models/tuya';

import { BaseWidget, type WidgetValidateFailure } from '../BaseWidget';
import service from './service';

class TuyaWidget extends BaseWidget<TuyaWidgetConfig, TuyaWidgetProps> {
	public override readonly type = TUYA_WIDGET_TYPE;

	public constructor() {
		super('TUYA');
	}

	public async props({ name, config }: TuyaWidgetInstance, page: number): Promise<TuyaWidgetProps> {
		if (!config.serviceName) {
			error(400, { key: 'tuya.widget.config', message: 'Invalid tuya widget config' });
		}

		const data = await service.getByName(config.serviceName);
		return {
			name,
			info: data.info
		};
	}

	public async validate(
		instance: TuyaWidgetInstance,
		config: FormData
	): Promise<TuyaWidgetConfig | WidgetValidateFailure> {
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

export default new TuyaWidget();
