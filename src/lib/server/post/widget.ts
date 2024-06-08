import { error } from '@sveltejs/kit';

import { wrap } from '$lib/counter';
import {
	POST_WIDGET_TYPE,
	type PostWidgetConfig,
	type PostWidgetInstance,
	type PostWidgetProps
} from '$lib/models/post';

import { BaseWidget, type WidgetValidateFailure } from '../BaseWidget';
import service from './service';

class PostWidget extends BaseWidget<PostWidgetConfig, PostWidgetProps> {
	public override readonly type = POST_WIDGET_TYPE;

	public constructor() {
		super('POST');
	}

	public async props(
		{ name, config }: PostWidgetInstance,
		page: number
	): Promise<PostWidgetProps | null> {
		if (!config.serviceName) {
			error(400, {
				key: 'post.widget.config',
				message: 'Invalid post widget config'
			});
		}

		const data = await service.getByName(config.serviceName);
		if (data.shipments.length === 0) {
			return null;
		}

		const [[shipment]] = wrap(data.shipments.length, page, 1, data.shipments);

		return {
			name,
			shipment
		};
	}

	public async validate(
		instance: PostWidgetInstance,
		config: FormData
	): Promise<PostWidgetConfig | WidgetValidateFailure> {
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

export default new PostWidget();
