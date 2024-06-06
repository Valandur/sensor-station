import { fail } from '@sveltejs/kit';

import { CounterType, slice } from '$lib/counter';
import {
	type WeatherWidgetConfig,
	type WeatherWidgetProps,
	type WeatherWidgetType
} from '$lib/models/weather';

import { BaseWidget, type WidgetValidateFailure } from '../BaseWidget';
import service from './service';

const VALID_TYPES = ['daily', 'hourly', 'alerts'];

class WeatherWidget extends BaseWidget<WeatherWidgetConfig, WeatherWidgetProps> {
	public constructor() {
		super('WEATHER');
	}

	public async props(config: WeatherWidgetConfig, page: number): Promise<WeatherWidgetProps> {
		const data = await service.getByName(config.serviceName);
		const alerts = slice(CounterType.Wrap, data.alerts.length, page, 1, data.alerts);
		return {
			type: config.type,
			location: data.location,
			daily: data.daily,
			hourly: data.hourly,
			alert: alerts[0]
		};
	}

	public async validate(config: FormData): Promise<WeatherWidgetConfig | WidgetValidateFailure> {
		const type = config.get('type');
		if (typeof type !== 'string' || !VALID_TYPES.includes(type)) {
			throw new Error('Invalid type');
		}

		const serviceName = config.get('serviceName');
		if (typeof serviceName !== 'string') {
			return fail(400, { message: 'Invalid service name' });
		}
		const instance = this.services.byName(serviceName, true);
		if (instance.type !== service.type) {
			return fail(400, { message: 'Invalid service type' });
		}

		return {
			type: type as WeatherWidgetType,
			serviceName
		};
	}
}

export default new WeatherWidget();
