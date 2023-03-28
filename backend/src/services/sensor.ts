import { isValid, parseISO } from 'date-fns';
import { appendFile, mkdir, readFile, stat } from 'fs/promises';

import { Service } from './service';

const DEVICE_PATH = `/dev/gpiomem`;

export interface Recording {
	ts: string;
	temp: number;
	rh: number;
}

interface DhtSensor {
	read(type: number, pin: number): Promise<{ temperature: number; humidity: number }>;
}

export class Sensor extends Service {
	private readonly dhtType = process.env['SENSOR_DHT_TYPE'] ? Number(process.env['SENSOR_DHT_TYPE']) : 11;
	private readonly dhtPin = process.env['SENSOR_DHT_PIN'] ? Number(process.env['SENSOR_DHT_PIN']) : 17;

	private dht: DhtSensor | null = null;
	private lastRecordedTs: string | null = null;

	private updateTimer: NodeJS.Timer | null = null;
	private recordTimer: NodeJS.Timer | null = null;

	public newest: Recording | null = null;

	protected override async doInit(): Promise<void> {
		await mkdir('./data/sensor', { recursive: true });

		if (!(await this.checkDevice())) {
			return;
		}

		try {
			this.dht = require('node-dht-sensor').promises;
			this.log(`SENSOR: TYPE: ${this.dhtType}, PIN: ${this.dhtPin}`);
		} catch (err) {
			this.error(err);
		}
	}

	protected override async doStart(): Promise<void> {
		await this.update();

		if (process.env['SENSOR_UPDATE_INTERVAL']) {
			const interval = 1000 * Number(process.env['SENSOR_UPDATE_INTERVAL']);
			this.updateTimer = setInterval(this.update, interval);
			this.log('UPDATE STARTED', interval);
		} else {
			this.log('UPDATE DISABLED');
		}

		if (process.env['SENSOR_RECORDING_INTERVAL']) {
			const interval = 1000 * Number(process.env['SENSOR_RECORDING_INTERVAL']);
			this.recordTimer = setInterval(this.record, interval);
			this.log('RECORDING STARTED', interval);
		} else {
			this.log('RECORDING DISABLED');
		}
	}

	protected override async doStop(): Promise<void> {
		if (this.updateTimer) {
			clearInterval(this.updateTimer);
			this.updateTimer = null;
		}
		if (this.recordTimer) {
			clearInterval(this.recordTimer);
			this.recordTimer = null;
		}

		this.newest = null;
	}

	protected override async doDispose(): Promise<void> {
		if (this.dht) {
			this.dht = null;
		}
	}

	private async checkDevice() {
		try {
			await stat(DEVICE_PATH);
			return true;
		} catch {
			this.warn(`GPIO not available @ ${DEVICE_PATH}`);
			return false;
		}
	}

	private update = async () => {
		if (!this.dht) {
			if (process.env['DEBUG'] === '1') {
				this.warn('Updating in DEBUG mode');
				this.newest = {
					ts: new Date().toISOString(),
					temp: Math.random() * 50 - 20,
					rh: Math.random() * 60 + 20
				};
				return;
			} else {
				throw new Error(`DHT is not available`);
			}
		}

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

			await appendFile(
				'./data/sensor/recordings.csv',
				`${this.newest.ts},${this.newest.temp},${this.newest.rh}\n`,
				'utf-8'
			);

			this.lastRecordedTs = this.newest.ts;

			this.log(`Recorded temp & rh`, this.newest.ts, this.newest.temp, this.newest.rh);
		} catch (err) {
			this.error(err);
		}
	};

	public getRecordings = async (): Promise<Recording[]> => {
		const lines = await readFile('./data/sensor/recordings.csv', 'utf-8');
		return lines
			.split('\n')
			.map((line) => line.split(','))
			.map(([ts, temp, rh]) => ({ ts: ts!, temp: Number(temp), rh: Number(rh) }))
			.filter((rec) => isValid(parseISO(rec.ts)) && isFinite(rec.temp) && isFinite(rec.rh));
	};
}
