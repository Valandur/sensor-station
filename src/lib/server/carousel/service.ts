import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import Holidays, { type HolidaysTypes } from 'date-holidays';
import { isSameDay } from 'date-fns/isSameDay';

import { wrapIndex } from '$lib/counter';
import type { ServiceActionFailure } from '$lib/models/service';
import {
	CAROUSEL_SERVICE_TYPE,
	CAROUSEL_SERVICE_ACTIONS,
	type CarouselServiceConfig,
	type CarouselServiceAction,
	type CarouselServiceConfigData,
	type CarouselServiceMainData,
	type CarouselIcon
} from '$lib/models/carousel';

import serviceManager from '../services';
import { Cache } from '../Cache';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

const ENABLED = env.CAROUSEL_ENABLED === '1';

interface HolidaysCacheData {
	holiday: HolidaysTypes.Holiday | null;
}

export class CarouselService extends BaseService<CarouselServiceAction, CarouselServiceConfig> {
	public override readonly type = CAROUSEL_SERVICE_TYPE;
	public static readonly actions = CAROUSEL_SERVICE_ACTIONS;

	protected readonly holidaysCache: Cache<HolidaysCacheData> = new Cache(this.logger);

	protected getDefaultConfig(): CarouselServiceConfig {
		return {
			screens: [],
			icons: [],
			switchInterval: 20,
			updateInterval: 60,
			country: '',
			state: ''
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
			services: serviceManager.getInstances().sort((a, b) => a.name.localeCompare(b.name))
		};
	}

	public async setConfig({ form }: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const formAction = form.get('__formAction');

		switch (formAction) {
			case 'add_screen': {
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

			case 'delete_screen': {
				const index = Number(form.get('index'));
				if (!isFinite(index)) {
					return fail(400, { message: `Invalid form index ${index}` });
				}

				this.config.screens.splice(index, 1);
				break;
			}

			case 'add_icon': {
				const serviceName = form.get('service');
				if (typeof serviceName !== 'string') {
					return fail(400, { message: `Invalid service name ${serviceName}` });
				}

				const action = form.get('action');
				if (typeof action !== 'string') {
					return fail(400, { message: `Invalid action ${action}` });
				}

				const service = serviceManager.getByName(serviceName);
				this.config.icons.push({ name: service.name, action });
				break;
			}

			case 'delete_icon': {
				const index = Number(form.get('index'));
				if (!isFinite(index)) {
					return fail(400, { message: `Invalid form index ${index}` });
				}

				this.config.icons.splice(index, 1);
				break;
			}

			case 'other': {
				const country = form.get('country');
				if (typeof country !== 'string') {
					return fail(400, { message: 'Invalid country' });
				}

				const state = form.get('state');
				if (typeof state !== 'string') {
					return fail(400, { message: 'Invalid state' });
				}

				this.config.country = country;
				this.config.state = state;
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

		const endIndex = wrapIndex(screens.length, dir === 'next' ? index - 1 : index + 1);

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

		const nextScreen = getScreenUrl(index + 1, 'next');
		const prevScreen = getScreenUrl(index - 1, 'prev');

		const rawIcons = this.config.icons;
		const iconPromises: Promise<CarouselIcon | null>[] = [];
		for (const icon of rawIcons) {
			const service = serviceManager.getByName(icon.name);
			iconPromises.push(
				service
					.get(icon.action, options)
					.then((data) => {
						if (!data) {
							throw new Error();
						}
						return {
							...icon,
							type: service.type,
							data
						};
					})
					.catch(() => null)
			);
		}

		const icons = (await Promise.all(iconPromises)).filter((icon) => !!icon) as CarouselIcon[];

		const holidayKey = `${this.config.country}-${this.config.state}`;
		const cachedTs = this.holidaysCache.getTs(holidayKey);
		const forceUpdate = cachedTs !== null && !isSameDay(new Date(), cachedTs);

		const holidayData = await this.holidaysCache.with(
			{
				key: holidayKey,
				force: forceUpdate,
				resultCacheTime: 24 * 60 * 60, // cache for 1 day - force updated when the day changes
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				const holidays = new Holidays(this.config.country, this.config.state);
				const holi = holidays.isHoliday(new Date());
				const holiday = holi ? holi[0] : null;

				return {
					holiday
				};
			}
		);

		return {
			ts: new Date(),
			type: 'data',
			index,
			screen,
			screenType: service.type,
			screenData,
			nextScreen,
			prevScreen,
			icons,
			holiday: holidayData.holiday,
			switchInterval: this.config.switchInterval * 1000,
			updateInterval: this.config.updateInterval * 1000
		};
	}
}
