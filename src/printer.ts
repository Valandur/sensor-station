import axios from 'axios';
import Jimp from 'jimp';
import { rm } from 'fs/promises';

const PRINTER_BASE_URL = 'http://192.168.1.150';
const PRINTER_IMAGE_URL = `${PRINTER_BASE_URL}/snapshot`;
const PRINTER_PROGRESS_URL = `${PRINTER_BASE_URL}/progress`;

export class Printer {
	public imagePath: string = null;
	public building: boolean = false;
	public progress: number;

	private interval: NodeJS.Timer;
	private updateCounter = 0;

	public init() {
		this.update();
		this.interval = setInterval(this.update, 10 * 1000);
	}

	public dispose() {
		clearInterval(this.interval);
	}

	private update = async () => {
		this.updateCounter++;
		if (this.updateCounter >= 60) {
			await rm('data/news', { force: true, recursive: true });
		}

		const { data } = await axios({
			method: 'GET',
			url: PRINTER_PROGRESS_URL,
			responseType: 'json'
		});
		this.building = data.building;
		this.progress = Number(data.progress);

		this.imagePath = `data/printer/snapshot_${new Date().getTime()}.png`;
		const img = await Jimp.read(PRINTER_IMAGE_URL);
		await img.writeAsync(this.imagePath);
	};
}
