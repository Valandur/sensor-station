import { add, format, isAfter } from 'date-fns';

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
const WEATHER_HOURS = [{ hours: 2 }, { hours: 5 }];
const WEATHER_DAYS = [{ hours: 22 }, { hours: 46 }];
const WEATHER_X = WIDTH / WEATHER_HOURS.length;
const WEATHER_TIME_Y = 15;
const WEATHER_ICON_Y = 40;
const WEATHER_TEMP_Y = 175;
const WEATHER_FONT_SIZE = 55;

const texMap = new Map();

display.addScreen({
	render: (ray) => {
		const now = new Date();
		const forecasts = WEATHER_HOURS.map((time) => weather.forecasts.find((f) => isAfter(f.time, add(now, time))));

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
				i * WEATHER_X + (WEATHER_X - timeWidth) / 2,
				WEATHER_TIME_Y,
				WEATHER_FONT_SIZE,
				ray.LIGHTGRAY
			);

			ray.DrawTexturePro(
				tex,
				{ x: 0, y: 0, width: tex.width, height: tex.height },
				{ x: i * WEATHER_X, y: WEATHER_ICON_Y, width: WEATHER_X, height: WEATHER_X },
				{ x: 0, y: 0 },
				0,
				ray.WHITE
			);

			const tempText = formatTemp(forecast.feelsLike);
			const tempSize = ray.MeasureText(tempText, WEATHER_FONT_SIZE);
			ray.DrawText(tempText, i * WEATHER_X + (WEATHER_X - tempSize) / 2, WEATHER_TEMP_Y, WEATHER_FONT_SIZE, ray.GREEN);
		}
	},
	canShow: () => weather.forecasts.length > 0
});

display.addScreen({
	render: (ray) => {
		const now = new Date();
		const forecasts = WEATHER_DAYS.map((time) => weather.forecasts.find((f) => isAfter(f.time, add(now, time))));

		for (let i = 0; i < forecasts.length; i++) {
			const forecast = forecasts[i];

			let tex = texMap.get(forecast.img);
			if (!tex) {
				tex = ray.LoadTexture(forecast.img);
				texMap.set(forecast.img, tex);
			}

			const dayText = format(forecast.time, 'iii');
			const dayWidth = ray.MeasureText(dayText, WEATHER_FONT_SIZE);
			ray.DrawText(
				dayText,
				i * WEATHER_X + (WEATHER_X - dayWidth) / 2,
				WEATHER_TIME_Y,
				WEATHER_FONT_SIZE,
				ray.LIGHTGRAY
			);

			ray.DrawTexturePro(
				tex,
				{ x: 0, y: 0, width: tex.width, height: tex.height },
				{ x: i * WEATHER_X, y: WEATHER_ICON_Y, width: WEATHER_X, height: WEATHER_X },
				{ x: 0, y: 0 },
				0,
				ray.WHITE
			);

			const tempText = formatTemp(forecast.feelsLike);
			const tempSize = ray.MeasureText(tempText, WEATHER_FONT_SIZE);
			ray.DrawText(tempText, i * WEATHER_X + (WEATHER_X - tempSize) / 2, WEATHER_TEMP_Y, WEATHER_FONT_SIZE, ray.GREEN);
		}
	},
	canShow: () => weather.forecasts.length > 0
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
