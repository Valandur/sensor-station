import { differenceInSeconds, parseISO } from 'date-fns';
import { error } from '@sveltejs/kit';
import { find } from 'geo-tz';
import { InterByteTimeoutParser } from '@serialport/parser-inter-byte-timeout';
import { SerialPort } from 'serialport';
import { stat } from 'node:fs/promises';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import { Logger } from '$lib/logger';
import type { ModemInfo } from '$lib/models/ModemInfo';

export const ENABLED = env.MODEM_ENABLED === '1';
const CACHE_TIME = Number(env.MODEM_CACHE_TIME);
const DEVICE_PATH = env.MODEM_DEVICE_PATH || '/dev/ttyUSB2';
const BASE_LAT = Number(env.MODEM_BASE_LAT);
const BASE_LNG = Number(env.MODEM_BASE_LNG);
const COPS = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ = /\+CSQ: (\d+),(\d+)/i;
const CCLK = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS = /\+CGPSINFO: ([\d.]+),(\w),([\d.]+),(\w),(\d+),([\d.]+),([\d.]+),([\d.]+),/i;

// TODO: Cache modem status
// const STATE_PATH = `data/modem.json`;

const logger = new Logger('MODEM');

let status: ModemInfo | null = null;
let cachedAt = new Date(0);

export async function getStatus(): Promise<ModemInfo | null> {
	if (!ENABLED) {
		throw error(400, { message: 'Modem module is disabled', key: 'modem.disabled' });
	}

	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		logger.debug('Using cached status');
		return status;
	}

	logger.debug('Updating...');
	const startTime = process.hrtime.bigint();
	let commander: Commander | null = null;

	try {
		if (!(await stat(DEVICE_PATH).catch(() => null))) {
			if (dev) {
				status = getMockStatus();
				cachedAt = new Date();
				return status;
			} else {
				throw new Error('Modem device path not available');
			}
		}

		commander = new Commander(DEVICE_PATH, 115200);
		await commander.open();

		const res = await commander.send('AT');
		if (res !== 'OK') {
			throw error(500, {
				message: `Modem is not ready`,
				key: 'modem.notReady',
				params: { status: res }
			});
		}

		let operator: string | null = null;
		const copsResp = await commander.send('AT+COPS?');
		const copsMatch = COPS.exec(copsResp);
		if (copsMatch) {
			operator = copsMatch[3] || null;
		}

		let signal: number | null = null;
		const csqResp = await commander.send('AT+CSQ');
		const csqMatch = CSQ.exec(csqResp);
		if (csqMatch) {
			const rawSig = Number(csqMatch[1]);
			signal = rawSig < 10 ? 1 : rawSig < 15 ? 2 : rawSig < 20 ? 3 : 4;
		}

		let time: Date | null = null;
		let tzOffset: string | null = null;
		const cclkResp = await commander.send('AT+CCLK?');
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
			tzOffset = `${tzSign}${tzHours}:${tzMinutes}`;

			time = parseISO(`${year}-${month}-${day}T${hour}:${minute}:${second}${tzOffset}`);
		}

		let lat: number | null = null;
		let lng: number | null = null;
		let tzName: string | null = null;
		const gpsResp = await commander.send('AT+CGPSINFO');
		const gpsMatch = GPS.exec(gpsResp);
		if (gpsMatch) {
			lat = Number(gpsMatch[1]) / (gpsMatch[2] === 'S' ? -100 : 100);
			lng = Number(gpsMatch[3]) / (gpsMatch[4] === 'W' ? -100 : 100);
			tzName = find(lat, lng)[0] || null;
		}

		const newStatus: ModemInfo = {
			ts: new Date(),
			isConnected: true,
			operator,
			signal,
			time,
			tzOffset,
			lat,
			lng,
			tzName,
			cached: false
		};

		status = newStatus;
		cachedAt = new Date();

		return newStatus;
	} finally {
		await commander?.close().catch((err) => logger.warn('Closing error', err));
		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		logger.info('Updated', diffTime, 'ms');
	}
}

function getMockStatus(): ModemInfo {
	return {
		ts: new Date(),
		isConnected: Math.random() > 0.5,
		time: new Date(),
		tzOffset: '+01:00',
		operator: 'DR',
		signal: Math.round(Math.random() * 4),
		lat: BASE_LAT,
		lng: BASE_LNG,
		tzName: find(BASE_LAT, BASE_LNG)[0] || 'Unknown',
		cached: Math.random() > 0.5
	};
}

class Commander {
	private readonly port: SerialPort;
	private readonly parser: InterByteTimeoutParser;

	public constructor(devicePath: string, baudRate: number) {
		this.port = new SerialPort({
			path: devicePath,
			baudRate: baudRate,
			autoOpen: false
		});
		this.parser = this.port.pipe(new InterByteTimeoutParser({ interval: 500 }));
	}

	public async send(data: string): Promise<string> {
		await new Promise<void>((resolve) => setTimeout(resolve, 100));
		return new Promise<string>((resolve, reject) => {
			logger.debug('::', data);

			let resolved = false;

			const onTimeout = () => {
				if (resolved) {
					return;
				}

				this.parser.off('data', onData);

				reject(new Error('Sending timed out'));
				resolved = true;
			};
			const timeout = setTimeout(onTimeout, 5000);

			const onData = (buffer: Buffer) => {
				const response = buffer.toString('utf-8');
				logger.debug('<<', response);

				if (resolved) {
					logger.warn('Rceived out of band');
					return;
				}

				clearTimeout(timeout);

				resolve(response);
				resolved = true;
			};
			this.parser.once('data', onData);

			this.port.write(`${data}\r\n`, (err) => {
				logger.debug('>>', data);

				if (err && !resolved) {
					this.parser.off('data', onData);
					clearTimeout(timeout);

					reject(err);
					resolved = true;
				}
			});
		});
	}

	public async open(): Promise<void> {
		return new Promise<void>((resolve, reject) =>
			this.port.open((err) => (err ? reject(err) : resolve()))
		);
	}

	public async close(): Promise<void> {
		return new Promise<void>((resolve) =>
			this.port.close((err) => {
				if (err) {
					console.error('Error while closing', err);
				}
				resolve();
			})
		);
	}
}
