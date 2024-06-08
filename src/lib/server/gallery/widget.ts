import { error } from '@sveltejs/kit';

import { wrap } from '$lib/counter';
import {
	GALLERY_WIDGET_TYPE,
	type GalleryWidgetConfig,
	type GalleryWidgetInstance,
	type GalleryWidgetProps
} from '$lib/models/gallery';

import { BaseWidget, type WidgetValidateFailure } from '../BaseWidget';
import service from './service';

class GalleryWidget extends BaseWidget<GalleryWidgetConfig, GalleryWidgetProps> {
	public override readonly type = GALLERY_WIDGET_TYPE;

	public constructor() {
		super('GALLERY');
	}

	public async props(
		{ name, config }: GalleryWidgetInstance,
		page: number
	): Promise<GalleryWidgetProps | null> {
		if (!config.serviceName) {
			error(400, {
				key: 'gallery.widget.config',
				message: 'Invalid gallery widget config'
			});
		}

		const data = await service.getByName(config.serviceName);
		if (data.images.length === 0) {
			return null;
		}

		const [[image]] = wrap(data.images.length, page, 1, data.images);

		return {
			name,
			image
		};
	}

	public async validate(
		instance: GalleryWidgetInstance,
		config: FormData
	): Promise<GalleryWidgetConfig | WidgetValidateFailure> {
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

export default new GalleryWidget();
