import { networkInterfaces } from 'os';
import { readFile, stat, writeFile } from 'fs/promises';
import SerialCommander from '@westh/serial-commander';
import { find } from 'geo-tz';

import { Service } from './service';

const MODEM_SERIAL = '/dev/ttyUSB2';
const BASE_LAT = 47.17554525;
const BASE_LNG = 8.33849761;

const COPS = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ = /\+CSQ: (\d+),(\d+)/i;
const CCLK = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS = /\+CGPSINFO: ([\d\.]+),(\w),([\d\.]+),(\w),(\d+),([\d\.]+),([\d\.]+),([\d\.]+),/i;

const STATE_PATH = `data/modem/state.json`;

export interface StatusInfo {
	isConnected: boolean;
	time: string;
	tzOffset: string;
	operator: string;
	signal: number;
	lat: number;
	lng: number;
	tzName: string;
	cached: boolean;
}

export interface Interface {
	name: string;
	ips: string[];
}

export class Modem extends Service {
	public readonly enabled = process.env.MODEM_ENABLED === '1';

	private commander: SerialCommander;
	private timer: NodeJS.Timer;

	public updatedAt: Date;
	public status: StatusInfo;
	public interfaces: Interface[];

	public override async init(): Promise<void> {
		if (!this.enabled) {
			this.log('MODEM DISABLED');
			return;
		}

		if (!(await stat(MODEM_SERIAL).catch(() => false))) {
			this.error(`Modem not available @ ${MODEM_SERIAL}`);

			if (process.env.DEBUG === '1') {
				this.status = {
					isConnected: false,
					time: new Date().toISOString(),
					tzOffset: '+01:00',
					operator: 'DR',
					signal: 3,
					lat: BASE_LAT,
					lng: BASE_LNG,
					tzName: find(BASE_LAT, BASE_LNG)[0],
					cached: true
				};
			}
			return;
		}

		this.commander = new SerialCommander({
			port: MODEM_SERIAL,
			defaultDelay: 10,
			disableLog: true
		});

		await this.update();

		if (process.env.MODEM_UPDATE_INTERVAL) {
			const interval = 1000 * Number(process.env.MODEM_UPDATE_INTERVAL);
			this.timer = setInterval(this.update, interval);
			this.log('MODEM UPDATE STARTED', interval);
		} else {
			this.log('MODEM UPDATE DISABLED');
		}
	}

	public async dispose() {
		await this.commander.close();
		clearInterval(this.timer);
	}

	private update = async () => {
		try {
			this.interfaces = await this.getInterfaces();
		} catch (err) {
			this.error(err);
		}

		try {
			this.status = await this.getStatus();
			this.updatedAt = new Date();
			await writeFile(STATE_PATH, JSON.stringify(this.status), 'utf-8');
		} catch (err) {
			this.error(err);

			const status = await readFile(STATE_PATH, 'utf-8').catch(() => null);
			if (status) {
				this.status = { ...JSON.parse(status), cached: true };
			}
		}
	};

	public async getInterfaces(): Promise<Interface[]> {
		const nets = networkInterfaces();
		const interfaces: Map<string, string[]> = new Map();

		for (const name of Object.keys(nets)) {
			for (const net of nets[name]) {
				if (net.internal) {
					continue;
				}

				let netIps = interfaces.get(name);
				if (!netIps) {
					netIps = [];
					interfaces.set(name, netIps);
				}

				netIps.push(net.address);
			}
		}

		return [...interfaces.entries()].map(([name, ips]) => ({ name, ips }));
	}

	public async getStatus(): Promise<StatusInfo> {
		if (!this.commander) {
			throw new Error(`Modem is not available`);
		}

		let operator: string;
		const { response: copsResp } = await this.commander.send('AT+COPS?');
		const copsMatch = COPS.exec(copsResp);
		if (copsMatch) {
			operator = copsMatch[3];
		}

		let signal: number;
		const { response: csqResp } = await this.commander.send('AT+CSQ');
		const csqMatch = CSQ.exec(csqResp);
		if (csqMatch) {
			const rawSig = Number(csqMatch[1]);
			signal = rawSig < 10 ? 1 : rawSig < 15 ? 2 : rawSig < 20 ? 3 : 4;
		}

		let time: string;
		let tzOffset: string;
		const { response: cclkResp } = await this.commander.send('AT+CCLK?');
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

			time = `${year}-${month}-${day}T${hour}:${minute}:${second}${tzOffset}`;
		}

		let lat: number;
		let lng: number;
		let tzName: string;
		const { response: gpsResp } = await this.commander.send('AT+CGPSINFO');
		const gpsMatch = GPS.exec(gpsResp);
		if (gpsMatch) {
			lat = Number(gpsMatch[1]) / (gpsMatch[2] === 'S' ? -100 : 100);
			lng = Number(gpsMatch[3]) / (gpsMatch[4] === 'W' ? -100 : 100);
			tzName = find(lat, lng)[0];
		}

		return { isConnected: true, operator, signal, time, tzOffset, lat, lng, tzName, cached: false };
	}
}
