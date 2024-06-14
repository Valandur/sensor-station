import { dirname } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { error, fail } from '@sveltejs/kit';

import type { ServiceInstance, ServiceType } from '$lib/models/service';
import { BATTERY_SERVICE_TYPE } from '$lib/models/battery';
import { CALENDAR_SERVICE_TYPE } from '$lib/models/calendar';
import { CAROUSEL_SERVICE_TYPE } from '$lib/models/carousel';
import { EPIC_GAMES_SERVICE_TYPE } from '$lib/models/epic-games';
import { GALLERY_SERVICE_TYPE } from '$lib/models/gallery';
import { HOLIDAY_SERVICE_TYPE } from '$lib/models/holiday';
import { NETWORK_SERVICE_TYPE } from '$lib/models/network';
import { PRUSA_SERVICE_TYPE } from '$lib/models/prusa';
import { SBB_ALERTS_SERVICE_TYPE } from '$lib/models/sbb-alerts';
import { SBB_DEPARTURES_SERVICE_TYPE } from '$lib/models/sbb-departures';
import { SRF_SERVICE_TYPE } from '$lib/models/srf';
import { SWISS_POST_SERVICE_TYPE } from '$lib/models/swiss-post';
import { TUYA_SERVICE_TYPE } from '$lib/models/tuya';
import { WEATHER_SERVICE_TYPE } from '$lib/models/weather';

import { Logger } from './Logger';
import { BaseService } from './BaseService';
import { BatteryService } from './battery/service';
import { CalendarService } from './calendar/service';
import { CarouselService } from './carousel/service';
import { EpicGamesService } from './epic-games/service';
import { GalleryService } from './gallery/service';
import { HolidayService } from './holidays/service';
import { NetworkService } from './network/service';
import { PrusaService } from './prusa/service';
import { SbbAlertsService } from './sbb-alerts/service';
import { SbbDeparturesService } from './sbb-departures/service';
import { SrfService } from './srf/service';
import { SwissPostService } from './swiss-post/service';
import { TuyaService } from './tuya/service';
import { WeatherService } from './weather/service';

type ServiceConstructor = new (name: string, config?: any) => BaseService;
type ServiceMap = { [key: string]: ServiceConstructor & { actions: Readonly<string[]> } };

const PATH = 'data/services.json';
const SERVICES: ServiceMap = {
	[BATTERY_SERVICE_TYPE]: BatteryService,
	[CALENDAR_SERVICE_TYPE]: CalendarService,
	[CAROUSEL_SERVICE_TYPE]: CarouselService,
	[EPIC_GAMES_SERVICE_TYPE]: EpicGamesService,
	[GALLERY_SERVICE_TYPE]: GalleryService,
	[HOLIDAY_SERVICE_TYPE]: HolidayService,
	[NETWORK_SERVICE_TYPE]: NetworkService,
	[PRUSA_SERVICE_TYPE]: PrusaService,
	[SBB_ALERTS_SERVICE_TYPE]: SbbAlertsService,
	[SBB_DEPARTURES_SERVICE_TYPE]: SbbDeparturesService,
	[SRF_SERVICE_TYPE]: SrfService,
	[SWISS_POST_SERVICE_TYPE]: SwissPostService,
	[TUYA_SERVICE_TYPE]: TuyaService,
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
			const service = new constr(rawService.name, rawService.config);
			services.set(rawService.name, service);
		}

		this.services = services;
		this.loaded = true;

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Loaded', this.services.size, 'services', diffTime, 'ms');
	}

	public async add(name: string, type: string) {
		if (this.services.has(name)) {
			throw fail(400, { key: 'services.duplicate', message: 'Duplicate service name' });
		}

		const constr = SERVICES[type];
		const service = new constr(name);
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
		await writeFile(PATH, JSON.stringify({ services }), 'utf-8');

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Saved', this.services.size, 'services', diffTime, 'ms');
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
			error(404, { key: 'services.notFound', message: `Service ${name} not found` });
		}
		return service as SERVICE;
	}
}

export default new ServiceManager();
