import axios from 'axios';
import { createWriteStream, mkdirSync, existsSync } from 'fs';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall?';
const URL_OPTIONS = '&mode=json&lang=en&units=metric&exclude=minutely,hourly';
const URL_LOC = '&lat=47.2949&lon=8.5645';
const URL_APIKEY = '&APPID=05a064328a46dbcf8d1c402a33567d86';
const URL = `${BASE_URL}${URL_OPTIONS}${URL_LOC}${URL_APIKEY}`;

interface WeatherEntry {
	time: Date;
	img: string;
	feelsLike: number;
}

export class Weather {
	private _forecasts: WeatherEntry[] = [];
	public get forecasts() {
		return this._forecasts;
	}

	private interval: NodeJS.Timer;

	public init() {
		if (!existsSync(`data`)) {
			mkdirSync(`data`);
		}

		setTimeout(this.updateWeather, 1000);
		this.interval = setInterval(this.updateWeather, 60000);
	}

	public dispose() {
		clearInterval(this.interval);
	}

	private updateWeather = async () => {
		const { data } = await axios(URL);

		const forecasts: WeatherEntry[] = [];

		const current = data.current;
		const imgPath = await this.saveIcon(current.weather[0]);
		forecasts.push({
			time: new Date(current.dt * 1000),
			img: imgPath,
			feelsLike: current.feels_like
		});

		for (const forecast of data.daily) {
			const imgPath = await this.saveIcon(forecast.weather[0]);

			forecasts.push({
				time: new Date(forecast.dt * 1000),
				img: imgPath,
				feelsLike: forecast.feels_like.day //{ min: forecast.feels_like.morn, max: forecast.feels_like.day }
			});
		}

		this._forecasts = forecasts;
	};

	private async saveIcon(weather: any) {
		const imgPath = `data/${weather.icon}.png`;

		if (!existsSync(imgPath)) {
			const writer = createWriteStream(imgPath);
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

		return imgPath;
	}
}
