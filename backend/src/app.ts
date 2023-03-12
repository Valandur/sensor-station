import chalk from 'chalk';
import { format } from 'date-fns';

import type { Service } from './services/service';

import { Battery } from './services/battery';
import { Calendar } from './services/calendar';
import { Games } from './services/games';
import { Modem } from './services/modem';
import { News } from './services/news';
import { Sensor } from './services/sensor';
import { Server } from './services/server';
import { Storage } from './services/storage';
import { Weather } from './services/weather';

export class Application {
	public readonly storage: Storage;
	public readonly battery: Battery;
	public readonly games: Games;
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
		this.games = new Games(this);
		this.modem = new Modem(this);
		this.news = new News(this);
		this.sensor = new Sensor(this);
		this.weather = new Weather(this);
		this.server = new Server(this);
		this.calendar = new Calendar(this);

		this.services = [
			this.storage,
			this.battery,
			this.games,
			this.modem,
			this.news,
			this.sensor,
			this.weather,
			this.server,
			this.calendar
		];
	}

	public async init() {
		this.log('MAIN', 'INIT');

		for (const srv of this.services) {
			await srv.init();
		}

		this.log('MAIN', 'INITIALIZED');
	}

	public async start() {
		this.log('MAIN', 'START');

		for (const srv of this.services) {
			await srv.start();
		}

		this.log('MAIN', 'STARTED');
	}

	public async stop() {
		this.log('MAIN', 'STOP');

		for (const srv of this.services) {
			await srv.stop();
		}

		this.log('MAIN', 'STOPPED');
	}

	public async dispose() {
		this.log('MAIN', 'DISPOSE');

		for (const srv of this.services) {
			await srv.dispose();
		}

		this.log('MAIN', 'DISPOSED');
	}

	private getDate() {
		return chalk.grey(format(new Date(), 'HH:mm:ss'));
	}

	public log(service: string, message: any, ...params: any[]) {
		console.log(`${this.getDate()} [${chalk.blue('INFO')}] [${chalk.magenta(service)}] ${message}`, ...params);
	}
	public warn(service: string, message: any, ...params: any[]) {
		console.log(
			`${this.getDate()} [${chalk.yellow('WARN')}] [${chalk.magenta(service)}] ${chalk.yellow(message)}`,
			...params
		);
	}
	public error(service: string, message: any, ...params: any[]) {
		console.error(
			`${this.getDate()} [${chalk.red('ERROR')}] [${chalk.magenta(service)}] ${chalk.red(message)}`,
			...params
		);
	}
}
