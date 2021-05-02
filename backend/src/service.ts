import { stat } from 'fs/promises';
import Jimp from 'jimp';

export class Service {
	public readonly name: string;

	public constructor(name: string) {
		this.name = name;
	}

	protected get dataDir(): string {
		return `data/${this.name}`;
	}

	protected async cacheImage(imgUrl: string, imgPath?: string, size?: number): Promise<string> {
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
			let img = await Jimp.read(imgUrl);
			if (size) {
				img = img.scaleToFit(512, 512);
			}
			await img.writeAsync(imgPath);
		}

		return imgPath;
	}
}
