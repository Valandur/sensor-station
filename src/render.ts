import { resolve } from 'path';

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

interface Color {}

interface Image {
	width: number;
	height: number;
}

export class RenderContext {
	public ray: any = null;
	public font: any = null;
	public imgCache: Map<string, Image> = new Map();

	public get WHITE(): Color {
		return this.ray.WHITE;
	}
	public get BLACK(): Color {
		return this.ray.BLACK;
	}
	public get ORANGE(): Color {
		return this.ray.ORANGE;
	}
	public get GREEN(): Color {
		return this.ray.GREEN;
	}
	public get BLUE(): Color {
		return this.ray.BLUE;
	}
	public get GRAY(): Color {
		return this.ray.GRAY;
	}
	public get LIGHTGRAY(): Color {
		return this.ray.LIGHTGRAY;
	}

	public draws: PreparedDraw[] = [];

	public constructor(ray: any) {
		this.ray = ray;
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
			x = x - img.width / 2;
		}
		if (center === 'y' || center === 'both') {
			y = y - img.height / 2;
		}

		this.draws.push({
			type: 'img',
			img,
			src: { x: 0, y: 0, width: img.width, height: img.height },
			dest: { x, y, width, height }
		});
	}

	public render() {
		for (const draw of this.draws) {
			if (draw.type === 'text') {
				this.ray.DrawTextEx(this.font, draw.text, draw.pos, draw.size, 2, draw.color);
			} else if (draw.type === 'img') {
				this.ray.DrawTexturePro(
					draw.img,
					{ x: 0, y: 0, width: draw.img.width, height: draw.img.height },
					{ x: draw.dest.x, y: 0, width: draw.dest.width, height: draw.dest.height },
					{ x: 0, y: 0 },
					0,
					this.WHITE
				);
			} else if (draw.type === 'rect') {
				this.ray.DrawRectanglePro(draw.dest, { x: 0, y: 0 }, draw.color);
			}
		}

		this.draws = [];
	}
}
