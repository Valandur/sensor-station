import { error, fail, redirect } from '@sveltejs/kit';
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
	protected lastIndex: number | null = null;

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
		const formAction = form.get('action');

		switch (formAction) {
			case 'add_screen': {
				const serviceName = form.get('service');
				if (typeof serviceName !== 'string') {
					return fail(400, { message: `Invalid service name ${serviceName}` });
				}

				const action = form.get('screenAction');
				if (typeof action !== 'string') {
					return fail(400, { message: `Invalid screen action ${action}` });
				}

				const service = serviceManager.getByName(serviceName);
				this.config.screens.push({ name: service.name, action });
				break;
			}

			case 'move_screen': {
				const index = Number(form.get('index'));
				if (!isFinite(index)) {
					return fail(400, { message: 'Invalid index' });
				}

				const dir = form.get('dir');
				if (dir !== 'up' && dir !== 'down') {
					return fail(400, { message: 'Invalid direction' });
				}

				if (dir === 'up') {
					if (index === 0) {
						return fail(400, { message: 'Invalid direction' });
					}

					this.config.screens = [
						...this.config.screens.slice(0, index - 1),
						this.config.screens[index],
						this.config.screens[index - 1],
						...this.config.screens.slice(index + 1)
					];
				} else if (dir === 'down') {
					if (index === this.config.screens.length - 1) {
						return fail(400, { message: 'Invalid direction' });
					}

					this.config.screens = [
						...this.config.screens.slice(0, index),
						this.config.screens[index + 1],
						this.config.screens[index],
						...this.config.screens.slice(index + 2)
					];
				}
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

			case 'move_icon': {
				const index = Number(form.get('index'));
				if (!isFinite(index)) {
					return fail(400, { message: 'Invalid index' });
				}

				const dir = form.get('dir');
				if (dir !== 'up' && dir !== 'down') {
					return fail(400, { message: 'Invalid direction' });
				}

				if (dir === 'up') {
					if (index === 0) {
						return fail(400, { message: 'Invalid direction' });
					}

					this.config.icons = [
						...this.config.icons.slice(0, index - 1),
						this.config.icons[index],
						this.config.icons[index - 1],
						...this.config.icons.slice(index + 1)
					];
				} else if (dir === 'down') {
					if (index === this.config.icons.length - 1) {
						return fail(400, { message: 'Invalid direction' });
					}

					this.config.icons = [
						...this.config.icons.slice(0, index),
						this.config.icons[index + 1],
						this.config.icons[index],
						...this.config.icons.slice(index + 2)
					];
				}
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
		{ url, cookies }: ServiceGetDataOptions
	): Promise<CarouselServiceMainData> {
		if (!ENABLED) {
			error(400, `Carousel is disabled`);
		}

		const screens = this.config.screens;
		if (!screens.length) {
			error(400, 'No screens found');
		}

		let index = Number(url.searchParams.get('screen'));
		if (!isFinite(index)) {
			index = 0;
		}
		index = wrapIndex(screens.length, index);

		const dir = url.searchParams.get('dir') === 'prev' ? 'prev' : 'next';
		const screenOptions = { url, cookies, embedded: true };

		const baseUrl = `/services/${this.name}/${action}`;

		let screen = screens[index];
		let service = serviceManager.getByName(screen.name);
		let screenData = await service.get(screen.action, screenOptions).catch(() => null);

		if (screenData === null) {
			if (this.lastIndex === index) {
				this.lastIndex = null;
				error(400, 'No screen has anything to show');
			} else if (this.lastIndex === null) {
				this.lastIndex = index;
			}

			const nextIndex = wrapIndex(screens.length, dir === 'next' ? index + 1 : index - 1);
			redirect(302, `${baseUrl}?screen=${nextIndex}&dir=${dir}`);
		}

		this.lastIndex = index;
		const nextScreen = `${baseUrl}?screen=${wrapIndex(screens.length, index + 1)}&dir=next`;
		const prevScreen = `${baseUrl}?screen=${wrapIndex(screens.length, index - 1)}&dir=prev`;

		const rawIcons = this.config.icons;
		const iconPromises: Promise<CarouselIcon | null>[] = [];
		for (const icon of rawIcons) {
			const service = serviceManager.getByName(icon.name);
			iconPromises.push(
				service
					.get(icon.action, screenOptions)
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
