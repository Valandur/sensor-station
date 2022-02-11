import SerialCommander from '@westh/serial-commander';
import { stat } from 'fs/promises';
import { find } from 'geo-tz';

const MODEM_SERIAL = '/dev/ttyUSB2';
const UPDATE_INTERVAL = 5 * 60 * 1000;

const COPS = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ = /\+CSQ: (\d+),(\d+)/i;
const CCLK = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS = /\+CGPSINFO: ([\d\.]+),(\w),([\d\.]+),(\w),(\d+),([\d\.]+),([\d\.]+),([\d\.]+),/i;

export interface StatusInfo {
	isConnected: boolean;
	time: string;
	tzOffset: number;
	operator: string;
	signal: number;
	lat: number;
	lng: number;
	tzName: string;
}

export class Modem {
	private commander: SerialCommander;
	private timer: NodeJS.Timer;

	public status: StatusInfo;

	public async init() {
		if (!(await stat(MODEM_SERIAL).catch(() => false))) {
			console.log(`Modem not available @ ${MODEM_SERIAL}`);
			const lat = 47.17554525;
			const lng = 8.33849761;

			this.status = {
				isConnected: true,
				time: new Date().toISOString(),
				tzOffset: +1,
				operator: 'DR',
				signal: 3,
				lat,
				lng,
				tzName: find(lat, lng)[0]
			};
			return;
		}

		this.commander = new SerialCommander({ port: MODEM_SERIAL, defaultDelay: 10, disableLog: true });
		await this.commander.send('AT+COPS=2', { timeout: 5000 }); // deregister from network
		await this.commander.send('AT+CTZU=1'); // automatic time update enabled
		await this.commander.send('AT+COPS=0', { timeout: 5000 }); // register to network
		await this.commander.send('AT+CGPSAUTO=1'); // Auto start GPS on modem boot
		await this.commander.send('AT+CGPS=1,1', { timeout: 5000 }); // start gps in standalone mode

		await this.update();

		this.timer = setInterval(this.update, UPDATE_INTERVAL);
	}

	public async dispose() {
		await this.commander.close();
		clearInterval(this.timer);
	}

	private update = async () => {
		try {
			this.status = await this.getStatus();
		} catch (err) {
			console.error(err);
		}
	};

	public async getStatus(): Promise<StatusInfo> {
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

		const { response: cclkResp } = await this.commander.send('AT+CCLK?');
		const cclkMatch = CCLK.exec(cclkResp);
		if (cclkMatch) {
			console.log('CCLK:', ...cclkMatch.slice(1));
		}

		let lat: number;
		let lng: number;
		let tz: string;
		const { response: gpsResp } = await this.commander.send('AT+CGPSINFO');
		const gpsMatch = GPS.exec(gpsResp);
		if (gpsMatch) {
			lat = Number(gpsMatch[1]) / (gpsMatch[2] === 'S' ? -100 : 100);
			lng = Number(gpsMatch[3]) / (gpsMatch[4] === 'W' ? -100 : 100);
			tz = find(lat, lng)[0];
		}

		return { isConnected: true, operator, signal, time: new Date().toISOString(), tzOffset: 0, lat, lng, tzName: tz };
	}
}
