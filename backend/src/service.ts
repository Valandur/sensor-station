import { Application } from './app';

export abstract class Service {
	public readonly app: Application;

	public constructor(app: Application) {
		this.app = app;
	}

	public abstract init(): Promise<void>;
}
