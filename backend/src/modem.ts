import SerialCommander from '@westh/serial-commander';

const PORT = '/dev/ttyUSB2';
const UPDATE_INTERVAL = 10 * 1000;

const COPS = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ = /\+CSQ: (\d+),(\d+)/i;
const CREG = /\+CREG: (\d+),(\d+),([0-9A-F]+),([0-9A-F]+)/i;
const GPS = /\+CGPSINFO: ([\d\.]+),(\w),([\d\.]+),(\w),(\d+),([\d\.]+),([\d\.]+),([\d\.]+),/i;

export interface StatusInfo {
	isConnected: boolean;
	operator: string;
	signal: number;
	lat: number;
	lng: number;
}

export class Modem {
	private commander: SerialCommander;
	private timer: NodeJS.Timer;

	public status: StatusInfo;

	public async init() {
		this.commander = new SerialCommander({ port: PORT, disableLog: true });
		await this.commander.send('AT');
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
		await this.commander.send('AT+COPS=3,0');
		const { response: copsResp } = await this.commander.send('AT+COPS?');
		const copsMatch = COPS.exec(copsResp);
		if (copsMatch) {
			console.log('COPS:', ...copsMatch.slice(1));
			operator = copsMatch[3];
		}

		let signal: number;
		const { response: csqResp } = await this.commander.send('AT+CSQ');
		const csqMatch = CSQ.exec(csqResp);
		if (csqMatch) {
			console.log('CSQ:', ...csqMatch.slice(1));
			const rawSig = Number(csqMatch[1]);
			signal = rawSig < 10 ? 1 : rawSig < 15 ? 2 : rawSig < 20 ? 3 : 4;
		}

		await this.commander.send('AT+CREG=2');
		const { response: cregResp } = await this.commander.send('AT+CREG?');
		const cregMatch = CREG.exec(cregResp);
		if (cregMatch) {
			console.log('CREG:', ...cregMatch.slice(1));
		}

		let lat: number;
		let lng: number;
		const { response: gpsResp } = await this.commander.send('AT+CGPSINFO');
		const gpsMatch = GPS.exec(gpsResp);
		if (gpsMatch) {
			console.log('GPS:', ...gpsMatch.slice(1));
			lat = Number(gpsMatch[1]) / (gpsMatch[2] === 'S' ? -100 : 100);
			lng = Number(gpsMatch[3]) / (gpsMatch[4] === 'W' ? -100 : 100);
		}

		return { isConnected: true, operator, signal, lat, lng };
	}
}
