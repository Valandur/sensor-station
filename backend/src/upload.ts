import { UploadedFile } from 'express-fileupload';
import { readFileSync, rmSync, writeFileSync } from 'fs';
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
		this.items = JSON.parse(readFileSync(ITEMS_PATH, 'utf-8'));
	}

	public dispose(): void {}

	public async save(image: UploadedFile, description: string) {
		const path = `upload/${image.md5}${extname(image.name)}`;
		image.mv(`data/${path}`);

		const imgInfo = await probe(`http://localhost/${path}`);

		this.items.push({ img: path, title: description, ratio: imgInfo.width / imgInfo.height });
		writeFileSync(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
	}

	public async remove(img: string) {
		const idx = this.items.findIndex((i) => i.img === img);
		if (idx < 0) {
			throw new Error(`Removing invalid image`);
		}

		rmSync(`data/${img}`);
		this.items.splice(idx, 1);

		writeFileSync(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
	}
}
