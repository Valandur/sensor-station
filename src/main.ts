import { add, format, isAfter, isSameDay, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';

import { Display } from './display';
import { FeedItem, News } from './news';
import { Printer } from './printer';
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
// Printer
// --------------
console.log('printer...');

const printer = new Printer();
printer.init();

// --------------
// Screens
// --------------
console.log('render...');

const display = new Display();

const formatTemp = (temp: number) => `${temp.toFixed(0)}°`;
const formatRh = (rh: number) => `${rh}%`;

// --------------
// Screen: Header
// --------------
const TIME_Y = 15;
const TIME_X = 15 * RATIO;
const TIME_SIZE = 180;

const DATE_Y = 30;
const DATE_X = 500;
const DATE_SIZE = 80;

const YEAR_Y = 120;
const YEAR_X = 500;
const YEAR_SIZE = 40;

const prepareHeader = (now?: Date) => {
	if (!now) {
		now = new Date();
	}

	const time = format(now, 'HH:mm');
	const date = format(now, 'dd. MMM', { locale: de });
	const dateSub = format(now, 'eeee', { locale: de });
	return { time, date, dateSub };
};

const renderHeader = (ray: any, { time, date, dateSub }: { time: string; date: string; dateSub: string }) => {
	display.drawText(time, TIME_X, TIME_Y, TIME_SIZE, ray.ORANGE);
	display.drawText(date, DATE_X, DATE_Y, DATE_SIZE, ray.WHITE);
	display.drawText(dateSub, YEAR_X, YEAR_Y, YEAR_SIZE, ray.WHITE);
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

/*display.addScreen({
	render: (ray) => {
		const header = prepareHeader();

		ray.BeginDrawing();
		ray.ClearBackground(ray.BLACK);

		renderHeader(ray, header);

		display.drawScreenSwitcher();
		ray.EndDrawing();
	}
});*/

let isPaused = false;
display.addScreen({
	render: (ray) => {
		const now = new Date();
		const header = prepareHeader(now);

		const sensorTempText = formatTemp(sensors.temperature || 0);
		const sensorTempWidth = ray.MeasureText(sensorTempText, TEMP_SIZE);

		const sensorRhText = formatRh(sensors.humidity || 0);
		const sensorRhWidth = ray.MeasureText(sensorRhText, RH_SIZE);

		const forecasts = WEATHER_FORECASTS.map((dateCompare) =>
			weather.forecasts.find((forecast) => dateCompare(now, forecast.time))
		).filter((forecast) => !!forecast);

		const colWidth = (WIDTH - WEATHER_X) / forecasts.length;

		const forecastDraws: [any, string, number, string, number][] = [];
		for (let i = 0; i < forecasts.length; i++) {
			const forecast = forecasts[i];

			let tex = weatherIconMap.get(forecast.img);
			if (!tex) {
				tex = ray.LoadTexture(forecast.img);
				weatherIconMap.set(forecast.img, tex);
			}

			const dateText = isSameDay(forecast.time, now) ? 'Now' : format(forecast.time, 'iiiiii', { locale: de });
			const dateWidth = ray.MeasureText(dateText, WEATHER_FONT_SIZE);

			const tempText = formatTemp(forecast.feelsLike);
			const tempWidth = ray.MeasureText(tempText, WEATHER_FONT_SIZE);

			forecastDraws.push([tex, dateText, dateWidth, tempText, tempWidth]);
		}

		ray.BeginDrawing();
		ray.ClearBackground(ray.BLACK);

		renderHeader(ray, header);

		if (sensors.temperature !== null && sensors.humidity !== null) {
			display.drawText(sensorTempText, (WIDTH / 3 - sensorTempWidth) / 2, TEMP_Y, TEMP_SIZE, ray.GREEN);
			display.drawText(sensorRhText, (WIDTH / 3 - sensorRhWidth) / 2, RH_Y, RH_SIZE, ray.BLUE);
		}

		for (let i = 0; i < forecastDraws.length; i++) {
			const draw = forecastDraws[i];

			display.drawText(
				draw[1],
				WEATHER_X + i * colWidth + (colWidth - draw[2]) / 2,
				WEATHER_TIME_Y,
				WEATHER_FONT_SIZE,
				ray.LIGHTGRAY
			);

			ray.DrawTexturePro(
				draw[0],
				{ x: 0, y: 0, width: draw[0].width, height: draw[0].height },
				{ x: WEATHER_X + i * colWidth, y: WEATHER_ICON_Y, width: colWidth, height: colWidth },
				{ x: 0, y: 0 },
				0,
				ray.WHITE
			);

			display.drawText(
				draw[3],
				WEATHER_X + i * colWidth + (colWidth - draw[4]) / 2,
				WEATHER_TEMP_Y,
				WEATHER_FONT_SIZE,
				ray.GREEN
			);
		}

		display.drawScreenSwitcher();
		ray.EndDrawing();
	},
	onTap: ({ x, y }) => {
		if (isPaused) {
			isPaused = false;
			display.startScreenTimeout();
		} else {
			isPaused = true;
			display.stopScreenTimeout();
		}
	}
});

// --------------
// Screen: News
// --------------
const NEWS_Y = 200;
const NEWS_X = 15 * RATIO;
const NEWS_TITLE_X = 230;
const NEWS_SIZE = 42;
const NEWS_DESC_SIZE = 34;
const NEWS_DESC_X = 200;
const NEWS_ITEMS = 2;
const NEWS_HEIGHT = 140;

const newsImgMap = new Map();

let newsModifier = 0;
let newsGeneralItem: FeedItem = null;
display.addScreen({
	render: (ray) => {
		const header = prepareHeader();

		const items = news.general.slice(newsModifier * NEWS_ITEMS, (newsModifier + 1) * NEWS_ITEMS);

		const newsDraws: [any, string][] = [];
		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			let tex = newsImgMap.get(item.img);
			if (!tex) {
				tex = ray.LoadTexture(item.img);
				newsImgMap.set(item.img, tex);
			}

			newsDraws.push([tex, item.title]);
		}

		ray.BeginDrawing();
		ray.ClearBackground(ray.BLACK);

		renderHeader(ray, header);

		if (newsGeneralItem != null) {
			display.drawText(newsGeneralItem.title, NEWS_X, NEWS_Y, WIDTH - 2 * NEWS_X, NEWS_HEIGHT, NEWS_SIZE, ray.BLUE);
			display.drawText(
				format(newsGeneralItem.date, 'eee HH:mm', { locale: de }),
				NEWS_X,
				NEWS_Y + NEWS_HEIGHT,
				NEWS_SIZE,
				ray.GRAY
			);
			display.drawText(
				newsGeneralItem.description,
				NEWS_DESC_X,
				NEWS_Y + NEWS_HEIGHT,
				WIDTH - 2 * NEWS_X - NEWS_DESC_X,
				HEIGHT - 15 - NEWS_Y,
				NEWS_DESC_SIZE,
				ray.WHITE
			);

			let tex = newsImgMap.get(newsGeneralItem.img);
			if (!tex) {
				tex = ray.LoadTexture(newsGeneralItem.img);
				newsImgMap.set(newsGeneralItem.img, tex);
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
			for (let i = 0; i < newsDraws.length; i++) {
				const draw = newsDraws[i];
				const y = NEWS_Y + i * NEWS_HEIGHT;

				const width = NEWS_TITLE_X - 2 * NEWS_X;
				ray.DrawTexturePro(
					draw[0],
					{ x: 0, y: 0, width: draw[0].width, height: draw[0].height },
					{ x: NEWS_X, y: y + 6, width: width, height: width * (draw[0].height / draw[0].width) },
					{ x: 0, y: 0 },
					0,
					ray.WHITE
				);
				display.drawText(draw[1], NEWS_TITLE_X, y, WIDTH - NEWS_X - NEWS_TITLE_X, NEWS_HEIGHT, NEWS_SIZE, ray.WHITE);
			}
		}

		display.drawScreenSwitcher();
		ray.EndDrawing();
	},
	onTap: ({ x, y }) => {
		if (newsGeneralItem != null) {
			newsGeneralItem = null;
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
				newsGeneralItem = news.general[i];
				display.stopScreenTimeout();
				return;
			}
		}

		newsModifier++;
		if (newsModifier * NEWS_ITEMS >= news.general.length) {
			newsModifier = 0;
		}
	},
	onShow: () => {
		newsModifier++;
		if (newsModifier * NEWS_ITEMS >= news.general.length) {
			newsModifier = 0;
		}
	}
});

// --------------
// Screen: Printer
// --------------
const PROGRESS_Y = 190;
const PROGRESS_X = 15 * RATIO;
const PROGRESS_WIDTH = WIDTH - 2 * PROGRESS_X;
const PROGRESS_HEIGHT = 16;
const PROGRESS_SIZE = 50;

const IMAGE_Y = 210;
const IMAGE_HEIGHT = HEIGHT - IMAGE_Y - 15;

let printerTex: any;

display.addScreen({
	render: (ray) => {
		const header = prepareHeader();

		ray.BeginDrawing();
		ray.ClearBackground(ray.BLACK);

		renderHeader(ray, header);

		if (!printerTex || printer.imageChanged) {
			printerTex = ray.LoadTexture(printer.imagePath);
			printer.imageChanged = false;
		}

		display.drawText(`${printer.progress}%`, PROGRESS_X, IMAGE_Y, PROGRESS_SIZE, ray.BLUE);

		ray.DrawRectangle(PROGRESS_X, PROGRESS_Y, PROGRESS_WIDTH, PROGRESS_HEIGHT, ray.WHITE);
		ray.DrawRectangle(PROGRESS_X, PROGRESS_Y, PROGRESS_WIDTH * (printer.progress / 100), PROGRESS_HEIGHT, ray.BLUE);

		const imgWidth = IMAGE_HEIGHT * (printerTex.width / printerTex.height);
		ray.DrawTexturePro(
			printerTex,
			{ x: 0, y: 0, width: printerTex.width, height: printerTex.height },
			{ x: (WIDTH - imgWidth) / 2, y: IMAGE_Y, width: imgWidth, height: IMAGE_HEIGHT },
			{ x: 0, y: 0 },
			0,
			ray.WHITE
		);

		display.drawScreenSwitcher();
		ray.EndDrawing();
	},
	canShow: () => printer.building
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
