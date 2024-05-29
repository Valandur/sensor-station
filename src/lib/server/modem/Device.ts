import { parseISO } from 'date-fns';
import { SerialPort, InterByteTimeoutParser } from 'serialport';
import { stat } from 'node:fs/promises';

import { BaseLogger } from '$lib/models/BaseLogger';

import { minutesToTz } from './utils';
import { ModemNetworkType } from '$lib/models/ModemNetworkType';

const COPS_REGEX = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ_REGEX = /\+CSQ: (\d+),(\d+)/i;
const CCLK_REGEX = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS_REGEX = /\+CGPSINFO: ([\d.]+),(\w),([\d.]+),(\w),(\d+),([\d.]+),([\d.]+),([\d.]+),/i;
const CNSMOD_REGEX = /\+CNSMOD: (\d+),(\d+)/i;
const CPSI_REGEX = /\+CPSI: (.+),(.+),(\d+)-(\d+),([x\da-f]+),(\d+),/i;
// TODO: AT+CMGRMI=4 for neighbouring cells

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
		await new Promise<void>((resolve, reject) =>
			this.port.open((err) => (err ? reject(err) : resolve()))
		);
		this.port.pipe(this.parser);
		await this.send('ATE0'); // turn off command echo
		await this.send('AT+CMEE=2'); // extended error reporting
		await this.send('AT+CREG=2'); // network registration response mode
	}

	public async close(): Promise<void> {
		if (!this.port.isOpen) {
			return;
		}

		this.port.unpipe(this.parser);
		await new Promise<void>((resolve, reject) =>
			this.port.close((err) => (err ? reject(err) : resolve()))
		);
	}

	public async checkAvailable(): Promise<boolean> {
		return !!(await stat(this.config.devicePath).catch(() => null));
	}

	public async checkReady(): Promise<boolean> {
		const res = await this.send('AT');
		return res === 'OK';
	}

	public async readAll() {
		const operator = await this.getCellularOperator();
		const signal = await this.getCellularSignal();
		const netType = await this.getNetworkType();
		const [mcc, mnc, lac, cid] = await this.getTower();
		const [time, timeTz] = await this.getCellularTimeAndTz();
		const [lat, lng] = await this.getGPS();

		return {
			operator,
			signal,
			netType,
			mcc,
			mnc,
			lac,
			cid,
			time,
			timeTz,
			lat,
			lng
		};
	}

	private async getCellularOperator(): Promise<string | null> {
		const copsResp = await this.send('AT+COPS?');
		const copsMatch = COPS_REGEX.exec(copsResp);
		return copsMatch?.[3] || null;
	}

	private async getCellularSignal(): Promise<number | null> {
		const csqResp = await this.send('AT+CSQ');
		const csqMatch = CSQ_REGEX.exec(csqResp);
		if (csqMatch) {
			const rssi = Number(csqMatch[1]);
			if (rssi === 99) {
				return 0;
			}
			return (rssi * 827 + 127) >> 8;
		}

		return null;
	}

	private async getNetworkType(): Promise<keyof typeof ModemNetworkType | null> {
		const resp = await this.send('AT+CNSMOD?');
		const match = CNSMOD_REGEX.exec(resp);
		if (match) {
			const stat = Number(match[2]);
			return ModemNetworkType[stat] as keyof typeof ModemNetworkType;
		}

		return null;
	}

	private async getTower(): Promise<[number, number, number, number] | [null, null, null, null]> {
		const resp = await this.send('AT+CPSI?');
		const match = CPSI_REGEX.exec(resp);
		if (match) {
			const mcc = Number(match[3]);
			const mnc = Number(match[4]);
			const lac = Number(match[5]);
			const cid = Number(match[6]);
			return [mcc, mnc, lac, cid];
		}

		return [null, null, null, null];
	}

	private async getCellularTimeAndTz(): Promise<[Date, string] | [null, null]> {
		const cclkResp = await this.send('AT+CCLK?');
		const cclkMatch = CCLK_REGEX.exec(cclkResp);
		if (cclkMatch) {
			const year = `${2000 + Number(cclkMatch[1])}`;
			const month = `${Number(cclkMatch[2])}`.padStart(2, '0');
			const day = `${Number(cclkMatch[3])}`.padStart(2, '0');
			const hour = `${Number(cclkMatch[4])}`.padStart(2, '0');
			const minute = `${Number(cclkMatch[5])}`.padStart(2, '0');
			const second = `${Number(cclkMatch[6])}`.padStart(2, '0');
			const totalMinutes = Number(cclkMatch[7]) * 15;
			const tz = minutesToTz(totalMinutes);
			const time = parseISO(`${year}-${month}-${day}T${hour}:${minute}:${second}${tz}`);
			return [time, tz];
		}

		return [null, null];
	}

	private async getGPS(): Promise<[number, number] | [null, null]> {
		const gpsResp = await this.send('AT+CGPSINFO');
		const gpsMatch = GPS_REGEX.exec(gpsResp);
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

			const timeoutError = new Error('modem.device.timeout');
			const onTimeout = () => {
				if (resolved) {
					return;
				}

				this.parser.off('data', onData);

				reject(timeoutError);
				resolved = true;
			};
			let timeout = setTimeout(onTimeout, this.config.timeoutMs);

			const onData = (buffer: Buffer) => {
				const response = buffer.toString('utf-8').trim().replace(/\n\n/g, '\n');

				const lines = response.split('\n');
				for (const line of lines) {
					this.logger.debug('<<', line);
				}

				if (resolved) {
					this.logger.warn('<<', 'Out-of-band data');
					return;
				}

				clearTimeout(timeout);

				if (lines.some((l) => l.trim() === 'OK')) {
					this.parser.off('data', onData);
					resolved = true;
					resolve(response);
				} else {
					timeout = setTimeout(onTimeout, this.config.timeoutMs);
				}
			};
			this.parser.on('data', onData);

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
