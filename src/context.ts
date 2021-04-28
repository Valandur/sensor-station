import { resolve } from 'path';

import { Color, Display } from './display';

interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface PreparedRectangle {
	type: 'rect';
	dest: Rect;
	color: Color;
}

interface PreparedText {
	type: 'text';
	text: string;
	pos: { x: number; y: number };
	size: number;
	color: any;
}

interface PreparedImage {
	type: 'img';
	img: Image;
	src: Rect;
	dest: Rect;
}

type PreparedDraw = PreparedRectangle | PreparedText | PreparedImage;

interface Image {
	width: number;
	height: number;
}

export class RenderContext {
	private display: Display;
	private ray: any;
	private imgCache: Map<string, Image> = new Map();
	private draws: PreparedDraw[] = [];

	public constructor(display: Display) {
		this.display = display;
		this.ray = display.ray;
	}

	public drawRectangle(x: number, y: number, width: number, height: number, color: Color) {
		this.draws.push({ type: 'rect', dest: { x, y, width, height }, color });
	}

	public drawText(text: string, x: number, y: number, size: number, color: Color): void;
	public drawText(text: string, x: number, y: number, width: number, height: number, size: number, color: Color): void;
	public drawText(text: string, x: number, y: number, width: number, height: number, size?: number, color?: Color) {
		if (!color && !size) {
			size = width;
			color = height;
			width = null;
			height = null;
		}

		let words = text.split(/ /g);

		let line = 0;
		while (words.length > 0) {
			// Grab as many words as we can, then remove until we're under the specified width
			// if no width was specified this just grabs all the words
			let index = words.length;
			if (width) {
				while (index > 1 && this.ray.MeasureText(words.slice(0, index).join(' '), size) > width) {
					index--;
				}
			}

			this.draws.push({
				type: 'text',
				text: words.slice(0, index).join(' '),
				pos: { x, y: y + line * size },
				size,
				color
			});
			words = words.slice(index);
			line++;

			// If we reached the max height then abort
			if (height && (line + 1) * size > height) {
				break;
			}
		}
	}

	public measureText(text: string, size: number): number {
		return this.ray.MeasureText(text, size);
	}

	public drawImage(path: string, x: number, y: number, width: number, height?: number, center?: 'x' | 'y' | 'both') {
		path = resolve(path); // Normalize path

		let img = this.imgCache.get(path);
		if (!img) {
			// If image isn't loaded yet (indexed by path), load it now
			img = this.ray.LoadTexture(path);
			this.imgCache.set(path, img);
		}

		if (!width) {
			// If width isn't provided scale image according to ratio
			width = height * (img.width / img.height);
		}

		if (!height) {
			// If height isn't provided scale image according to ratio
			height = width * (img.height / img.width);
		}

		if (center === 'x' || center === 'both') {
			x = x - width / 2;
		}
		if (center === 'y' || center === 'both') {
			y = y - height / 2;
		}

		this.draws.push({
			type: 'img',
			img,
			src: { x: 0, y: 0, width: img.width, height: img.height },
			dest: { x, y, width, height }
		});
	}

	public draw() {
		for (const draw of this.draws) {
			if (draw.type === 'text') {
				this.ray.DrawText(draw.text, draw.pos.x, draw.pos.y, draw.size, draw.color);
			} else if (draw.type === 'img') {
				this.ray.DrawTexturePro(draw.img, draw.src, draw.dest, { x: 0, y: 0 }, 0, this.display.WHITE);
			} else if (draw.type === 'rect') {
				this.ray.DrawRectanglePro(draw.dest, { x: 0, y: 0 }, 0, draw.color);
			}
		}

		this.draws = [];
	}
}
