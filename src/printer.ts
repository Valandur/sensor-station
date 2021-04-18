import axios from 'axios';
import { mkdirSync, existsSync } from 'fs';
import Jimp from 'jimp';

const PRINTER_BASE_URL = 'http://192.168.1.150';
const PRINTER_IMAGE_URL = `${PRINTER_BASE_URL}/snapshot`;
const PRINTER_PROGRESS_URL = `${PRINTER_BASE_URL}/progress`;

export class Printer {
	public readonly imagePath: string = 'data/printer/snapshot.png';
	public imageChanged: boolean = false;
	public building: boolean = false;
	public progress: number;

	private interval: NodeJS.Timer;

	public init() {
		if (!existsSync(`data/printer`)) {
			mkdirSync(`data/printer`, { recursive: true });
		}

		this.update();
		this.interval = setInterval(this.update, 10 * 1000);
	}

	public dispose() {
		clearInterval(this.interval);
	}

	private update = async () => {
		const { data } = await axios({
			method: 'GET',
			url: PRINTER_PROGRESS_URL,
			responseType: 'json'
		});
		this.building = data.building;
		this.progress = Number(data.progress);

		const img = await Jimp.read(PRINTER_IMAGE_URL);
		await img.writeAsync(this.imagePath);
		this.imageChanged = true;
	};
}
