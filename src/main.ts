import { add, format, isAfter, isSameDay, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';

import { Display } from './display';
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
// Screens
// --------------
console.log('render...');

const display = new Display();

// --------------
// Screen: Main
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

const TEMP_Y = 240;
const TEMP_SIZE = 90;

const RH_Y = 360;
const RH_SIZE = 90;

const WEATHER_X = WIDTH / 3;
const WEATHER_TIME_Y = 220;
const WEATHER_ICON_Y = 265;
const WEATHER_TEMP_Y = 400;
const WEATHER_FONT_SIZE = 60;

const formatTime = (date: Date) => format(date, 'HH:mm');
const formatDate = (date: Date) => format(date, 'dd.MM');
const formatTemp = (temp: number) => `${temp.toFixed(0)}°`;
const formatRh = (rh: number) => `${rh}%`;

type DateCompare = (now: Date, date: Date) => boolean;
const WEATHER_FORECASTS: DateCompare[] = [
	(now, date) => isAfter(date, startOfDay(now)),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 1 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 2 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 3 })))
];
const texMap = new Map();

display.addScreen({
	render: (ray) => {
		const now = new Date();

		const timeText = formatTime(now);
		ray.DrawText(timeText, TIME_X, TIME_Y, TIME_SIZE, ray.ORANGE);

		const dateText = formatDate(now);
		const dateWidth = ray.MeasureText(dateText, DATE_SIZE);
		ray.DrawText(dateText, WIDTH - DATE_X - dateWidth, DATE_Y, DATE_SIZE, ray.WHITE);

		const yearText = format(now, 'E e. MMMM yyyy', { locale: de });
		const yearWidth = ray.MeasureText(yearText, YEAR_SIZE);
		ray.DrawText(yearText, WIDTH - YEAR_X - yearWidth, YEAR_Y, YEAR_SIZE, ray.WHITE);

		if (sensors.temperature !== null && sensors.humidity !== null) {
			const tempText = formatTemp(sensors.temperature);
			const tempWidth = ray.MeasureText(tempText, TEMP_SIZE);
			ray.DrawText(tempText, (WIDTH / 3 - tempWidth) / 2, TEMP_Y, TEMP_SIZE, ray.GREEN);

			const rhText = formatRh(sensors.humidity);
			const rhWidth = ray.MeasureText(rhText, RH_SIZE);
			ray.DrawText(rhText, (WIDTH / 3 - rhWidth) / 2, RH_Y, RH_SIZE, ray.BLUE);
		}

		const forecasts = WEATHER_FORECASTS.map((dateCompare) =>
			weather.forecasts.find((forecast) => dateCompare(now, forecast.time))
		).filter((forecast) => !!forecast);

		const colWidth = (WIDTH - WEATHER_X) / forecasts.length;

		for (let i = 0; i < forecasts.length; i++) {
			const forecast = forecasts[i];

			let tex = texMap.get(forecast.img);
			if (!tex) {
				tex = ray.LoadTexture(forecast.img);
				texMap.set(forecast.img, tex);
			}

			const dateText = isSameDay(forecast.time, now) ? 'Now' : format(forecast.time, 'iiiiii', { locale: de });
			const dateWidth = ray.MeasureText(dateText, WEATHER_FONT_SIZE);
			ray.DrawText(
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
			ray.DrawText(
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
