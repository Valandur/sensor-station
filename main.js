const dht = require('node-dht-sensor').promises;
const ray = require('raylib');
const { format } = require('date-fns');
const axios = require('axios');
const fs = require('fs');
const Gpio = require('onoff').Gpio;

const DHT_TYPE = 11;
const DHT_PIN = 17;

const WEATHER_API_KEY = '05a064328a46dbcf8d1c402a33567d86';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/forecast?mode=json&lang=en&units=metric';
const WEATHER_CITY_ID = 2657896; // Zürich
const WEATHER_FORECASTS = 2;

const WIDTH = 320;
const HEIGHT = 240;

const GESTURE_TAP = 1;
const GESTURE_SWIPE_RIGHT = 16;
const GESTURE_SWIPE_LEFT = 32;

const SCREEN_DATETIME = 0;
const SCREEN_SENSOR = 1;
const SCREEN_WEATHER = 2;
const SCREEN_AUTO_TIME = 20000;
const NUM_SCREENS = 3;

const TIME_X = 15;
const TIME_Y = 15;
const TIME_SIZE = 130;

const DATE_X = 15;
const DATE_Y = 155;
const DATE_SIZE = 80;

const TEMP_X = 15;
const TEMP_Y = 20;
const TEMP_SIZE = 100;

const RH_X = 15;
const RH_Y = 140;
const RH_SIZE = 100;

const WEATHER_X = -10;
const WEATHER_TIME_Y = 15;
const WEATHER_ICON_Y = 20;
const WEATHER_TEMP_Y = 190;
const WEATHER_SIZE = 45;

// --------------
// DHT Sensor
// --------------
let tempC = null;
let rh = null;
const updateDHT = async () => {
	try {
		const res = await dht.read(DHT_TYPE, DHT_PIN);
		tempC = res.temperature;
		rh = res.humidity;
		lastErr = null;
	} catch (err) {
		console.error(new Date(), err);
	}
};

setTimeout(updateDHT, 1);
const dhtInterval = setInterval(updateDHT, 1000);

// --------------
// Weather
// --------------
let weatherForecast = [];
if (!fs.existsSync(`data`)) {
	fs.mkdirSync(`data`);
}
const updateWeather = async () => {
	const { data } = await axios(`${WEATHER_URL}&id=${WEATHER_CITY_ID}&APPID=${WEATHER_API_KEY}`);

	weatherForecast = [];
	for (let i = 0; i < WEATHER_FORECASTS; i++) {
		const forecast = data.list[i];
		const weather = forecast.weather[0];
		const imgPath = `data/${weather.icon}.png`;

		if (fs.existsSync(imgPath)) {
			weatherImg = imgPath;
		} else {
			const writer = fs.createWriteStream(imgPath);
			const img = await axios({
				method: 'GET',
				url: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
				responseType: 'stream'
			});
			img.data.pipe(writer);
			await new Promise((resolve, reject) => {
				writer.on('finish', resolve);
				writer.on('error', reject);
			});
			weatherImg = imgPath;
		}

		weatherForecast.push({
			time: new Date(forecast.dt * 1000),
			img: imgPath,
			temp: forecast.main.temp
		});
	}
};

setTimeout(updateWeather, 1);
const weatherInterval = setInterval(updateWeather, 60000);

// --------------
// Buttons
// --------------
const buttonPrev = new Gpio(22, 'in', 'both', { activeLow: true });
buttonPrev.watch((err, value) => (value === 1 ? nextScreen() : null));

const buttonNext = new Gpio(23, 'in', 'both', { activeLow: true });
buttonNext.watch((err, value) => (value === 1 ? prevScreen() : null));

// --------------
// Screens
// --------------
process.env['DISPLAY'] = ':0';

ray.InitWindow(WIDTH, HEIGHT, 'main');
ray.SetTargetFPS(10);
ray.SetGesturesEnabled(GESTURE_TAP | GESTURE_SWIPE_RIGHT | GESTURE_SWIPE_LEFT);

let tapTimeout = null;

