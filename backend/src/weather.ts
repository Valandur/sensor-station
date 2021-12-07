import axios from 'axios';

import { Service } from './service';

const UPDATE_INTERVAL = 60 * 60 * 1000;
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

export class Weather extends Service {
	public forecasts: WeatherEntry[] = [];
	private forecastInterval: NodeJS.Timer;

	public async init(): Promise<void> {
		await this.updateForecasts();

		this.forecastInterval = setInterval(this.updateForecasts, UPDATE_INTERVAL);
	}

	public dispose(): void {
		clearInterval(this.forecastInterval);
	}

	private updateForecasts = async () => {
		const { data } = await axios(URL);

		const forecasts: WeatherEntry[] = [];

		const current = data.current;
		forecasts.push({
			time: new Date(current.dt * 1000),
			img: `${current.weather[0].id}`,
			feelsLike: current.feels_like
		});

		for (const forecast of data.daily) {
			forecasts.push({
				time: new Date(forecast.dt * 1000),
				img: `${forecast.weather[0].id}`,
				feelsLike: forecast.feels_like.day
			});
		}

		this.forecasts = forecasts;
	};
}
