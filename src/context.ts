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
	font: boolean;
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
	public drawText(
		text: string,
		x: number,
		y: number,
		width: number,
		height: number,
		size: number,
		color: Color,
		font?: boolean
	): void;
	public drawText(
		text: string,
		x: number,
		y: number,
		width: number,
		height: number,
		size?: number,
		color?: Color,
		font?: boolean
	) {
		if (!color && !size) {
			size = width;
			color = height;
			width = null;
			height = null;
		}

		let line = 0;

		while (text.length > 0) {
			// Gradually add more words until we either hit a new line or the max length
			let index = 0;
			let nextIndex = 0;
			let shouldBreak = false;
			do {
				index = nextIndex;
				if (shouldBreak || index >= text.length) {
					break;
				}
				let nextWord = text.indexOf(' ', index);
				let nextLine = text.indexOf('\n', index);
				if (nextLine !== -1 && (nextWord === -1 || nextLine < nextWord)) {
					nextIndex = nextLine + 1;
					shouldBreak = true;
				} else if (nextWord === -1) {
					nextIndex = text.length;
					shouldBreak = true;
				} else {
					nextIndex = nextWord + 1;
				}
			} while (!width || this.ray.MeasureText(text.substr(0, nextIndex), size) < width);

			this.draws.push({
				type: 'text',
				text: text.substr(0, index).trimEnd(),
				pos: { x, y: y + line * size },
				size,
				color,
				font
			});
			text = text.substr(index);
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

	public drawImage(
		path: string,
		x: number,
		y: number,
		width: number,
		height?: number,
		center?: 'x' | 'y' | 'both'
	): [number, number] {
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

		return [width, height];
	}

	public draw() {
		for (const draw of this.draws) {
			if (draw.type === 'text') {
				if (draw.font) {
					this.ray.DrawTextEx(this.display.font, draw.text, draw.pos, draw.size, 2, draw.color);
				} else {
					this.ray.DrawText(draw.text, draw.pos.x, draw.pos.y, draw.size, draw.color);
				}
			} else if (draw.type === 'img') {
				this.ray.DrawTexturePro(draw.img, draw.src, draw.dest, { x: 0, y: 0 }, 0, this.display.WHITE);
			} else if (draw.type === 'rect') {
				this.ray.DrawRectanglePro(draw.dest, { x: 0, y: 0 }, 0, draw.color);
			}
		}

		this.draws = [];
	}
}
