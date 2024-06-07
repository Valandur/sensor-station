import { error } from '@sveltejs/kit';
import { isAfter } from 'date-fns/isAfter';

import { CounterType, clamp, slice, wrap } from '$lib/counter';
import {
	WEATHER_WIDGET_TYPE,
	type WeatherWidgetConfig,
	type WeatherWidgetInstance,
	type WeatherWidgetProps,
	type WeatherWidgetType
} from '$lib/models/weather';

import { BaseWidget, type WidgetValidateFailure } from '../BaseWidget';
import service from './service';

const VALID_TYPES = ['daily', 'hourly', 'alerts'];
const ITEMS_PER_PAGE = 7;

class WeatherWidget extends BaseWidget<WeatherWidgetConfig, WeatherWidgetProps> {
	public override readonly type = WEATHER_WIDGET_TYPE;

	public constructor() {
		super('WEATHER');
	}

	public async props(
		{ name, config }: WeatherWidgetInstance,
		page: number
	): Promise<WeatherWidgetProps | null> {
		if (!config.serviceName || !VALID_TYPES.includes(config.type)) {
			error(400, { key: 'weather.widget.config', message: 'Invalid weather widget config' });
		}

		const now = new Date();
		const data = await service.getByName(config.serviceName);

		if (config.type === 'alerts' && data.alerts.length === 0) {
			return null;
		}

		const [daily] = clamp(data.daily.length, 0, ITEMS_PER_PAGE, data.daily);
		let hourly = data.hourly.filter((f) => isAfter(f.ts, now)).filter((_, i) => i % 2 === 0);
		[hourly] = clamp(hourly.length, 0, ITEMS_PER_PAGE, hourly);
		const [[alert]] = wrap(data.alerts.length, page, 1, data.alerts);

		return {
			name,
			type: config.type,
			location: data.location,
			daily,
			hourly,
			alert
		};
	}

	public async validate(
		instance: WeatherWidgetInstance,
		config: FormData
	): Promise<WeatherWidgetConfig | WidgetValidateFailure> {
		const type = config.get('type');
		if (typeof type !== 'string' || !VALID_TYPES.includes(type)) {
			throw new Error('Invalid type');
		}

		const serviceName = config.get('serviceName');
		if (typeof serviceName !== 'string') {
			throw new Error('Invalid service name');
		}
		const serviceInstance = this.services.byName(serviceName, true);
		if (serviceInstance.type !== service.type) {
			throw new Error('Invalid service type');
		}

		return {
			type: type as WeatherWidgetType,
			serviceName
		};
	}
}

export default new WeatherWidget();
