import { Battery } from './battery';
import { Modem } from './modem';
import { News } from './news';
import { Sensor } from './sensor';
import { Server } from './server';
import { Weather } from './weather';

export class Application {
	public readonly battery: Battery;
	public readonly modem: Modem;
	public readonly news: News;
	public readonly sensor: Sensor;
	public readonly server: Server;
	public readonly weather: Weather;

	public constructor() {
		this.battery = new Battery(this);
		this.modem = new Modem(this);
		this.news = new News(this);
		this.sensor = new Sensor(this);
		this.server = new Server(this);
		this.weather = new Weather(this);
	}

	public async run() {
		// Server
		console.log('server...');
		await this.server.init();

		// Battery
		console.log('battery...');
		await this.battery.init();

		// Modem
		console.log('modem...');
		await this.modem.init();

		// Weather
		console.log('weather...');
		await this.weather.init();

		// News
		console.log('news...');
		await this.news.init();

		console.log('sensor...');
		await this.sensor.init();

		// RUN
		return this.server.run();
	}
}
