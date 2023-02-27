import { Battery } from './services/battery';
import { Modem } from './services/modem';
import { News } from './services/news';
import { Sensor } from './services/sensor';
import { Server } from './services/server';
import { Weather } from './services/weather';
import { Storage } from './services/storage';
import { Service } from './services/service';
import { Calendar } from './services/calendar';

export class Application {
	public readonly storage: Storage;
	public readonly battery: Battery;
	public readonly modem: Modem;
	public readonly news: News;
	public readonly sensor: Sensor;
	public readonly server: Server;
	public readonly weather: Weather;
	public readonly calendar: Calendar;

	private readonly services: Service[] = [];

	public constructor() {
		this.storage = new Storage(this);
		this.battery = new Battery(this);
		this.modem = new Modem(this);
		this.news = new News(this);
		this.sensor = new Sensor(this);
		this.weather = new Weather(this);
		this.server = new Server(this);
		this.calendar = new Calendar(this);

		this.services = [
			this.storage,
			this.battery,
			this.modem,
			this.news,
			this.sensor,
			this.weather,
			this.server,
			this.calendar
		];
	}

	public async init() {
		for (const srv of this.services) {
			await srv.init();
		}
	}

	public async run() {
		for (const srv of this.services) {
			await srv.start();
		}
	}

	public log(service: string, message: any, ...params: any[]) {
		const date = new Date().toISOString();
		console.log(`${date} [LOG] [${service}] ${message}`, ...params);
	}
	public error(service: string, message: any, ...params: any[]) {
		const date = new Date().toISOString();
		console.error(`${date} [ERROR] [${service}] ${message}`, ...params);
	}
}
