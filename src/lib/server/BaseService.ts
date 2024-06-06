import { error } from '@sveltejs/kit';

import type { ServiceConfig, ServiceData } from '$lib/models/service';
import { Cache } from '$lib/server/Cache';

import { BaseLogger } from '../models/BaseLogger';
import services from './services';

export abstract class BaseService<
	CONFIG extends ServiceConfig = ServiceConfig,
	DATA extends ServiceData = ServiceData
> {
	public abstract readonly type: string;
	protected readonly logger: BaseLogger;
	protected readonly cache: Cache<DATA>;

	protected constructor(name: string) {
		this.logger = new BaseLogger(name);
		this.cache = new Cache<DATA>(this.logger);
	}

	public async getByName(name: string, forceUpdate: boolean = false): Promise<DATA> {
		const instance = services.byName(name);
		if (!instance) {
			error(400, { key: 'service.invalidName', message: `Invalid service name: ${name}` });
		}
		if (instance.type !== this.type) {
			error(400, {
				key: 'service.invalidType',
				message: `Instance type ${instance.type} does not match class type ${this.type}`
			});
		}

		return this.get(instance.config as CONFIG, forceUpdate);
	}
	public abstract get(config: CONFIG, forceUpdate?: boolean): Promise<DATA>;
	public abstract validate(config: FormData): Promise<CONFIG>;
}
