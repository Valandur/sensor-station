import { appendFile, mkdir, stat, writeFile } from 'fs/promises';
import { format } from 'date-fns';
import { createReadStream } from 'fs';

import { Service } from './service';

export class Sensor extends Service {
	public readonly enabled = !process.env.SENSOR_DISABLED;
	private readonly dhtType = process.env.SENSOR_DHT_22 ? 22 : 11;
	private readonly dhtPin = 17;

	private dht: any;

	private updateTimer: NodeJS.Timer;
	private recordTimer: NodeJS.Timer;

	public updatedAt: Date;
	public temperature: number;
	public relativeHumidity: number;

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
			return;
		}

		await this.update();

		if (process.env.SENSOR_UPDATE_INTERVAL) {
			const interval = 1000 * Number(process.env.SENSOR_UPDATE_INTERVAL);
			this.updateTimer = setInterval(this.update, interval);
			console.log('SENSOR UPDATE STARTED', interval);
		} else {
			console.log('SENSOR UPDATE DISABLED');
		}

		if (process.env.SENSOR_RECORDING_INTERVAL) {
			await mkdir('./data/recordings/', { recursive: true });
			const interval = 1000 * Number(process.env.SENSOR_RECORDING_INTERVAL);
			this.recordTimer = setInterval(this.record, interval);
			console.log('SENSOR RECORDING STARTED', interval);
		} else {
			console.log('SENSOR RECORDING DISABLED');
		}
	}

	public dispose(): void {
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

	public record = async () => {
		try {
			const date = this.updatedAt;
			const temp = this.temperature;
			const rh = this.relativeHumidity;

			const fileName = `./data/recordings/${format(date, 'yyyy_MM')}.csv`;

			if (isNaN(temp) || isNaN(rh)) {
				console.error('Could not record data because of invalid values', date, temp, rh);
				return;
			}

			if (!(await stat(fileName).catch(() => false))) {
				await writeFile(fileName, `${date.toISOString()},${temp},${rh}\n`, 'utf-8');
			} else {
				await appendFile(fileName, `${date.toISOString()},${temp},${rh}\n`, 'utf-8');
			}

			console.log(`Recorded temp & rh`, date, temp, rh);
		} catch (err) {
			console.error(err);
		}
	};

	public createReadStream(year: string, month: string) {
		const fileName = `./data/recordings/${year}_${month}.csv`;
		return createReadStream(fileName);
	}
}
