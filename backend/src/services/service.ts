import { Application } from '../app';

export abstract class Service {
	protected readonly name: string;
	protected readonly app: Application;

	public constructor(app: Application) {
		this.app = app;
		this.name = this.constructor.name.toUpperCase();
	}

	public async init(): Promise<void> {
		// NO-OP
	}

	public async start(): Promise<void> {
		// NO-OP
	}

	protected log(message: any, ...params: any[]) {
		this.app.log(this.name, message, ...params);
	}
	protected error(message: any, ...params: any[]) {
		this.app.error(this.name, message, ...params);
	}
}
