import { error, fail } from '@sveltejs/kit';

import { wrapIndex } from '$lib/counter';
import type { ServiceActionFailure } from '$lib/models/service';
import {
	CAROUSEL_SERVICE_ACTIONS,
	type CarouselServiceConfig,
	type CarouselServiceData,
	type CarouselServiceAction
} from '$lib/models/carousel';

import widgetManager from '../widgets';
import {
	BaseService,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

export class CarouselService extends BaseService<
	CarouselServiceAction,
	CarouselServiceConfig,
	CarouselServiceData
> {
	public static readonly actions = CAROUSEL_SERVICE_ACTIONS;

	protected generateDefaultConfig(): CarouselServiceConfig {
		return {
			screens: [],
			switchInterval: 20,
			updateInterval: 60
		};
	}

	public override async getData(
		action: CarouselServiceAction,
		options: ServiceGetDataOptions
	): Promise<CarouselServiceData> {
		if (action === 'config') {
			return {
				ts: new Date(),
				name: this.name,
				type: this.type,
				action: 'config',
				config: this.config,
				widgets: widgetManager.getInstances()
			};
		}

		const screens = this.config.screens;

		if (!screens.length) {
			error(400, { key: 'carousel.noScreen', message: 'No screens found' });
		}

		const dir = options.url.searchParams.get('dir') === 'prev' ? 'prev' : 'next';

		let index = Number(options.url.searchParams.get('screen'));
		if (!isFinite(index)) {
			index = 0;
		}
		index = wrapIndex(screens.length, index);

		const endIndex = wrapIndex(screens.length, index - 1);
		let screenWidget = widgetManager.getByName(screens[index].widget);
		let screenData = await screenWidget.getData('', options);
		while (screenData === null) {
			index = wrapIndex(screens.length, dir === 'next' ? index + 1 : index - 1);
			// Break if we go through all screens and none of them have data to show
			if (index === endIndex) {
				break;
			}

			screenWidget = widgetManager.getByName(screens[index].widget);
			screenData = await screenWidget.getData('', options);
		}

		if (!screenData) {
			error(400, { key: 'carousel.noScreenData', message: 'No screen has anything to show' });
		}

		const getScreenUrl = (index: number, dir: 'next' | 'prev' = 'next') => {
			const idx = wrapIndex(screens.length, index);
			return `/services/${this.name}/${action}?screen=${idx}&dir=${dir}`;
		};

		const nextScreen = screens.length > 1 ? getScreenUrl(index + 1, 'next') : null;
		const prevScreen = screens.length > 1 ? getScreenUrl(index - 1, 'prev') : null;

		return {
			ts: new Date(),
			name: this.name,
			type: this.type,
			action,
			index,
			screenWidget: { name: screenWidget.name, type: screenWidget.type },
			screenData,
			nextScreen,
			prevScreen,
			switchInterval: this.config.switchInterval * 1000,
			updateInterval: this.config.updateInterval * 1000
		};
	}

	public async setData(
		action: CarouselServiceAction,
		{ form }: ServiceSetDataOptions
	): Promise<void | ServiceActionFailure> {
		if (action !== 'config') {
			error(400, { key: 'carousel.action.invalid', message: 'Invalid action' });
		}

		const formAction = form.get('action');
		if (formAction === 'add') {
			const widgetName = form.get('widget');
			if (typeof widgetName !== 'string') {
				return fail(400, {
					key: 'carousel.form.widget.invalid',
					message: `Invalid widget name ${widgetName}`
				});
			}

			const widget = widgetManager.getByName(widgetName);
			this.config.screens = (this.config.screens ?? []).concat({ widget: widget.name });
		} else if (formAction === 'delete') {
			const index = Number(form.get('index'));
			if (!isFinite(index)) {
				return fail(400, {
					key: 'carousel.form.index.invalid',
					message: `Invalid form index ${index}`
				});
			}

			this.config.screens.splice(index, 1);
		} else {
			return fail(400, {
				key: 'carousel.form.action.invalid',
				message: `Unknown form action ${formAction}`
			});
		}
	}
}
