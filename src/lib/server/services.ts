import { dirname } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { error, fail } from '@sveltejs/kit';

import { BaseLogger } from '$lib/models/BaseLogger';
import { CALENDAR_SERVICE_TYPE } from '$lib/models/calendar';
import { CAROUSEL_SERVICE_TYPE } from '$lib/models/carousel';
import { EPIC_GAMES_SERVICE_TYPE } from '$lib/models/epic-games';
import { GALLERY_SERVICE_TYPE } from '$lib/models/gallery';
import { SWISS_POST_SERVICE_TYPE } from '$lib/models/swiss-post';

import { BaseService } from './BaseService';
import { CalendarService } from './calendar/service';
import { CarouselService } from './carousel/service';
import { EpicGamesService } from './epic-games/service';
import { GalleryService } from './gallery/service';
import { SwissPostService } from './swiss-post/service';

type ServiceConstructor = new (name: string, type: string, config?: any) => BaseService;
type ServiceMap = { [key: string]: ServiceConstructor & { actions: Readonly<string[]> } };

const PATH = 'data/services.json';
const SERVICES: ServiceMap = {
	[CALENDAR_SERVICE_TYPE]: CalendarService,
	[CAROUSEL_SERVICE_TYPE]: CarouselService,
	[EPIC_GAMES_SERVICE_TYPE]: EpicGamesService,
	[GALLERY_SERVICE_TYPE]: GalleryService,
	[SWISS_POST_SERVICE_TYPE]: SwissPostService
};

class ServiceManager {
	private loaded: boolean = false;
	private logger: BaseLogger = new BaseLogger('SERVICES');
	private services: Map<string, BaseService> = new Map();

	public constructor() {}

	public async load() {
		if (this.loaded) {
			return;
		}

		this.logger.debug('Loading...');
		const startTime = process.hrtime.bigint();

		await mkdir(dirname(PATH), { recursive: true });
		const rawServices = JSON.parse(await readFile(PATH, 'utf-8').catch(() => '[]'));

		const services: Map<string, BaseService> = new Map();
		for (const rawService of rawServices) {
			const constr = SERVICES[rawService.type];
			const service = new constr(rawService.name, rawService.type, rawService.config);
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
		const service = new constr(name, type);
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

		const services = [...this.services.values()].map((s) => ({
			name: s.name,
			type: s.type,
			config: s.config
		}));
		await writeFile(PATH, JSON.stringify(services), 'utf-8');

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Saved', this.services.size, 'services', diffTime, 'ms');
	}

	public getTypes() {
		return Object.entries(SERVICES).map(([type, clazz]) => ({
			name: type,
			actions: clazz.actions
		}));
	}

	public getInstances(type?: string) {
		return [...this.services.values()]
			.filter((i) => !type || i.type === type)
			.map((s) => ({ name: s.name, type: s.type }));
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
