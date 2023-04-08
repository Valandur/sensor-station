import type { Application } from '../app';

export abstract class Service {
	protected readonly app: Application;
	protected readonly isDebug = process.env['DEBUG'] === '1';
	protected readonly name: string;

	protected enabled: boolean;
	protected updateInterval: number | null = null;
	protected timer: NodeJS.Timer | null = null;

	public updatedAt: Date | null = null;

	public constructor(app: Application) {
		this.app = app;
		this.name = this.constructor.name.toUpperCase();
		this.enabled = process.env[this.name + '_ENABLED'] === '1';
		this.updateInterval = process.env[this.name + '_UPDATE_INTERVAL']
			? Number(process.env[this.name + '_UPDATE_INTERVAL'])
			: null;
	}

	public async init(): Promise<void> {
		if (!this.enabled) {
			this.log('DISABLED');
			return;
		}

		this.debug('INIT');
		await this.doInit();
		this.log('INITIALIZED');
	}

	protected abstract doInit(): Promise<void>;

	public async start(): Promise<void> {
		if (!this.enabled) {
			return;
		}

		this.debug('START');
		await this.doStart();
		this.log('STARTED');

		await this.update();

		if (this.updateInterval) {
			const interval = 1000 * this.updateInterval;
			this.timer = setInterval(this.update, interval);
			this.debug('UPDATE SCHEDULED', interval);
		} else {
			this.debug('UPDATE DISABLED');
		}
	}

	protected abstract doStart(): Promise<void>;

	protected update = async () => {
		if (!this.enabled) {
			return;
		}

		this.debug('UPDATING');

		try {
			await this.doUpdate();
			this.updatedAt = new Date();
		} catch (err) {
			this.error(err);
		}

		this.debug('UPDATED');
	};

	protected abstract doUpdate(): Promise<void>;

	public async stop(): Promise<void> {
		if (!this.enabled) {
			return;
		}

		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}

		this.debug('STOP');
		await this.doStop();
		this.log('STOPPED');

		this.updatedAt = null;
	}

	protected abstract doStop(): Promise<void>;

	public async dispose(): Promise<void> {
		if (!this.enabled) {
			return;
		}

		this.debug('DISPOSE');
		await this.doDispose();
		this.log('DISPOSED');
	}

	protected abstract doDispose(): Promise<void>;

	protected debug(message: any, ...params: any[]) {
		this.app.debug(this.name, message, ...params);
	}
	protected log(message: any, ...params: any[]) {
		this.app.log(this.name, message, ...params);
	}
	protected warn(message: any, ...params: any[]) {
		this.app.warn(this.name, message, ...params);
	}
	protected error(message: any, ...params: any[]) {
		this.app.error(this.name, message, ...params);
	}
}
