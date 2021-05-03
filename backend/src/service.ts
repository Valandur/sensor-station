import axios from 'axios';
import { createWriteStream } from 'fs';
import { mkdir, stat } from 'fs/promises';
import { dirname } from 'path';

export class Service {
	public readonly name: string;

	public constructor(name: string) {
		this.name = name;
	}

	protected get dataDir(): string {
		return `data/${this.name}`;
	}

	protected async cacheImage(imgUrl: string, imgPath?: string): Promise<string> {
		if (imgPath) {
			imgPath = `${this.dataDir}/${imgPath}`;
		} else {
			const imgName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);
			imgPath = `${this.dataDir}/${imgName}`;
		}

		const exists = await stat(imgPath)
			.then((s) => s.isFile())
			.catch(() => false);
		if (!exists) {
			await mkdir(dirname(imgPath), { recursive: true });

			const writer = createWriteStream(imgPath);
			const response = await axios({
				url: imgUrl,
				method: 'GET',
				responseType: 'stream'
			});
			response.data.pipe(writer);
			await new Promise((resolve, reject) => {
				writer.on('finish', resolve);
				writer.on('error', reject);
			});
		}

		return imgPath;
	}
}
