import { Service } from './service';

export interface Recording {
	ts: string;
	temp: number;
	rh: number;
}

export class Sensor extends Service {
	public readonly enabled = process.env.SENSOR_ENABLED === '1';
	private readonly dhtType = process.env.SENSOR_DHT_TYPE ? Number(process.env.SENSOR_DHT_TYPE) : 11;
	private readonly dhtPin = 17;

	private dht: any;

	private updateTimer: NodeJS.Timer;
	private recordTimer: NodeJS.Timer;

	public newest: Recording;
	private lastRecordedTs: string;

	public override async init(): Promise<void> {
		if (!this.enabled) {
			this.log('SENSOR DISABLED');
			return;
		}

		try {
			this.dht = require('node-dht-sensor').promises;
			this.log(`SENSOR: TYPE: ${this.dhtType}, PIN: ${this.dhtPin}`);
		} catch (err) {
			this.error(err);
		}

		await this.app.storage.run(
			'CREATE TABLE IF NOT EXISTS recordings (id INTEGER PRIMARY KEY AUTOINCREMENT, ts DATETIME, temp DOUBLE, rh DOUBLE)'
		);

		await this.update();

		if (process.env.SENSOR_UPDATE_INTERVAL) {
			const interval = 1000 * Number(process.env.SENSOR_UPDATE_INTERVAL);
			this.updateTimer = setInterval(this.update, interval);
			this.log('SENSOR UPDATE STARTED', interval);
		} else {
			this.log('SENSOR UPDATE DISABLED');
		}

		if (process.env.SENSOR_RECORDING_INTERVAL) {
			const interval = 1000 * Number(process.env.SENSOR_RECORDING_INTERVAL);
			this.recordTimer = setInterval(this.record, interval);
			this.log('SENSOR RECORDING STARTED', interval);
		} else {
			this.log('SENSOR RECORDING DISABLED');
		}
	}

	public dispose(): void {
		clearInterval(this.updateTimer);
		clearInterval(this.recordTimer);
	}

	public update = async () => {
		try {
			const { temperature, humidity } = await this.dht.read(this.dhtType, this.dhtPin);

			this.newest = {
				ts: new Date().toISOString(),
				temp: temperature,
				rh: humidity
			};
		} catch (err) {
			this.error(err);
		}
	};

	private record = async () => {
		try {
			if (!this.newest) {
				this.error('Could not record sensors, no recording present!');
				return;
			}

			if (this.lastRecordedTs === this.newest.ts) {
				this.error('Skipping recording because no new values are available');
				return;
			}

			await this.app.storage.run('INSERT INTO recordings (ts, temp, rh) VALUES (?, ?, ?)', [
				this.newest.ts,
				this.newest.temp,
				this.newest.rh
			]);

			this.lastRecordedTs = this.newest.ts;

			this.log(`Recorded temp & rh`, this.newest);
		} catch (err) {
			this.error(err);
		}
	};

	public getRecordings = async (): Promise<Recording[]> => {
		return this.app.storage.all('SELECT ts, temp, rh FROM recordings');
	};
}
