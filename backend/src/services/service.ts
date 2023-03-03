import type { Application } from '../app';

export abstract class Service {
	protected readonly app: Application;

	protected readonly name: string;
	protected enabled: boolean;

	public constructor(app: Application) {
		this.app = app;
		this.name = this.constructor.name.toUpperCase();
		this.enabled = process.env[this.name + '_ENABLED'] === '1';
	}

	public async init(): Promise<void> {
		if (!this.enabled) {
			this.log('DISABLED');
			return;
		}

		this.log('INIT');
		await this.doInit();
		this.log('INITIALIZED');
	}

	protected abstract doInit(): Promise<void>;

	public async start(): Promise<void> {
		if (!this.enabled) {
			return;
		}

		this.log('START');
		await this.doStart();
		this.log('STARTED');
	}

	protected abstract doStart(): Promise<void>;

	public async stop(): Promise<void> {
		if (!this.enabled) {
			return;
		}

		this.log('STOP');
		await this.doStop();
		this.log('STOPPED');
	}

	protected abstract doStop(): Promise<void>;

	public async dispose(): Promise<void> {
		if (!this.enabled) {
			return;
		}

		this.log('DISPOSE');
		await this.doDispose();
		this.log('DISPOSED');
	}

	protected abstract doDispose(): Promise<void>;

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
