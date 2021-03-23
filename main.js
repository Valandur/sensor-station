const dht = require('node-dht-sensor').promises;
const ray = require('raylib');
const { format } = require('date-fns');

const DHT_TYPE = 11;
const DHT_PIN = 17;

const FONT_SIZE = 60;
const Y_DATE = 10;
const Y_TIME = 90;
const Y_TEMP = 170;
const Y_HUM = 170;

const X_COL1 = 15;
const X_COL3 = 190;

let temperature = null;
let humidity = null;

process.env['DISPLAY'] = ':0';

const updateDHT = async () => {
	try {
		const res = await dht.read(DHT_TYPE, DHT_PIN);
		temperature = res.temperature;
		humidity = res.humidity;
		lastErr = null;
	} catch (err) {
		console.error(err);
	}
};

const dhtInterval = setInterval(updateDHT, 1000);

ray.InitWindow(320, 240, 'main');
ray.SetTargetFPS(1);

const render = () => {
	ray.BeginDrawing();
	ray.ClearBackground(ray.BLACK);

	const now = new Date();
	ray.DrawText(format(now, 'dd.MM.yyyy'), X_COL1, Y_DATE, FONT_SIZE, ray.WHITE);
	ray.DrawText(format(now, 'HH:mm:ss'), X_COL1, Y_TIME, FONT_SIZE, ray.WHITE);

	if (temperature !== null) {
		ray.DrawText(`${temperature}°C`, X_COL1, Y_TEMP, FONT_SIZE, ray.GREEN);
	}

	if (humidity !== null) {
		ray.DrawText(`${humidity}%`, X_COL3, Y_HUM, FONT_SIZE, ray.BLUE);
	}

	ray.EndDrawing();
};

const renderInterval = setInterval(render, 500);

process.on('SIGINT', () => {
	clearInterval(dhtInterval);
	clearInterval(renderInterval);

	ray.CloseWindow();
});
