import axios from 'axios';
import { rm } from 'fs/promises';

import { Screen } from './screen';

const PRINTER_BASE_URL = 'http://192.168.1.150';
const PRINTER_IMAGE_URL = `${PRINTER_BASE_URL}/snapshot`;
const PRINTER_PROGRESS_URL = `${PRINTER_BASE_URL}/progress`;

const PROGRESS_Y = 190;
const PROGRESS_X = 15;
const PROGRESS_HEIGHT = 16;
const PROGRESS_SIZE = 50;

const PRINTER_IMG_Y = 210;

export class Printer extends Screen {
	private imagePath: string = null;
	private building: boolean = false;
	private progress: number;
	private interval: NodeJS.Timer;
	private updateCounter = 0;

	public async init(): Promise<void> {
		await this.update();
		this.interval = setInterval(this.update, 10 * 1000);
	}

	public dispose(): void {
		clearInterval(this.interval);
	}

	public canShow() {
		return this.building;
	}

	public render(): void {
		super.render();

		const PROGRESS_WIDTH = this.display.WIDTH - 2 * PROGRESS_X;
		const PRINTER_IMG_HEIGHT = this.display.HEIGHT - PRINTER_IMG_Y - 15;

		this.context.drawText(`${this.progress}%`, PROGRESS_X, PRINTER_IMG_Y, PROGRESS_SIZE, this.display.BLUE);

		this.context.drawRectangle(PROGRESS_X, PROGRESS_Y, PROGRESS_WIDTH, PROGRESS_HEIGHT, this.display.WHITE);
		this.context.drawRectangle(
			PROGRESS_X,
			PROGRESS_Y,
			PROGRESS_WIDTH * (this.progress / 100),
			PROGRESS_HEIGHT,
			this.display.BLUE
		);

		this.context.drawImage(this.imagePath, this.display.WIDTH / 2, PRINTER_IMG_Y, null, PRINTER_IMG_HEIGHT, 'x');
	}

	private update = async () => {
		this.updateCounter++;
		if (this.updateCounter >= 60) {
			await rm(this.dataDir, { force: true, recursive: true });
		}

		const { data } = await axios({
			method: 'GET',
			url: PRINTER_PROGRESS_URL,
			responseType: 'json'
		});
		this.building = data.building;
		this.progress = Number(data.progress);

		if (this.building) {
			this.imagePath = await this.cacheImage(PRINTER_IMAGE_URL, `snapshot_${new Date().getTime()}.png`);
		}
	};
}