let screen = 0;
const incScreen = () => (screen = (screen + 1) % NUM_SCREENS);
const decScreen = () => (screen = screen === 0 ? NUM_SCREENS - 1 : screen - 1);
const isValidScreen = () => {
	switch (screen) {
		case SCREEN_SENSOR:
			if (tempC === null || rh === null) {
				return false;
			}
			break;

		case SCREEN_WEATHER:
			if (weatherForecast.length === 0) {
				return false;
			}
			break;

		default:
			break;
	}

	return true;
};
const nextScreen = () => {
	do {
		incScreen();
	} while (!isValidScreen());

	if (screenTimeout) {
		clearTimeout(screenTimeout);
	}
	screenTimeout = setTimeout(nextScreen, SCREEN_AUTO_TIME);
};
const prevScreen = () => {
	do {
		decScreen();
	} while (!isValidScreen());

	if (screenTimeout) {
		clearTimeout(screenTimeout);
	}
	screenTimeout = setTimeout(nextScreen, SCREEN_AUTO_TIME);
};
let screenTimeout = setTimeout(nextScreen, SCREEN_AUTO_TIME);

// Screens all
const formatTime = () => format(new Date(), 'HH:mm');
const formatDate = () => format(new Date(), 'dd.MM.yy');

// Screens sensor
let showC = true;
const celsiusToFahrentheit = (tempC) => (tempC * 9) / 5 + 32;
const formatTemp = (tempC) => (showC ? `${tempC.toFixed(0)}°C` : `${celsiusToFahrentheit(tempC).toFixed(0)}°F`);
const formatRh = (rh) => `${rh}%`;

// Screens weather
const texMap = new Map();

const render = async () => {
	while (!ray.WindowShouldClose()) {
		const gesture = ray.GetGestureDetected();
		if (gesture === GESTURE_TAP) {
			const { x, y } = ray.GetTouchPosition(0);
			if (x >= TEMP_X && x <= RH_X / 2 && y >= TEMP_Y && y <= TEMP_Y + FONT_SIZE) {
				tapTimeout = setTimeout(() => (showC = !showC), 200);
			}
		} else if (gesture === GESTURE_SWIPE_RIGHT) {
			clearTimeout(tapTimeout);
			prevScreen();
		} else if (gesture === GESTURE_SWIPE_LEFT) {
			clearTimeout(tapTimeout);
			nextScreen();
		}

		ray.BeginDrawing();
		ray.ClearBackground(ray.BLACK);

		if (screen === SCREEN_DATETIME) {
			ray.DrawText(formatTime(), TIME_X, TIME_Y, TIME_SIZE, ray.WHITE);
			ray.DrawText(formatDate(), DATE_X, DATE_Y, DATE_SIZE, ray.WHITE);
		} else if (screen === SCREEN_SENSOR) {
			ray.DrawText(formatTemp(tempC), TEMP_X, TEMP_Y, TEMP_SIZE, ray.GREEN);
			ray.DrawText(formatRh(rh), RH_X, RH_Y, RH_SIZE, ray.BLUE);
		} else if (screen === SCREEN_WEATHER) {
			for (let i = 0; i < weatherForecast.length; i++) {
				const f = weatherForecast[i];

				let tex = texMap.get(f.img);
				if (!tex) {
					tex = ray.LoadTexture(f.img);
					texMap.set(f.img, tex);
				}

				ray.DrawTextureEx(tex, { x: WEATHER_X + i * 150, y: WEATHER_ICON_Y }, 0, 1, ray.WHITE);
				ray.DrawText(format(f.time, 'HH:ss'), WEATHER_X + 40 + i * 150, WEATHER_TIME_Y, WEATHER_SIZE, ray.LIGHTGRAY);
				ray.DrawText(formatTemp(f.temp), WEATHER_X + 55 + i * 150, WEATHER_TEMP_Y, WEATHER_SIZE, ray.GREEN);
			}
		}

		ray.EndDrawing();

		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	cleanup();
};

const cleanup = () => {
	console.log('Cleaning up');

	if (dhtInterval) {
		clearInterval(dhtInterval);
	}

	if (weatherInterval) {
		clearInterval(weatherInterval);
	}

	if (screenTimeout) {
		clearInterval(screenTimeout);
	}

	buttonPrev.unexport();
	buttonNext.unexport();

	ray.CloseWindow();
};

process.on('SIGINT', (...args) => {
	console.log(args);
	cleanup();
});

render().catch((err) => console.error(new Date(), err));
