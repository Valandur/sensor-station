import { error, fail } from '@sveltejs/kit';

import { wrap } from '$lib/counter';
import type { WidgetActionFailure } from '$lib/models/widget';
import {
	GALLERY_SERVICE_TYPE,
	GALLERY_WIDGET_ACTIONS,
	type GalleryWidgetAction,
	type GalleryWidgetConfig,
	type GalleryWidgetData
} from '$lib/models/gallery';

import { BaseWidget, type WidgetGetDataOptions, type WidgetSetDataOpations } from '../BaseWidget';
import serviceManager from '../services';
import type { GalleryService } from './service';

export class GalleryWidget extends BaseWidget<
	GalleryWidgetAction,
	GalleryWidgetConfig,
	GalleryWidgetData
> {
	public static readonly actions = GALLERY_WIDGET_ACTIONS;

	protected generateDefaultConfig(): GalleryWidgetConfig {
		return {
			service: serviceManager.getInstances(GALLERY_SERVICE_TYPE)[0]?.name ?? ''
		};
	}

	public async getData(
		action: GalleryWidgetAction,
		options: WidgetGetDataOptions
	): Promise<GalleryWidgetData | null> {
		if (action === 'config') {
			return {
				ts: new Date(),
				name: this.name,
				type: this.type,
				action,
				config: this.config,
				services: serviceManager.getInstances(GALLERY_SERVICE_TYPE)
			};
		}

		const service = serviceManager.getByName<GalleryService>(this.config.service);

		const data = await service.getData('', options);
		if (!data || data.action !== '') {
			error(400, { key: 'epicGames.noData', message: 'No gallery data available' });
		}

		let page = Number(options.url.searchParams.get('page'));
		if (!isFinite(page)) {
			page = 0;
		}
		const [[image], prevPage, nextPage] = wrap(data.images.length, page, 1, data.images);

		return {
			ts: new Date(),
			name: this.name,
			type: this.type,
			action,
			image
		};
	}

	public async setData(
		action: GalleryWidgetAction,
		{ form }: WidgetSetDataOpations
	): Promise<void | WidgetActionFailure> {
		if (action !== 'config') {
			error(400, { key: 'gallery.action.invalid', message: 'Invalid gallery action' });
		}

		const service = form.get('service');
		if (typeof service !== 'string') {
			return fail(400, {
				key: 'gallery.service.invalid',
				message: 'Invalid gallery widget service'
			});
		}

		// Try to get the service to validate it exists
		serviceManager.getByName(service);

		this.config = {
			service
		};
	}
}
