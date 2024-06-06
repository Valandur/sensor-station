import type { CarouselConfig, CarouselData, CarouselScreen } from '$lib/models/carousel';
import { dirname } from 'path';
import { mkdir, readFile } from 'fs/promises';

import service from './widgets';
import { BaseService } from './BaseService';

const SCREENS_PATH = 'data/carousel/screens.json';
const SWITCH_INTERVAL = 20000;
const UPDATE_INTERVAL = 60000;

class CarouselService extends BaseService<CarouselConfig, CarouselData> {
	public readonly type: string = 'carousel';

	private loaded: boolean = false;
	private screens: CarouselScreen[] = [];

	public constructor() {
		super('CAROUSEL');
	}

	public override async get(): Promise<CarouselData> {
		if (!this.loaded) {
			await this.load();
		}

		return {
			ts: new Date(),
			screens: this.screens,
			switchInterval: SWITCH_INTERVAL,
			updateInterval: UPDATE_INTERVAL
		};
	}

	public validate(): Promise<CarouselConfig> {
		throw new Error('Not supported');
	}

	private async load() {
		this.logger.debug('Loading...');
		const startTime = process.hrtime.bigint();

		await mkdir(dirname(SCREENS_PATH), { recursive: true });
		const newScreens = JSON.parse(await readFile(SCREENS_PATH, 'utf-8').catch(() => '[]'));

		this.screens = newScreens.map((s: { name: string }) => ({ widget: service.byName(s.name) }));
		this.loaded = true;

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Loaded', newScreens.length, 'screens', diffTime, 'ms');
	}
}

export default new CarouselService();
