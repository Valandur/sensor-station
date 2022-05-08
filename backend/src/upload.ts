import { parseISO } from 'date-fns';
import { UploadedFile } from 'express-fileupload';
import { readFile, rm, writeFile } from 'fs/promises';
import { extname } from 'path';
import { imageSize } from 'image-size';

import { Service } from './service';

const ITEMS_PATH = `data/upload/items.json`;

export interface UploadItem {
	title: string;
	date: Date;
	img: string;
	ratio: number;
}

export class Upload extends Service {
	public items: UploadItem[] = [];

	public async init(): Promise<void> {
		const json = JSON.parse(await readFile(ITEMS_PATH, 'utf-8').catch(() => '[]'));
		this.items = json.map((item: any) => ({
			title: item.title,
			date: item.date ? parseISO(item.date) : new Date(),
			img: item.img.startsWith('/') ? item.img : '/' + item.img,
			ratio: item.ratio
		}));
		console.log(`Loaded ${this.items.length} uploaded images`)
	}

	public dispose(): void {}

	public async save(image: UploadedFile, title: string, date: Date) {
		const path = `/upload/${image.md5}${extname(image.name)}`;
		image.mv(`data/${path}`);

		const size = imageSize(image.data);
		const ratio = size.orientation >= 5 ? size.height / size.width : size.width / size.height; // If the image is rotated 90° switch the ratio

		this.items.push({ img: path, title, date, ratio });
		await writeFile(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
	}

	public async edit(img: string, title: string, date: Date) {
		const idx = this.items.findIndex((i) => i.img === img);
		if (idx < 0) {
			throw new Error(`Removing invalid image`);
		}

		this.items = this.items.map((item, i) => (i !== idx ? item : { ...item, title, date }));
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
