import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { stat } from 'fs/promises';
import Jimp from 'jimp';

import { Display } from './display';
import { RenderContext } from './context';

const TIME_Y = 15;
const TIME_X = 15;
const TIME_SIZE = 180;

const DATE_Y = 30;
const DATE_X = 500;
const DATE_SIZE = 80;

const YEAR_Y = 120;
const YEAR_X = 500;
const YEAR_SIZE = 40;

export abstract class Screen {
	public readonly name: string;
	protected display: Display;
	protected context: RenderContext;

	protected get dataDir(): string {
		return `data/${this.name}`;
	}

	public constructor(name: string, display: Display) {
		this.name = name;
		this.display = display;
		this.context = new RenderContext(display);
		this.display.addScreen(this);
	}

	public async init(): Promise<void> {
		// NO-OP
	}

	public dispose(): void {
		// NO-OP
	}

	public canShow(): boolean {
		return true;
	}

	public onShow(): void {
		// NO-OP
	}

	public onHide(): void {
		// NO-OP
	}

	public onTap(pos: { x: number; y: number }): void {
		// NO-OP
	}

	public render(): void {
		const now = new Date();

		const time = format(now, 'HH:mm');
		this.context.drawText(time, TIME_X, TIME_Y, TIME_SIZE, this.display.ORANGE);

		const date = format(now, 'dd. MMM', { locale: de });
		this.context.drawText(date, DATE_X, DATE_Y, DATE_SIZE, this.display.WHITE);

		const dateSub = format(now, 'eeee', { locale: de });
		this.context.drawText(dateSub, YEAR_X, YEAR_Y, YEAR_SIZE, this.display.WHITE);
	}

	public draw(): void {
		this.context.draw();
	}

	protected async cacheImage(imgUrl: string, imgPath?: string): Promise<string> {
		if (imgPath) {
			imgPath = `${this.dataDir}/${imgPath}`;
		} else {
			const start = imgUrl.lastIndexOf('/') + 1;
			const imgName = imgUrl.substring(start, imgUrl.indexOf('.', start)) + '.png';
			imgPath = `${this.dataDir}/${imgName}`;
		}

		const exists = await stat(imgPath)
			.then((s) => s.isFile())
			.catch(() => false);
		if (!exists) {
			const img = await Jimp.read(imgUrl);
			await img.writeAsync(imgPath);
		}

		return imgPath;
	}
}
