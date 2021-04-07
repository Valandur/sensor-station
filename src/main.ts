import { add, format, isAfter, isSameDay, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';

import { Display } from './display';
import { News } from './news';
import { Sensors } from './sensors';
import { Weather } from './weather';

process.env['DISPLAY'] = ':0';

const WIDTH = 800;
const HEIGHT = 480;
const RATIO = WIDTH / HEIGHT;

// --------------
// Sensors
// --------------
console.log('sensors...');

const sensors = new Sensors();
sensors.init();

// --------------
// Weather
// --------------
console.log('weather...');

const weather = new Weather();
weather.init();

// --------------
// News
// --------------
console.log('news...');

const news = new News();
news.init();

// --------------
// Screens
// --------------
console.log('render...');

const display = new Display();

const formatTemp = (temp: number) => `${temp.toFixed(0)}°`;
const formatRh = (rh: number) => `${rh}%`;

// --------------
// Screen: General
// --------------
const TIME_Y = 15;
const TIME_X = TIME_Y * RATIO;
const TIME_SIZE = 180;

const DATE_Y = 20;
const DATE_X = DATE_Y * RATIO;
const DATE_SIZE = 100;

const YEAR_Y = 120;
const YEAR_X = DATE_Y * RATIO;
const YEAR_SIZE = 40;

const renderHeader = (ray: any, now: Date) => {
	const timeText = format(now, 'HH:mm');
	display.drawText(timeText, TIME_X, TIME_Y, TIME_SIZE, ray.ORANGE);

	const dateText = format(now, 'dd.MM');
	const dateWidth = ray.MeasureText(dateText, DATE_SIZE);
	display.drawText(dateText, WIDTH - DATE_X - dateWidth, DATE_Y, DATE_SIZE, ray.WHITE);

	const yearText = format(now, 'eee d. MMMM yyyy', { locale: de });
	const yearWidth = ray.MeasureText(yearText, YEAR_SIZE);
	display.drawText(yearText, WIDTH - YEAR_X - yearWidth, YEAR_Y, YEAR_SIZE, ray.WHITE);
};

// --------------
// Screen: Weather
// --------------
const TEMP_Y = 240;
const TEMP_SIZE = 90;

const RH_Y = 360;
const RH_SIZE = 90;

const WEATHER_X = WIDTH / 3;
const WEATHER_TIME_Y = 210;
const WEATHER_ICON_Y = 265;
const WEATHER_TEMP_Y = 400;
const WEATHER_FONT_SIZE = 60;

type DateCompare = (now: Date, date: Date) => boolean;
const WEATHER_FORECASTS: DateCompare[] = [
	(now, date) => isAfter(date, startOfDay(now)),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 1 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 2 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 3 })))
];
const weatherIconMap = new Map<string, any>();

display.addScreen({
	render: (ray) => {
		const now = new Date();

		renderHeader(ray, now);

		if (sensors.temperature !== null && sensors.humidity !== null) {
			const tempText = formatTemp(sensors.temperature);
			const tempWidth = ray.MeasureText(tempText, TEMP_SIZE);
			display.drawText(tempText, (WIDTH / 3 - tempWidth) / 2, TEMP_Y, TEMP_SIZE, ray.GREEN);

			const rhText = formatRh(sensors.humidity);
			const rhWidth = ray.MeasureText(rhText, RH_SIZE);
			display.drawText(rhText, (WIDTH / 3 - rhWidth) / 2, RH_Y, RH_SIZE, ray.BLUE);
		}

		const forecasts = WEATHER_FORECASTS.map((dateCompare) =>
			weather.forecasts.find((forecast) => dateCompare(now, forecast.time))
		).filter((forecast) => !!forecast);

		const colWidth = (WIDTH - WEATHER_X) / forecasts.length;

		for (let i = 0; i < forecasts.length; i++) {
			const forecast = forecasts[i];

			let tex = weatherIconMap.get(forecast.img);
			if (!tex) {
				tex = ray.LoadTexture(forecast.img);
				weatherIconMap.set(forecast.img, tex);
			}

			const dateText = isSameDay(forecast.time, now) ? 'Now' : format(forecast.time, 'iiiiii', { locale: de });
			const dateWidth = ray.MeasureText(dateText, WEATHER_FONT_SIZE);
			display.drawText(
				dateText,
				WEATHER_X + i * colWidth + (colWidth - dateWidth) / 2,
				WEATHER_TIME_Y,
				WEATHER_FONT_SIZE,
				ray.LIGHTGRAY
			);

			ray.DrawTexturePro(
				tex,
				{ x: 0, y: 0, width: tex.width, height: tex.height },
				{ x: WEATHER_X + i * colWidth, y: WEATHER_ICON_Y, width: colWidth, height: colWidth },
				{ x: 0, y: 0 },
				0,
				ray.WHITE
			);

			const tempText = formatTemp(forecast.feelsLike);
			const tempSize = ray.MeasureText(tempText, WEATHER_FONT_SIZE);
			display.drawText(
				tempText,
				WEATHER_X + i * colWidth + (colWidth - tempSize) / 2,
				WEATHER_TEMP_Y,
				WEATHER_FONT_SIZE,
				ray.GREEN
			);
		}
	}
});

