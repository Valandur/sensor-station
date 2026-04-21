import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import Holidays, { type HolidaysTypes } from 'date-holidays';
import { isSameDay } from 'date-fns/isSameDay';

import { wrapIndex } from '$lib/counter';
import {
	CAROUSEL_SERVICE_TYPE,
	CAROUSEL_SERVICE_ACTIONS,
	type CarouselServiceConfig,
	type CarouselIcon
} from '$lib/models/carousel';

import manager from './manager';
import { Cache } from './cache';
import { BaseService } from './service';

const ENABLED = env.CAROUSEL_ENABLED === '1';

interface HolidaysCacheData {
	holiday: HolidaysTypes.Holiday | null;
}

export class CarouselService extends BaseService<CarouselServiceConfig> {
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

	public async getConfig() {
		if (!ENABLED) {
			error(400, `Carousel is disabled`);
		}

		return {
			config: this.config,
			services: manager.getInstances().sort((a, b) => a.name.localeCompare(b.name))
		};
	}

	public async addScreen({ service, action }: { service: string; action: string }) {
		const srv = manager.getByName(service);
		this.config.screens.push({ name: srv.name, action });
	}

	public async moveScreen({ index, dir }: { index: number; dir: 'up' | 'down' }) {
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
	}

	public async deleteScreen({ index }: { index: number }) {
		this.config.screens.splice(index, 1);
	}

	public async addIcon({ srv, action }: { srv: string; action: string }) {
		const service = manager.getByName(srv);
		this.config.icons.push({ name: service.name, action });
	}

	public async moveIcon({ index, dir }: { index: number; dir: 'up' | 'down' }) {
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
	}

	public async deleteIcon({ index }: { index: number }) {
		this.config.icons.splice(index, 1);
	}

	public async setHolidays({ country, state }: { country: string; state: string }) {
		this.config.country = country;
		this.config.state = state;
	}

	public async getScreen({ index }: { index: number }) {
		if (!ENABLED) {
			error(400, `Carousel is disabled`);
		}

		const screens = this.config.screens;
		if (!screens.length) {
			error(400, 'No screens found');
		}

		if (!isFinite(index)) {
			index = 0;
		}
		index = wrapIndex(screens.length, index);

		const baseUrl = `/services/${this.name}/main`;

		const screen = screens[index];
		const service = manager.getByName(screen.name);

		this.lastIndex = index;
		const nextScreen = `${baseUrl}?screen=${wrapIndex(screens.length, index + 1)}`;
		const prevScreen = `${baseUrl}?screen=${wrapIndex(screens.length, index - 1)}`;

		const icons: CarouselIcon[] = this.config.icons.map((icon) => ({
			...icon,
			type: manager.getByName(icon.name).type
		}));

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
			nextScreen,
			prevScreen,
			icons,
			holiday: holidayData.holiday,
			switchInterval: this.config.switchInterval * 1000,
			updateInterval: this.config.updateInterval * 1000
		};
	}
}
