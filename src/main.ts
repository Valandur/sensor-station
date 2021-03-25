import { format } from 'date-fns';

import { Display } from './display';
import { Sensors } from './sensors';
import { Weather, Forecast } from './weather';

process.env['DISPLAY'] = ':0';

const WIDTH = 320;
const HEIGHT = 240;

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

let temp: number = null;
let rh: number = null;
let forecasts: Forecast[] = [];

const dataUpdateInterval = setInterval(() => {
	if (sensors.temperature) {
		temp = sensors.temperature;
	}
	if (sensors.humidity) {
		rh = sensors.humidity;
	}
	if (weather.forecasts && weather.forecasts.length > 0) {
		forecasts = weather.forecasts;
	}
}, 1000);

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
const TEMP_Y = 20;
const TEMP_SIZE = 100;

const RH_Y = 135;
const RH_SIZE = 100;

const formatTemp = (temp: number) => `${temp.toFixed(0)}°C`;
const formatRh = (rh: number) => `${rh}%`;

display.addScreen({
	render: (ray) => {
		const tempText = formatTemp(temp);
		const tempSize = ray.MeasureText(tempText, TEMP_SIZE);
		ray.DrawText(tempText, (WIDTH - tempSize) / 2, TEMP_Y, TEMP_SIZE, ray.GREEN);

		const rhText = formatRh(rh);
		const rhSize = ray.MeasureText(rhText, RH_SIZE);
		ray.DrawText(rhText, (WIDTH - rhSize) / 2, RH_Y, RH_SIZE, ray.BLUE);
	},
	canShow: () => temp !== null && rh !== null
});

// --------------
// Screen: Weather
// --------------
const WEATHER_X = WIDTH / 2;
const WEATHER_TIME_Y = 15;
const WEATHER_ICON_Y = 35;
const WEATHER_TEMP_Y = 180;
const WEATHER_SIZE = 45;

const texMap = new Map();

display.addScreen({
	render: (ray) => {
		for (let i = 0; i < forecasts.length; i++) {
			const f = forecasts[i];

			let tex = texMap.get(f.img);
			if (!tex) {
				tex = ray.LoadTexture(f.img);
				texMap.set(f.img, tex);
			}

			const timeText = format(f.time, 'HH:ss');
			const timeWidth = ray.MeasureText(timeText, WEATHER_SIZE);
			ray.DrawText(timeText, i * WEATHER_X + (WEATHER_X - timeWidth) / 2, WEATHER_TIME_Y, WEATHER_SIZE, ray.LIGHTGRAY);

			ray.DrawTexturePro(
				tex,
				{ x: 0, y: 0, width: tex.width, height: tex.height },
				{ x: i * WEATHER_X, y: WEATHER_ICON_Y, width: WEATHER_X, height: WEATHER_X },
				{ x: 0, y: 0 },
				0,
				ray.WHITE
			);

			const tempText = formatTemp(f.temp);
			const tempSize = ray.MeasureText(tempText, WEATHER_SIZE);
			ray.DrawText(tempText, i * WEATHER_X + (WEATHER_X - tempSize) / 2, WEATHER_TEMP_Y, WEATHER_SIZE, ray.GREEN);
		}
	},
	canShow: () => forecasts.length > 0
});

process.on('SIGINT', () => (display.shouldExit = true));

// --------------
// Main run loop
// --------------
display.init(WIDTH, HEIGHT);

display.render().finally(() => {
	console.log('cleaning up');

	clearInterval(dataUpdateInterval);

	display.dispose();
	sensors.dispose();
	weather.dispose();

	process.exit(0);
});
