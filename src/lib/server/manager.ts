import { dirname } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { error, fail } from '@sveltejs/kit';

import type { ServiceInstance, ServiceType } from '$lib/models/service';
import { CAROUSEL_SERVICE_TYPE } from '$lib/models/carousel';
import { CALENDAR_SERVICE_TYPE } from '$lib/models/calendar';
import { EPIC_GAMES_SERVICE_TYPE } from '$lib/models/epic-games';
import { WEATHER_SERVICE_TYPE } from '$lib/models/weather';

import { Logger } from './logger';
import { BaseService } from './service';
import { CarouselService } from './carousel';
import { CalendarService } from './calendar';
import { EpicGamesService } from './epic-games';
import { WeatherService } from './weather';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServiceConstructor = new (name: string, config?: any) => BaseService;
type ServiceMap = { [key: string]: ServiceConstructor & { actions: Readonly<string[]> } };

const PATH = 'data/services.json';
const SERVICES: ServiceMap = {
	[CAROUSEL_SERVICE_TYPE]: CarouselService,
	[CALENDAR_SERVICE_TYPE]: CalendarService,
	[EPIC_GAMES_SERVICE_TYPE]: EpicGamesService,
	[WEATHER_SERVICE_TYPE]: WeatherService
};

class ServiceManager {
	private loaded: boolean = false;
	private logger: Logger = new Logger('SERVICES');
	private main: { name: string; action: string } | null = null;
	private services: Map<string, BaseService> = new Map();

	public constructor() {}

	public getMain() {
		return this.main;
	}

	public async setMain(name: string, action: string) {
		this.main = { name, action };
		await this.save();
	}

	public async load() {
		if (this.loaded) {
			return;
		}

		this.logger.debug('Loading...');
		const startTime = process.hrtime.bigint();

		await mkdir(dirname(PATH), { recursive: true });
		const json = JSON.parse(
			await readFile(PATH, 'utf-8').catch(() => '{ "main": null, "services": []}')
		);

		this.main = json.main ?? null;

		const services: Map<string, BaseService> = new Map();
		for (const rawService of json.services) {
			const constr = SERVICES[rawService.type];
			if (!constr) {
				this.logger.warn('Skipping unknown service', rawService.name, 'of type', rawService.type);
				continue;
			}
			const service = new constr(rawService.name, rawService.config);
			await service.init();
			services.set(rawService.name, service);
		}

		this.services = services;
		this.loaded = true;

		const diffTime = Number((process.hrtime.bigint() - startTime) / 1000000n);
		this.logger.info('Loaded', this.services.size, 'services', diffTime, 'ms');
	}

	public async add(name: string, type: string) {
		if (this.services.has(name)) {
			throw fail(400, { message: 'Duplicate service name' });
		}

		const constr = SERVICES[type];
		const service = new constr(name);
		await service.init();
		this.services.set(name, service);

		await this.save();
	}

	public async remove(name: string) {
		this.services.delete(name);

		await this.save();
	}

	public async save() {
		this.logger.debug('Saving...');
		const startTime = process.hrtime.bigint();

		const services = [...this.services.values()].map((s) => s.serialize());
		await writeFile(PATH, JSON.stringify({ main: this.main, services }), 'utf-8');

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Saved', this.services.size, 'services', diffTime, 'ms');
	}

	public getType(type: string): ServiceType {
		return SERVICES[type];
	}

	public getTypes(): ServiceType[] {
		return Object.entries(SERVICES).map(([type, clazz]) => ({
			name: type,
			actions: clazz.actions
		}));
	}

	public getInstances(type?: string): ServiceInstance[] {
		return [...this.services.values()]
			.filter((i) => !type || i.type === type)
			.map((s) => ({ name: s.name, type: { name: s.type, actions: SERVICES[s.type].actions } }));
	}

	public getByName<SERVICE extends BaseService = BaseService>(name: string): SERVICE {
		const service = this.services.get(name);
		if (!service) {
			error(404, `Service ${name} not found`);
		}
		return service as SERVICE;
	}
}

export default new ServiceManager();
