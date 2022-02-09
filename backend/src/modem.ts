import SerialCommander from '@westh/serial-commander';

const PORT = '/dev/ttyUSB2';
const UPDATE_INTERVAL = 10 * 1000;

export interface StatusInfo {
	isConnected: boolean;
	network: string;
	signalQuality: number;
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
		await this.commander.send('AT+COPS=3,0');
		const { response: copsResp } = await this.commander.send('AT+COPS?');
		console.log(copsResp.split('\r'));

		const { response: csqResp } = await this.commander.send('AT+CSQ');
		console.log(csqResp.split('\r'));

		await this.commander.send('AT+CGREG=2');
		const { response: cgRegResp } = await this.commander.send('AT+CGREG');
		console.log(cgRegResp.split('\r'));

		return { isConnected: false, network: '', signalQuality: 0 };
	}
}
