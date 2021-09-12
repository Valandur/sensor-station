import { UploadedFile } from 'express-fileupload';

import { Service } from './service';

export interface UploadItem {
	imagePath: string;
	description: string;
}

export class Upload extends Service {
	public items: UploadItem[] = [];

	public async init(): Promise<void> {}

	public dispose(): void {}

	public async save(image: UploadedFile, description: string) {
		const path = `./data/upload/${image.md5}.${image.encoding}`;
		image.mv(path);

		this.items.push({ imagePath: path, description });
	}
}
