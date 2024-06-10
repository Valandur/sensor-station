import type {
	CarouselServiceConfig,
	CarouselServiceData,
	CarouselScreen,
	CarouselServiceInstance
} from '$lib/models/carousel';
import { dirname } from 'path';
import { mkdir, readFile } from 'fs/promises';

import widgetService from './widgets';
import { BaseService } from './BaseService';

const SCREENS_PATH = 'data/carousel/screens.json';

class CarouselService extends BaseService<CarouselServiceConfig, CarouselServiceData> {
	public readonly type: string = 'carousel';

	private loaded: boolean = false;
	private screens: CarouselScreen[] = [];

	public constructor() {
		super('CAROUSEL');
	}

	public override async get({
		name,
		config
	}: CarouselServiceInstance): Promise<CarouselServiceData> {
		if (!this.loaded) {
			await this.load();
		}

		return {
			ts: new Date(),
			name,
			screens: this.screens,
			switchInterval: config.switchInterval * 1000,
			updateInterval: config.updateInterval * 1000
		};
	}

	public validate(): Promise<CarouselServiceConfig> {
		throw new Error('Not supported');
	}

	private async load() {
		this.logger.debug('Loading...');
		const startTime = process.hrtime.bigint();

		await mkdir(dirname(SCREENS_PATH), { recursive: true });
		const newScreens = JSON.parse(await readFile(SCREENS_PATH, 'utf-8').catch(() => '[]'));

		this.screens = newScreens.map((s: { widget: string }) => ({
			widget: widgetService.byName(s.widget)
		}));
		this.loaded = true;

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Loaded', newScreens.length, 'screens', diffTime, 'ms');
	}
}

export default new CarouselService();
