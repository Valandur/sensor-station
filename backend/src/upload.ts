import { UploadedFile } from 'express-fileupload';
import { readFile, rm, writeFile } from 'fs/promises';
import { extname } from 'path';
import probe from 'probe-image-size';

import { Service } from './service';

const ITEMS_PATH = `data/upload/items.json`;

export interface UploadItem {
	title: string;
	img: string;
	ratio: number;
}

export class Upload extends Service {
	public items: UploadItem[] = [];

	public async init(): Promise<void> {
		this.items = JSON.parse(await readFile(ITEMS_PATH, 'utf-8').catch(() => '[]'));
		this.items = this.items.map((i) => ({ ...i, img: i.img.startsWith('/') ? i.img : '/' + i.img }));
	}

	public dispose(): void {}

	public async save(image: UploadedFile, description: string) {
		const path = `/upload/${image.md5}${extname(image.name)}`;
		image.mv(`data/${path}`);

		const imgInfo = await probe(`http://localhost/${path}`);

		this.items.push({ img: path, title: description, ratio: imgInfo.width / imgInfo.height });
		await writeFile(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
	}

	public async remove(img: string) {
		const idx = this.items.findIndex((i) => i.img === img);
		if (idx < 0) {
			throw new Error(`Removing invalid image`);
		}

		await rm(`data/${img}`);
		this.items.splice(idx, 1);

		await writeFile(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
	}
}
