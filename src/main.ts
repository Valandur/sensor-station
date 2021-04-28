import { add, format, isAfter, isSameDay, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';

import { Display } from './display';
import { FeedItem, News } from './news';
import { Printer } from './printer';
import { RenderContext } from './render';
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

const renderHeader = (ctx: RenderContext, now?: Date) => {
	if (!now) {
		now = new Date();
	}

	const time = format(now, 'HH:mm');
	ctx.drawText(time, TIME_X, TIME_Y, TIME_SIZE, ctx.ORANGE);

	const date = format(now, 'dd. MMM', { locale: de });
	ctx.drawText(date, DATE_X, DATE_Y, DATE_SIZE, ctx.WHITE);

	const dateSub = format(now, 'eeee', { locale: de });
	ctx.drawText(dateSub, YEAR_X, YEAR_Y, YEAR_SIZE, ctx.WHITE);
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

let isPaused = false;
display.addScreen({
	render: (ctx) => {
		const now = new Date();

		renderHeader(ctx, now);

		if (sensors.temperature !== null && sensors.humidity !== null) {
			const sensorTempText = formatTemp(sensors.temperature || 0);
			const sensorTempWidth = ctx.measureText(sensorTempText, TEMP_SIZE);
			ctx.drawText(sensorTempText, (WIDTH / 3 - sensorTempWidth) / 2, TEMP_Y, TEMP_SIZE, ctx.GREEN);

			const sensorRhText = formatRh(sensors.humidity || 0);
			const sensorRhWidth = ctx.measureText(sensorRhText, RH_SIZE);
			ctx.drawText(sensorRhText, (WIDTH / 3 - sensorRhWidth) / 2, RH_Y, RH_SIZE, ctx.BLUE);
		}

		const forecasts = WEATHER_FORECASTS.map((dateCompare) =>
			weather.forecasts.find((forecast) => dateCompare(now, forecast.time))
		).filter((forecast) => !!forecast);

		const colWidth = (WIDTH - WEATHER_X) / forecasts.length;

		for (let i = 0; i < forecasts.length; i++) {
			const forecast = forecasts[i];

			const dateText = isSameDay(forecast.time, now) ? 'Now' : format(forecast.time, 'iiiiii', { locale: de });
			const dateWidth = ctx.measureText(dateText, WEATHER_FONT_SIZE);
			ctx.drawText(
				dateText,
				WEATHER_X + i * colWidth + (colWidth - dateWidth) / 2,
				WEATHER_TIME_Y,
				WEATHER_FONT_SIZE,
				ctx.LIGHTGRAY
			);

			ctx.drawImage(forecast.img, WEATHER_X + i * colWidth, WEATHER_ICON_Y, colWidth, colWidth);

			const tempText = formatTemp(forecast.feelsLike);
			const tempWidth = ctx.measureText(tempText, WEATHER_FONT_SIZE);
			ctx.drawText(
				tempText,
				WEATHER_X + i * colWidth + (colWidth - tempWidth) / 2,
				WEATHER_TEMP_Y,
				WEATHER_FONT_SIZE,
				ctx.GREEN
			);
		}
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
	render: (ctx) => {
		renderHeader(ctx);

		if (newsGeneralItem != null) {
			ctx.drawText(newsGeneralItem.title, NEWS_X, NEWS_Y, WIDTH - 2 * NEWS_X, NEWS_HEIGHT, NEWS_SIZE, ray.BLUE);
			ctx.drawText(
				format(newsGeneralItem.date, 'eee HH:mm', { locale: de }),
				NEWS_X,
				NEWS_Y + NEWS_HEIGHT,
				NEWS_SIZE,
				ray.GRAY
			);
			ctx.drawText(
				newsGeneralItem.description,
				NEWS_DESC_X,
				NEWS_Y + NEWS_HEIGHT,
				WIDTH - 2 * NEWS_X - NEWS_DESC_X,
				HEIGHT - 15 - NEWS_Y,
				NEWS_DESC_SIZE,
				ray.WHITE
			);

			const width = NEWS_DESC_X - 2 * NEWS_X;
			ctx.drawImage(newsGeneralItem.img, NEWS_X, NEWS_Y + 1.5 * NEWS_HEIGHT, width);
		} else {
			const items = news.general.slice(newsModifier * NEWS_ITEMS, (newsModifier + 1) * NEWS_ITEMS);

			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const y = NEWS_Y + i * NEWS_HEIGHT;

				const width = NEWS_TITLE_X - 2 * NEWS_X;
				ctx.drawImage(item.img, NEWS_X, y + 6, width);
				ctx.drawText(item.title, NEWS_TITLE_X, y, WIDTH - NEWS_X - NEWS_TITLE_X, NEWS_HEIGHT, NEWS_SIZE, ray.WHITE);
			}
		}
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

display.addScreen({
	render: (ctx) => {
		renderHeader(ctx);

		ctx.drawText(`${printer.progress}%`, PROGRESS_X, IMAGE_Y, PROGRESS_SIZE, ray.BLUE);

		ctx.drawRectangle(PROGRESS_X, PROGRESS_Y, PROGRESS_WIDTH, PROGRESS_HEIGHT, ray.WHITE);
		ctx.drawRectangle(PROGRESS_X, PROGRESS_Y, PROGRESS_WIDTH * (printer.progress / 100), PROGRESS_HEIGHT, ray.BLUE);

		ctx.drawImage(printer.imagePath, WIDTH / 2, IMAGE_Y, null, IMAGE_HEIGHT, 'x');
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
