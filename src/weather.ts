import axios from 'axios';
import { stat } from 'fs/promises';
import Jimp from 'jimp';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall?';
const URL_OPTIONS = '&mode=json&lang=en&units=metric&exclude=minutely,hourly';
const URL_LOC = '&lat=47.2949&lon=8.5645';
const URL_APIKEY = '&APPID=7f866f60fad7f88bf9e647a865892400';
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
		setTimeout(this.updateWeather, 1000);
		this.interval = setInterval(this.updateWeather, 10 * 60 * 1000);
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
				feelsLike: forecast.feels_like.day
			});
		}

		this._forecasts = forecasts;
	};

	private async saveIcon(weather: any) {
		const imgPath = `data/weather/${weather.icon}.png`;

		const exists = await stat(imgPath)
			.then((s) => s.isFile())
			.catch(() => false);
		if (!exists) {
			const img = await Jimp.read(`http://openweathermap.org/img/wn/${weather.icon}@4x.png`);
			await img.writeAsync(imgPath);
		}

		return imgPath;
	}
}
