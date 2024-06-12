import type { Cookies } from '@sveltejs/kit';

import { Cache } from '$lib/server/Cache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { ServiceActionFailure, ServiceConfig, ServiceData } from '$lib/models/service';

export interface ServiceGetDataOptions {
	url: URL;
	cookies: Cookies;
}

export interface ServiceSetDataOptions extends ServiceGetDataOptions {
	form: FormData;
}

export abstract class BaseService<
	ACTION extends string = string,
	CONFIG extends ServiceConfig = ServiceConfig,
	DATA extends ServiceData = ServiceData<ACTION>
> {
	public readonly name: string;
	public readonly type: string;
	public config: CONFIG;

	protected readonly logger: BaseLogger;
	protected readonly cache: Cache<DATA>;

	public constructor(name: string, type: string, config?: CONFIG) {
		this.name = name;
		this.type = type;
		this.config = config ?? this.generateDefaultConfig();
		this.logger = new BaseLogger('SERVICE/' + name);
		this.cache = new Cache<DATA>(this.logger);
	}

	protected abstract generateDefaultConfig(): CONFIG;

	public abstract getData(action: ACTION, options: ServiceGetDataOptions): Promise<DATA | null>;
	public abstract setData(
		action: ACTION,
		options: ServiceSetDataOptions
	): Promise<void | ServiceActionFailure>;
}
