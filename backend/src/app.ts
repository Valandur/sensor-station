import chalk from 'chalk';
import { format } from 'date-fns';
import { inspect } from 'util';

import type { Service } from './services/service';

import { Battery } from './services/battery';
import { Calendar } from './services/calendar';
import { Games } from './services/games';
import { Modem } from './services/modem';
import { News } from './services/news';
import { Post } from './services/post';
import { SBB } from './services/sbb';
import { Sensor } from './services/sensor';
import { Server } from './services/server';
import { Weather } from './services/weather';

export class Application {
	public readonly battery: Battery;
	public readonly calendar: Calendar;
	public readonly games: Games;
	public readonly modem: Modem;
	public readonly news: News;
	public readonly post: Post;
	public readonly sbb: SBB;
	public readonly sensor: Sensor;
	public readonly server: Server;
	public readonly weather: Weather;

	private readonly services: Service[] = [];

	public constructor() {
		this.battery = new Battery(this);
		this.calendar = new Calendar(this);
		this.games = new Games(this);
		this.modem = new Modem(this);
		this.news = new News(this);
		this.post = new Post(this);
		this.sbb = new SBB(this);
		this.sensor = new Sensor(this);
		this.server = new Server(this);
		this.weather = new Weather(this);

		this.services = [
			this.battery,
			this.calendar,
			this.games,
			this.modem,
			this.news,
			this.post,
			this.sbb,
			this.sensor,
			this.server,
			this.weather
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
		const msg = typeof message === 'string' ? message : inspect(message);
		console.log(`${this.getDate()} [${chalk.blue('INFO')}] [${chalk.magenta(service)}] ${msg}`, ...params);
	}
	public warn(service: string, message: any, ...params: any[]) {
		const msg = chalk.yellow(typeof message === 'string' ? message : inspect(message));
		console.log(`${this.getDate()} [${chalk.yellow('WARN')}] [${chalk.magenta(service)}] ${msg}`, ...params);
	}
	public error(service: string, message: any, ...params: any[]) {
		const msg = chalk.red(typeof message === 'string' ? message : inspect(message));
		console.error(`${this.getDate()} [${chalk.red('ERROR')}] [${chalk.magenta(service)}] ${msg}`, ...params);
	}
}
