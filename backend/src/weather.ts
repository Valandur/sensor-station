import axios from 'axios';

import { Service } from './service';

const dht = require('node-dht-sensor').promises;

const BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall?';
const URL_OPTIONS = '&mode=json&lang=en&units=metric&exclude=minutely,hourly';
const URL_LOC = '&lat=47.2949&lon=8.5645';
const URL_APIKEY = '&APPID=7f866f60fad7f88bf9e647a865892400';
const URL = `${BASE_URL}${URL_OPTIONS}${URL_LOC}${URL_APIKEY}`;

const DHT_TYPE = 11;
const DHT_PIN = 17;

interface WeatherEntry {
	time: Date;
	img: string;
	feelsLike: number;
}

export class Weather extends Service {
	public forecasts: WeatherEntry[] = [];
	private forecastInterval: NodeJS.Timer;

	public sensorTemp: number = null;
	public sensorRh: number = null;
	private sensorInterval: NodeJS.Timer;

	public async init(): Promise<void> {
		await this.updateDHT();
		await this.updateForecasts();

		this.forecastInterval = setInterval(this.updateForecasts, 10 * 60 * 1000);
		this.sensorInterval = setInterval(this.updateDHT, 1 * 1000);
	}

	public dispose(): void {
		clearInterval(this.forecastInterval);
		clearInterval(this.sensorInterval);
	}

	private updateForecasts = async () => {
		const { data } = await axios(URL);

		const forecasts: WeatherEntry[] = [];

		const current = data.current;
		const imgPath = await this.cacheImage(`http://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`);
		forecasts.push({
			time: new Date(current.dt * 1000),
			img: imgPath,
			feelsLike: current.feels_like
		});

		for (const forecast of data.daily) {
			const imgPath = await this.cacheImage(`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`);

			forecasts.push({
				time: new Date(forecast.dt * 1000),
				img: imgPath,
				feelsLike: forecast.feels_like.day
			});
		}

		this.forecasts = forecasts;
	};

	private updateDHT = async () => {
		try {
			const res = await dht.read(DHT_TYPE, DHT_PIN);
			this.sensorTemp = res.temperature;
			this.sensorRh = res.humidity;
		} catch (err) {
			// NO-OP
		}
	};
}
