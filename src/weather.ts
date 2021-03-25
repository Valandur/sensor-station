import axios from 'axios';
import fs from 'fs';

const WEATHER_API_KEY = '05a064328a46dbcf8d1c402a33567d86';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/forecast?mode=json&lang=en&units=metric';
const WEATHER_CITY_ID = 2657896; // Zürich
const WEATHER_FORECASTS = 2;

export interface Forecast {
	time: Date;
	img: string;
	temp: number;
}

export class Weather {
	private _forecasts: Forecast[] = [];
	public get forecasts() {
		return this._forecasts;
	}

	private interval: NodeJS.Timer;

	public init() {
		if (!fs.existsSync(`data`)) {
			fs.mkdirSync(`data`);
		}

		setTimeout(this.updateWeather, 1000);
		this.interval = setInterval(this.updateWeather, 60000);
	}

	public dispose() {
		clearInterval(this.interval);
	}

	private updateWeather = async () => {
		const { data } = await axios(`${WEATHER_URL}&id=${WEATHER_CITY_ID}&APPID=${WEATHER_API_KEY}`);

		const forecasts = [];

		for (let i = 0; i < WEATHER_FORECASTS; i++) {
			const forecast = data.list[i];
			const weather = forecast.weather[0];
			const imgPath = `data/${weather.icon}.png`;

			if (!fs.existsSync(imgPath)) {
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
			}

			forecasts.push({
				time: new Date(forecast.dt * 1000),
				img: imgPath,
				temp: forecast.main.temp
			});
		}

		this._forecasts = forecasts;
	};
}
