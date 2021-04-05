import { add, differenceInHours, format, isAfter, startOfDay } from 'date-fns';

import { Display } from './display';
import { Sensors } from './sensors';
import { Weather } from './weather';

process.env['DISPLAY'] = ':0';

const WIDTH = 320;
const HEIGHT = 240;

const formatTemp = (temp: number) => `${temp.toFixed(0)}°C`;
const formatRh = (rh: number) => `${rh}%`;

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
// Screen: Clock
// --------------
const TIME_Y = 15;
const TIME_SIZE = 120;

const DATE_Y = 155;
const DATE_SIZE = 80;

const formatTime = (date: Date) => format(date, 'HH:mm');
const formatDate = (date: Date) => format(date, 'dd.MM.yy');

display.addScreen({
	render: (ray) => {
		const now = new Date();

		const timeText = formatTime(now);
		const timeWidth = ray.MeasureText(timeText, TIME_SIZE);
		ray.DrawText(timeText, (WIDTH - timeWidth) / 2, TIME_Y, TIME_SIZE, ray.WHITE);

		const dateText = formatDate(now);
		const dateWidth = ray.MeasureText(dateText, DATE_SIZE);
		ray.DrawText(dateText, (WIDTH - dateWidth) / 2, DATE_Y, DATE_SIZE, ray.WHITE);
	}
});

// --------------
// Screen: Sensors
// --------------
/*
const TEMP_Y = 20;
const TEMP_SIZE = 100;

const RH_Y = 135;
const RH_SIZE = 100;

display.addScreen({
	render: (ray) => {
		const tempText = formatTemp(sensors.temperature);
		const tempSize = ray.MeasureText(tempText, TEMP_SIZE);
		ray.DrawText(tempText, (WIDTH - tempSize) / 2, TEMP_Y, TEMP_SIZE, ray.GREEN);

		const rhText = formatRh(sensors.humidity);
		const rhSize = ray.MeasureText(rhText, RH_SIZE);
		ray.DrawText(rhText, (WIDTH - rhSize) / 2, RH_Y, RH_SIZE, ray.BLUE);
	},
	canShow: () => sensors.temperature !== null && sensors.humidity !== null
});
*/
// --------------
// Screen: Weather
// --------------
type DateCompare = (now: Date, date: Date) => boolean;
const WEATHER_FORECASTS: DateCompare[] = [
	(now, date) => isAfter(date, now),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 1 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 2 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 3 })))
];
const WEATHER_PER_SCREEN = 2;
const WEATHER_TIME_Y = 15;
const WEATHER_ICON_Y = 40;
const WEATHER_TEMP_Y = 175;
const WEATHER_FONT_SIZE = 55;

const texMap = new Map();

for (let i = 0; i < WEATHER_FORECASTS.length; i += WEATHER_PER_SCREEN) {
	display.addScreen({
		render: (ray) => {
			const colWidth = WIDTH / WEATHER_PER_SCREEN;

			const now = new Date();
			const forecasts = WEATHER_FORECASTS.slice(i, i + WEATHER_PER_SCREEN)
				.map((dateCompare) => weather.forecasts.find((forecast) => dateCompare(now, forecast.time)))
				.filter((forecast) => !!forecast);

			for (let i = 0; i < forecasts.length; i++) {
				const forecast = forecasts[i];

				let tex = texMap.get(forecast.img);
				if (!tex) {
					tex = ray.LoadTexture(forecast.img);
					texMap.set(forecast.img, tex);
				}

				const dateFormat = differenceInHours(forecast.time, now) > 6 ? 'iii' : 'HH:mm';
				const dateText = format(forecast.time, dateFormat);
				const dateWidth = ray.MeasureText(dateText, WEATHER_FONT_SIZE);
				ray.DrawText(
					dateText,
					i * colWidth + (colWidth - dateWidth) / 2,
					WEATHER_TIME_Y,
					WEATHER_FONT_SIZE,
					ray.LIGHTGRAY
				);

				ray.DrawTexturePro(
					tex,
					{ x: 0, y: 0, width: tex.width, height: tex.height },
					{ x: i * colWidth, y: WEATHER_ICON_Y, width: colWidth, height: colWidth },
					{ x: 0, y: 0 },
					0,
					ray.WHITE
				);

				const tempText = formatTemp(forecast.feelsLike);
				const tempSize = ray.MeasureText(tempText, WEATHER_FONT_SIZE);
				ray.DrawText(tempText, i * colWidth + (colWidth - tempSize) / 2, WEATHER_TEMP_Y, WEATHER_FONT_SIZE, ray.GREEN);
			}
		},
		canShow: () => {
			const now = new Date();
			return (
				WEATHER_FORECASTS.slice(i, i + WEATHER_PER_SCREEN)
					.map((dateCompare) => weather.forecasts.find((forecast) => dateCompare(now, forecast.time)))
					.filter((forecast) => !!forecast).length > 0
			);
		}
	});
}

/*
display.addScreen({
	render: (ray) => {
		const colWidth = WIDTH / WEATHER_FORECASTS.length;

		const now = new Date();
		const forecasts = WEATHER_FORECASTS.map((dateCompare) =>
			weather.forecasts.find((forecast) => dateCompare(now, forecast.time))
		).filter((forecast) => !!forecast);

		for (let i = 0; i < forecasts.length; i++) {
			const forecast = forecasts[i];

			let tex = texMap.get(forecast.img);
			if (!tex) {
				tex = ray.LoadTexture(forecast.img);
				texMap.set(forecast.img, tex);
			}

			const timeText = format(forecast.time, 'HH:ss');
			const timeWidth = ray.MeasureText(timeText, WEATHER_FONT_SIZE);
			ray.DrawText(
				timeText,
				i * colWidth + (colWidth - timeWidth) / 2,
				WEATHER_TIME_Y,
				WEATHER_FONT_SIZE,
				ray.LIGHTGRAY
			);

			ray.DrawTexturePro(
				tex,
				{ x: 0, y: 0, width: tex.width, height: tex.height },
				{ x: i * colWidth, y: WEATHER_ICON_Y, width: colWidth, height: colWidth },
				{ x: 0, y: 0 },
				0,
				ray.WHITE
			);

			const tempText = formatTemp(forecast.feelsLike);
			const tempSize = ray.MeasureText(tempText, WEATHER_FONT_SIZE);
			ray.DrawText(tempText, i * colWidth + (colWidth - tempSize) / 2, WEATHER_TEMP_Y, WEATHER_FONT_SIZE, ray.GREEN);
		}
	},
	canShow: () => weather.forecasts.length > 0
});
*/

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
