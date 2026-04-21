import type { ServiceConfig } from '$lib/models/service';

import { Logger } from './logger';

export abstract class BaseService<CONFIG extends ServiceConfig = ServiceConfig> {
	public readonly name: string;
	public abstract readonly type: string;
	public readonly config: CONFIG;

	protected readonly logger: Logger;

	public constructor(name: string, config?: CONFIG) {
		this.name = name;
		this.logger = new Logger(name);

		this.config = config ?? this.getDefaultConfig();
	}

	public async init(): Promise<void> {}

	protected abstract getDefaultConfig(): CONFIG;

	public serialize() {
		return {
			name: this.name,
			type: this.type,
			config: this.config
		};
	}
}
