import { dirname } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { error, fail } from '@sveltejs/kit';

import type { BaseConfig } from '$lib/models/BaseConfig';
import type { BaseData } from '$lib/models/BaseData';
import type { ServiceConfig, ServiceInstance } from '$lib/models/service';

import { BaseService } from './BaseService';
import calendar from './calendar/service';
import weather from './weather/service';
import epicGames from './epic-games/service';
import network from './network/service';
import prusa from './prusa/service';
import tuya from './tuya/service';
import srf from './srf/service';

type ServiceMap = { [key: string]: BaseService };

const PATH = 'data/services.json';
const SERVICE_MAP: ServiceMap = {
	[calendar.type]: calendar,
	[weather.type]: weather,
	[epicGames.type]: epicGames,
	[network.type]: network,
	[prusa.type]: prusa,
	[tuya.type]: tuya,
	[srf.type]: srf
};

class ServicesService extends BaseService {
	public readonly type: string = 'services';

	private loaded: boolean = false;
	private services: Map<string, ServiceInstance> = new Map();

	public constructor() {
		super('SERVICES');
	}

	public override async get(): Promise<BaseData> {
		await this.load();
		return { ts: new Date() };
	}

	public override validate(): Promise<BaseConfig> {
		throw new Error('Not supported');
	}

	public types() {
		return Object.keys(SERVICE_MAP);
	}

	public all() {
		return this.services;
	}

	public byName<CONFIG extends ServiceConfig = ServiceConfig>(
		name: string,
		shouldError?: false
	): ServiceInstance<CONFIG> | undefined;
	public byName<CONFIG extends ServiceConfig = ServiceConfig>(
		name: string,
		shouldError: true
	): ServiceInstance<CONFIG>;
	public byName<CONFIG extends ServiceConfig = ServiceConfig>(
		name: string,
		shouldError: boolean = false
	): ServiceInstance<CONFIG> | undefined {
		const srv = this.services.get(name);
		if (shouldError && !srv) {
			error(400, { key: 'service.nameInvalid', message: `Invalid service name: ${name}` });
		}
		return srv as ServiceInstance<CONFIG> | undefined;
	}

	public async add(name: string, type: string) {
		if (this.services.has(name)) {
			throw fail(400, { name: 'duplicate' });
		}

		const instance: ServiceInstance = { name, type, config: {} };
		this.services.set(name, instance);

		await this.save();
	}

	public async set(service: ServiceInstance, configData: FormData) {
		const srv = SERVICE_MAP[service.type];
		service.config = await srv.validate(configData);

		await this.save();

		return service;
	}

	public async remove(name: string) {
		this.services.delete(name);
	}

	private async load() {
		if (this.loaded) {
			return;
		}

		this.logger.debug('Loading...');
		const startTime = process.hrtime.bigint();

		await mkdir(dirname(PATH), { recursive: true });
		const rawServices = JSON.parse(await readFile(PATH, 'utf-8').catch(() => '[]'));

		const services: Map<string, ServiceInstance> = new Map();
		for (const rawService of rawServices) {
			services.set(rawService.name, {
				name: rawService.name,
				type: rawService.type,
				config: rawService.config
			});
		}

		this.services = services;
		this.loaded = true;

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Loaded', this.services.size, 'services', diffTime, 'ms');
	}

	private async save() {
		this.logger.debug('Saving...');
		const startTime = process.hrtime.bigint();

		await writeFile(PATH, JSON.stringify([...this.services.values()]), 'utf-8');

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Saved', this.services.size, 'services', diffTime, 'ms');
	}
}

export default new ServicesService();
