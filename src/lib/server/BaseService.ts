import { error, type Cookies } from '@sveltejs/kit';

import type { ServiceActionFailure, ServiceConfig, ServiceData } from '$lib/models/service';

import { Logger } from './Logger';

export interface ServiceGetDataOptions {
	url: URL;
	cookies: Cookies;
}

export interface ServiceSetDataOptions extends ServiceGetDataOptions {
	form: FormData;
}

export type ServiceActions<ACTION extends string> = {
	[KEY in ACTION]: {
		get?: (options: ServiceGetDataOptions) => Promise<ServiceData | null>;
		set?: (options: ServiceSetDataOptions) => Promise<void | ServiceActionFailure>;
	};
};

export abstract class BaseService<
	ACTION extends string = string,
	CONFIG extends ServiceConfig = ServiceConfig
> {
	public readonly name: string;
	public abstract readonly type: string;

	protected readonly config: CONFIG;
	protected readonly logger: Logger;
	protected readonly _actions: ServiceActions<ACTION>;

	public constructor(name: string, config?: CONFIG) {
		this.name = name;
		this.logger = new Logger(name);

		this.config = config ?? this.getDefaultConfig();
		this._actions = this.getActions();
	}

	protected abstract getDefaultConfig(): CONFIG;
	protected abstract getActions(): ServiceActions<ACTION>;

	public get<DATA extends ServiceData = ServiceData>(
		action: ACTION,
		options: ServiceGetDataOptions
	): Promise<DATA | null> {
		const func = this._actions[action]?.get;
		if (!func) {
			error(400, {
				key: 'service.action.invalid',
				message: `Get action '${action}' not supported on service ${this.name}`
			});
		}

		return func(options) as Promise<DATA | null>;
	}

	public set(action: ACTION, options: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const func = this._actions[action]?.set;
		if (!func) {
			error(400, {
				key: 'service.action.invalid',
				message: `Set action '${action}' not supported on service ${this.name}`
			});
		}

		return func(options);
	}

	public serialize() {
		return {
			name: this.name,
			type: this.type,
			config: this.config
		};
	}
}
