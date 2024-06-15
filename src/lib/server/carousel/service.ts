import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import { wrapIndex } from '$lib/counter';
import type { ServiceActionFailure } from '$lib/models/service';
import {
	CAROUSEL_SERVICE_TYPE,
	CAROUSEL_SERVICE_ACTIONS,
	type CarouselServiceConfig,
	type CarouselServiceAction,
	type CarouselServiceConfigData,
	type CarouselServiceMainData
} from '$lib/models/carousel';

import serviceManager from '../services';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

const ENABLED = env.CAROUSEL_ENABLED === '1';

export class CarouselService extends BaseService<CarouselServiceAction, CarouselServiceConfig> {
	public override readonly type = CAROUSEL_SERVICE_TYPE;
	public static readonly actions = CAROUSEL_SERVICE_ACTIONS;

	protected getDefaultConfig(): CarouselServiceConfig {
		return {
			screens: [],
			switchInterval: 20,
			updateInterval: 60
		};
	}

	protected getActions(): ServiceActions<CarouselServiceAction> {
		return {
			config: {
				get: this.getConfig.bind(this),
				set: this.setConfig.bind(this)
			},
			main: {
				get: this.getData.bind(this, 'main')
			},
			preview: {
				get: this.getData.bind(this, 'preview')
			}
		};
	}

	public async getConfig(_: ServiceGetDataOptions): Promise<CarouselServiceConfigData> {
		if (!ENABLED) {
			error(400, `Carousel is disabled`);
		}

		return {
			ts: new Date(),
			type: 'config',
			config: this.config,
			services: serviceManager.getInstances()
		};
	}

	public async setConfig({ form }: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const formAction = form.get('__formAction');

		switch (formAction) {
			case 'add': {
				const serviceName = form.get('service');
				if (typeof serviceName !== 'string') {
					return fail(400, { message: `Invalid service name ${serviceName}` });
				}

				const action = form.get('action');
				if (typeof action !== 'string') {
					return fail(400, { message: `Invalid action ${action}` });
				}

				const service = serviceManager.getByName(serviceName);
				this.config.screens.push({ name: service.name, action });
				break;
			}

			case 'delete': {
				const index = Number(form.get('index'));
				if (!isFinite(index)) {
					return fail(400, { message: `Invalid form index ${index}` });
				}

				this.config.screens.splice(index, 1);
				break;
			}

			default: {
				return fail(400, { message: `Unknown form action ${formAction}` });
			}
		}
	}

	public async getData(
		action: string,
		options: ServiceGetDataOptions
	): Promise<CarouselServiceMainData> {
		if (!ENABLED) {
			error(400, `Carousel is disabled`);
		}

		const screens = this.config.screens;

		if (!screens.length) {
			error(400, 'No screens found');
		}

		const dir = options.url.searchParams.get('dir') === 'prev' ? 'prev' : 'next';

		let index = Number(options.url.searchParams.get('screen'));
		if (!isFinite(index)) {
			index = 0;
		}
		index = wrapIndex(screens.length, index);

		const endIndex = wrapIndex(screens.length, index - 1);

		let screen = screens[index];
		let service = serviceManager.getByName(screen.name);
		let screenData = await service.get(screen.action, options).catch(() => null);
		while (screenData === null) {
			index = wrapIndex(screens.length, dir === 'next' ? index + 1 : index - 1);
			// Break if we go through all screens and none of them have data to show
			if (index === endIndex) {
				break;
			}

			screen = screens[index];
			service = serviceManager.getByName(screen.name);
			screenData = await service.get(screen.action, options).catch(() => null);
		}

		if (!screenData) {
			error(400, 'No screen has anything to show');
		}

		const getScreenUrl = (index: number, dir: 'next' | 'prev' = 'next') => {
			const idx = wrapIndex(screens.length, index);
			return `/services/${this.name}/${action}?screen=${idx}&dir=${dir}`;
		};

		const nextScreen = screens.length > 1 ? getScreenUrl(index + 1, 'next') : null;
		const prevScreen = screens.length > 1 ? getScreenUrl(index - 1, 'prev') : null;

		return {
			ts: new Date(),
			type: 'data',
			index,
			screen,
			screenType: service.type,
			screenData,
			nextScreen,
			prevScreen,
			switchInterval: this.config.switchInterval * 1000,
			updateInterval: this.config.updateInterval * 1000
		};
	}
}