// --------------
// Screen: News
// --------------
const NEWS_Y = 200;
const NEWS_X = 15 * RATIO;
const NEWS_TITLE_X = 150;
const NEWS_SIZE = 36;
const NEWS_DESC_SIZE = 34;
const NEWS_DESC_X = 200;
const NEWS_ITEMS = 3;
const NEWS_HEIGHT = 90;

let itemIndex = -1;
const newsImgMap = new Map();

display.addScreen({
	render: (ray) => {
		const now = new Date();

		renderHeader(ray, now);

		if (itemIndex >= 0) {
			const item = news.general[itemIndex];
			display.drawText(item.title, NEWS_X, NEWS_Y, WIDTH - 2 * NEWS_X, NEWS_HEIGHT, NEWS_SIZE, ray.BLUE);
			display.drawText(
				format(item.date, 'eee HH:mm', { locale: de }),
				NEWS_X,
				NEWS_Y + NEWS_HEIGHT,
				NEWS_SIZE,
				ray.GRAY
			);
			display.drawText(
				item.description,
				NEWS_DESC_X,
				NEWS_Y + NEWS_HEIGHT,
				WIDTH - 2 * NEWS_X - NEWS_DESC_X,
				HEIGHT - 15 - NEWS_Y,
				NEWS_DESC_SIZE,
				ray.WHITE
			);

			let tex = newsImgMap.get(item.img);
			if (!tex) {
				tex = ray.LoadTexture(item.img);
				newsImgMap.set(item.img, tex);
			}

			const width = NEWS_DESC_X - 2 * NEWS_X;
			ray.DrawTexturePro(
				tex,
				{ x: 0, y: 0, width: tex.width, height: tex.height },
				{ x: NEWS_X, y: NEWS_Y + 1.5 * NEWS_HEIGHT, width: width, height: width * (tex.height / tex.width) },
				{ x: 0, y: 0 },
				0,
				ray.WHITE
			);
		} else {
			const items = news.general.slice(0, NEWS_ITEMS);

			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const y = NEWS_Y + i * NEWS_HEIGHT;

				let tex = newsImgMap.get(item.img);
				if (!tex) {
					tex = ray.LoadTexture(item.img);
					newsImgMap.set(item.img, tex);
				}

				const width = NEWS_TITLE_X - 2 * NEWS_X;
				ray.DrawTexturePro(
					tex,
					{ x: 0, y: 0, width: tex.width, height: tex.height },
					{ x: NEWS_X, y: y + 6, width: width, height: width * (tex.height / tex.width) },
					{ x: 0, y: 0 },
					0,
					ray.WHITE
				);
				display.drawText(item.title, NEWS_TITLE_X, y, WIDTH - NEWS_X - NEWS_TITLE_X, NEWS_HEIGHT, NEWS_SIZE, ray.WHITE);
			}
		}
	},
	onTap: ({ x, y }) => {
		if (itemIndex >= 0) {
			itemIndex = -1;
			display.startScreenTimeout();
			return;
		}

		for (let i = 0; i < NEWS_ITEMS; i++) {
			if (
				x >= NEWS_X &&
				x <= NEWS_X + WIDTH - 2 * NEWS_X &&
				y >= NEWS_Y + i * NEWS_HEIGHT &&
				y < NEWS_Y + (i + 1) * NEWS_HEIGHT
			) {
				itemIndex = i;
				display.stopScreenTimeout();
				return;
			}
		}
	}
});

