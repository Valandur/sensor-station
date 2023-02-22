import { parseISO } from 'date-fns';
import sqlite3, { Database } from 'sqlite3';

import { Service } from './service';

export interface Recording {
	ts: Date;
	temp: number;
	rh: number;
}

export class Sensor extends Service {
	public readonly enabled = process.env.SENSOR_ENABLED === '1';
	private readonly dhtType = process.env.SENSOR_DHT_TYPE ? Number(process.env.SENSOR_DHT_TYPE) : 11;
	private readonly dhtPin = 17;

	private dht: any;
	private db: Database;

	private updateTimer: NodeJS.Timer;
	private recordTimer: NodeJS.Timer;

	public updatedAt: Date;
	public temperature: number = 0;
	public relativeHumidity: number = 0;

	public override async init(): Promise<void> {
		if (!this.enabled) {
			console.log('SENSOR DISABLED');
			return;
		}

		try {
			this.dht = require('node-dht-sensor').promises;
			console.log(`SENSOR: TYPE: ${this.dhtType}, PIN: ${this.dhtPin}`);
		} catch (err) {
			console.error(err);
		}

		this.db = new sqlite3.Database('./data/recordings.sqlite3');
		this.db.run('CREATE TABLE IF NOT EXISTS recordings (ts DATETIME, temp DOUBLE, rh DOUBLE)');

		await this.update();

		if (process.env.SENSOR_UPDATE_INTERVAL) {
			const interval = 1000 * Number(process.env.SENSOR_UPDATE_INTERVAL);
			this.updateTimer = setInterval(this.update, interval);
			console.log('SENSOR UPDATE STARTED', interval);
		} else {
			console.log('SENSOR UPDATE DISABLED');
		}

		if (process.env.SENSOR_RECORDING_INTERVAL) {
			const interval = 1000 * Number(process.env.SENSOR_RECORDING_INTERVAL);
			this.recordTimer = setInterval(this.record, interval);
			console.log('SENSOR RECORDING STARTED', interval);
		} else {
			console.log('SENSOR RECORDING DISABLED');
		}
	}

	public dispose(): void {
		if (this.db) {
			this.db.close();
		}

		clearInterval(this.updateTimer);
		clearInterval(this.recordTimer);
	}

	public update = async () => {
		try {
			const { temperature, humidity } = await this.dht.read(this.dhtType, this.dhtPin);

			this.temperature = temperature;
			this.relativeHumidity = humidity;
			this.updatedAt = new Date();
		} catch (err) {
			console.error(err);
		}
	};

	private record = async () => {
		try {
			const date = this.updatedAt;
			const temp = this.temperature;
			const rh = this.relativeHumidity;

			if (!date || isNaN(temp) || isNaN(rh)) {
				console.error('Could not record sensors because of invalid values', date, temp, rh);
				return;
			}

			await new Promise<void>((res, rej) =>
				this.db.run('INSERT INTO recordings (ts, temp, rh) VALUES (?, ?, ?)', [date.toISOString(), temp, rh], (err) =>
					err ? rej(err) : res()
				)
			);

			console.log(`Recorded temp & rh`, date, temp, rh);
		} catch (err) {
			console.error(err);
		}
	};

	public getRecordings = async (): Promise<Recording[]> => {
		return new Promise<any>((res, rej) =>
			this.db.all('SELECT ts, temp, rh FROM recordings', (err, rows) => (err ? rej(err) : res(rows)))
		);
	};
}
