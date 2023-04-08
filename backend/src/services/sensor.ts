import { isValid, parseISO } from 'date-fns';
import { appendFile, mkdir, readFile, stat } from 'fs/promises';
import { dirname } from 'path';

import { Service } from './service';

const RECORDINGS_PATH = 'data/sensor/recordings.csv';

export interface Recording {
	ts: string;
	temp: number;
	rh: number;
}

interface DhtSensor {
	read(type: number, pin: number): Promise<{ temperature: number; humidity: number }>;
}

export class Sensor extends Service {
	private readonly devicePath = process.env['SENSOR_DEVICE_PATH'] || '/dev/gpiomem';
	private readonly dhtType = process.env['SENSOR_DHT_TYPE'] ? Number(process.env['SENSOR_DHT_TYPE']) : 11;
	private readonly dhtPin = process.env['SENSOR_DHT_PIN'] ? Number(process.env['SENSOR_DHT_PIN']) : 17;
	private readonly recordingInterval = process.env['SENSOR_RECORDING_INTERVAL']
		? Number(process.env['SENSOR_RECORDING_INTERVAL'])
		: null;

	private dht: DhtSensor | null = null;
	private lastRecordedTs: string | null = null;
	private recordTimer: NodeJS.Timer | null = null;

	public newest: Recording | null = null;

	protected override async doInit(): Promise<void> {
		await mkdir(dirname(RECORDINGS_PATH), { recursive: true });

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
		this.newest = null;

		if (this.recordingInterval) {
			const interval = 1000 * this.recordingInterval;
			this.recordTimer = setInterval(this.record, interval);
			this.log('RECORDING SCHEDULED', interval);
		} else {
			this.log('RECORDING DISABLED');
		}
	}

	protected override async doUpdate(): Promise<void> {
		if (!this.dht) {
			if (this.isDebug) {
				this.warn('Updating in DEBUG mode');
				this.newest = {
					ts: new Date().toISOString(),
					temp: Math.random() * 50 - 20,
					rh: Math.random() * 60 + 20
				};
			}
			return;
		}

		const { temperature, humidity } = await this.dht.read(this.dhtType, this.dhtPin);

		this.newest = {
			ts: new Date().toISOString(),
			temp: temperature,
			rh: humidity
		};
	}

	protected override async doStop(): Promise<void> {
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
			await stat(this.devicePath);
			return true;
		} catch {
			this.warn(`GPIO not available @ ${this.devicePath}`);
			return false;
		}
	}

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

			await appendFile(RECORDINGS_PATH, `${this.newest.ts},${this.newest.temp},${this.newest.rh}\n`, 'utf-8');

			this.lastRecordedTs = this.newest.ts;

			this.log(`Recorded temp & rh`, this.newest.ts, this.newest.temp, this.newest.rh);
		} catch (err) {
			this.error(err);
		}
	};

	public getRecordings = async (): Promise<Recording[]> => {
		const lines = await readFile(RECORDINGS_PATH, 'utf-8');
		return lines
			.split('\n')
			.map((line) => line.split(','))
			.map(([ts, temp, rh]) => ({ ts: ts!, temp: Number(temp), rh: Number(rh) }))
			.filter((rec) => isValid(parseISO(rec.ts)) && isFinite(rec.temp) && isFinite(rec.rh));
	};
}