display.addScreen({
	render: (ray) => {
		const now = new Date();

		renderHeader(ray, now);

		if (itemIndex >= 0) {
			const item = news.sport[itemIndex];
			display.drawText(item.title, NEWS_X, NEWS_Y, WIDTH - 2 * NEWS_X, NEWS_HEIGHT, NEWS_SIZE, ray.BLUE);
			display.drawText(
				format(item.date, 'eee HH:mm', { locale: de }),
				NEWS_X,
				NEWS_Y + NEWS_HEIGHT,
				NEWS_SIZE,
				ray.GRAY
			);
			display.drawText(
				item.description,
				NEWS_DESC_X,
				NEWS_Y + NEWS_HEIGHT,
				WIDTH - 2 * NEWS_X - NEWS_DESC_X,
				HEIGHT - 15 - NEWS_Y,
				NEWS_DESC_SIZE,
				ray.WHITE
			);

			let tex = newsImgMap.get(item.img);
			if (!tex) {
				tex = ray.LoadTexture(item.img);
				newsImgMap.set(item.img, tex);
			}

			const width = NEWS_DESC_X - 2 * NEWS_X;
			ray.DrawTexturePro(
				tex,
				{ x: 0, y: 0, width: tex.width, height: tex.height },
				{ x: NEWS_X, y: NEWS_Y + 1.5 * NEWS_HEIGHT, width: width, height: width * (tex.height / tex.width) },
				{ x: 0, y: 0 },
				0,
				ray.WHITE
			);
		} else {
			const items = news.sport.slice(0, NEWS_ITEMS);

			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const y = NEWS_Y + i * NEWS_HEIGHT;

				let tex = newsImgMap.get(item.img);
				if (!tex) {
					tex = ray.LoadTexture(item.img);
					newsImgMap.set(item.img, tex);
				}

				const width = NEWS_TITLE_X - 2 * NEWS_X;
				ray.DrawTexturePro(
					tex,
					{ x: 0, y: 0, width: tex.width, height: tex.height },
					{ x: NEWS_X, y: y + 6, width: width, height: width * (tex.height / tex.width) },
					{ x: 0, y: 0 },
					0,
					ray.WHITE
				);
				display.drawText(item.title, NEWS_TITLE_X, y, WIDTH - NEWS_X - NEWS_TITLE_X, NEWS_HEIGHT, NEWS_SIZE, ray.WHITE);
			}
		}
	},
	onTap: ({ x, y }) => {
		if (itemIndex >= 0) {
			itemIndex = -1;
			display.startScreenTimeout();
			return;
		}

		for (let i = 0; i < NEWS_ITEMS; i++) {
			if (
				x >= NEWS_X &&
				x <= NEWS_X + WIDTH - 2 * NEWS_X &&
				y >= NEWS_Y + i * NEWS_HEIGHT &&
				y < NEWS_Y + (i + 1) * NEWS_HEIGHT
			) {
				itemIndex = i;
				display.stopScreenTimeout();
				return;
			}
		}
	}
});

// --------------
// Main run loop
// --------------
display.init(WIDTH, HEIGHT);

process.on('SIGINT', () => (display.shouldExit = true));

display
	.render()
	.catch((err) => console.error(err))
	.finally(() => {
		console.log('cleaning up');

		display.dispose();
		sensors.dispose();
		weather.dispose();

		process.exit(0);
	});
