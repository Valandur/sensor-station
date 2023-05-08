import { parseISO } from 'date-fns';
import { SerialPort, InterByteTimeoutParser } from 'serialport';
import { stat } from 'node:fs/promises';

import { BaseLogger } from '$lib/models/BaseLogger';

const COPS = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ = /\+CSQ: (\d+),(\d+)/i;
const CCLK = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS = /\+CGPSINFO: ([\d.]+),(\w),([\d.]+),(\w),(\d+),([\d.]+),([\d.]+),([\d.]+),/i;

export interface Config {
	devicePath: string;
	baudRate: number;
	waitMs: number;
	pauseMs: number;
	timeoutMs: number;
}

export class Device {
	private readonly config: Config;
	private readonly logger: BaseLogger;

	private readonly port: SerialPort;
	private readonly parser: InterByteTimeoutParser;

	public constructor(config: Config) {
		this.config = config;
		this.logger = new BaseLogger(`MODEM/DEVICE`);

		this.port = new SerialPort({
			path: this.config.devicePath,
			baudRate: this.config.baudRate,
			autoOpen: false
		});
		this.parser = new InterByteTimeoutParser({
			interval: this.config.waitMs
		});
	}

	public async open(): Promise<void> {
		return new Promise<void>((resolve, reject) =>
			this.port.open((err) => (err ? reject(err) : resolve()))
		);
	}

	public async close(): Promise<void> {
		if (!this.port.isOpen) {
			return;
		}

		return new Promise<void>((resolve, reject) =>
			this.port.close((err) => (err ? reject(err) : resolve()))
		);
	}

	public async checkReady(): Promise<boolean> {
		if (!(await stat(this.config.devicePath).catch(() => null))) {
			return false;
		}

		const res = await this.send('AT');
		return res === 'OK';
	}

	public async readAll() {
		const operator = await this.getCellularOperator();
		const signal = await this.getCellularSignal();
		const [time, timeTz] = await this.getCellularTimeAndTz();
		const [lat, lng] = await this.getGPS();

		return {
			operator,
			signal,
			time,
			timeTz,
			lat,
			lng
		};
	}

	private async getCellularOperator(): Promise<string | null> {
		const copsResp = await this.send('AT+COPS?');
		const copsMatch = COPS.exec(copsResp);
		return copsMatch?.[3] || null;
	}

	private async getCellularSignal(): Promise<number | null> {
		const csqResp = await this.send('AT+CSQ');
		const csqMatch = CSQ.exec(csqResp);
		if (csqMatch) {
			const rawSig = Number(csqMatch[1]);
			return rawSig < 10 ? 1 : rawSig < 15 ? 2 : rawSig < 20 ? 3 : 4;
		}

		return null;
	}

	private async getCellularTimeAndTz(): Promise<[Date, string] | [null, null]> {
		const cclkResp = await this.send('AT+CCLK?');
		const cclkMatch = CCLK.exec(cclkResp);
		if (cclkMatch) {
			const year = `${2000 + Number(cclkMatch[1])}`;
			const month = `${Number(cclkMatch[2])}`.padStart(2, '0');
			const day = `${Number(cclkMatch[3])}`.padStart(2, '0');
			const hour = `${Number(cclkMatch[4])}`.padStart(2, '0');
			const minute = `${Number(cclkMatch[5])}`.padStart(2, '0');
			const second = `${Number(cclkMatch[6])}`.padStart(2, '0');
			const rawTz = Number(cclkMatch[7]) * 15;

			const tzSign = rawTz > 0 ? '+' : '-';
			const tzHours = `${Math.floor(Math.abs(rawTz) / 60)}`.padStart(2, '0');
			const tzMinutes = `${Math.abs(rawTz) % 60}`.padStart(2, '0');

			const tz = `${tzSign}${tzHours}:${tzMinutes}`;
			const time = parseISO(`${year}-${month}-${day}T${hour}:${minute}:${second}${tz}`);
			return [time, tz];
		}

		return [null, null];
	}

	private async getGPS(): Promise<[number, number] | [null, null]> {
		const gpsResp = await this.send('AT+CGPSINFO');
		const gpsMatch = GPS.exec(gpsResp);
		if (gpsMatch) {
			const lat = Number(gpsMatch[1]) / (gpsMatch[2] === 'S' ? -100 : 100);
			const lng = Number(gpsMatch[3]) / (gpsMatch[4] === 'W' ? -100 : 100);
			return [lat, lng];
		}

		return [null, null];
	}

	private async send(data: string): Promise<string> {
		if (this.config.pauseMs > 0) {
			await new Promise<void>((resolve) => setTimeout(resolve, this.config.pauseMs));
		}

		return new Promise<string>((resolve, reject) => {
			this.logger.debug('::', data);

			let resolved = false;

			const onTimeout = () => {
				if (resolved) {
					return;
				}

				this.parser.off('data', onData);

				reject(new Error('Timed out'));
				resolved = true;
			};
			const timeout = setTimeout(onTimeout, this.config.timeoutMs);

			const onData = (buffer: Buffer) => {
				const response = buffer.toString('utf-8').trim();
				this.logger.debug('<<', response);

				if (resolved) {
					this.logger.warn('Rceived out of band');
					return;
				}

				clearTimeout(timeout);

				resolve(response);
				resolved = true;
			};
			this.parser.once('data', onData);

			this.port.write(`${data}\r\n`, (err) => {
				this.logger.debug('>>', data);

				if (err && !resolved) {
					this.parser.off('data', onData);
					clearTimeout(timeout);

					reject(err);
					resolved = true;
				}
			});
		});
	}
}
