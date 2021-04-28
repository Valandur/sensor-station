import axios from 'axios';
import { add, format, isAfter, isSameDay, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';

import { Screen } from './screen';

const dht = require('node-dht-sensor').promises;

const BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall?';
const URL_OPTIONS = '&mode=json&lang=en&units=metric&exclude=minutely,hourly';
const URL_LOC = '&lat=47.2949&lon=8.5645';
const URL_APIKEY = '&APPID=7f866f60fad7f88bf9e647a865892400';
const URL = `${BASE_URL}${URL_OPTIONS}${URL_LOC}${URL_APIKEY}`;

const DHT_TYPE = 11;
const DHT_PIN = 17;

const TEMP_Y = 240;
const TEMP_SIZE = 90;

const RH_Y = 360;
const RH_SIZE = 90;

const WEATHER_TIME_Y = 210;
const WEATHER_ICON_Y = 265;
const WEATHER_TEMP_Y = 400;
const WEATHER_FONT_SIZE = 60;

interface WeatherEntry {
	time: Date;
	img: string;
	feelsLike: number;
}

type DateCompare = (now: Date, date: Date) => boolean;
const WEATHER_FORECASTS: DateCompare[] = [
	(now, date) => isAfter(date, startOfDay(now)),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 1 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 2 }))),
	(now, date) => isAfter(date, startOfDay(add(now, { days: 3 })))
];

export class Weather extends Screen {
	private isPaused: boolean = false;

	private forecasts: WeatherEntry[] = [];
	private forecastInterval: NodeJS.Timer;

	private sensorTemp: number = null;
	private sensorRh: number = null;
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

	public render(): void {
		super.render();

		if (this.sensorTemp !== null && this.sensorRh !== null) {
			const sensorTempText = this.formatTemp(this.sensorTemp || 0);
			const sensorTempWidth = this.context.measureText(sensorTempText, TEMP_SIZE);
			this.context.drawText(
				sensorTempText,
				(this.display.WIDTH / 3 - sensorTempWidth) / 2,
				TEMP_Y,
				TEMP_SIZE,
				this.display.GREEN
			);

			const sensorRhText = this.formatRh(this.sensorRh || 0);
			const sensorRhWidth = this.context.measureText(sensorRhText, RH_SIZE);
			this.context.drawText(
				sensorRhText,
				(this.display.WIDTH / 3 - sensorRhWidth) / 2,
				RH_Y,
				RH_SIZE,
				this.display.BLUE
			);
		}

		const now = new Date();
		const forecasts = WEATHER_FORECASTS.map((dateCompare) =>
			this.forecasts.find((forecast) => dateCompare(now, forecast.time))
		).filter((forecast) => !!forecast);

		const WEATHER_X = this.display.WIDTH / 3;
		const colWidth = (this.display.WIDTH - WEATHER_X) / forecasts.length;

		for (let i = 0; i < forecasts.length; i++) {
			const forecast = forecasts[i];

			const dateText = isSameDay(forecast.time, now) ? 'Now' : format(forecast.time, 'iiiiii', { locale: de });
			const dateWidth = this.context.measureText(dateText, WEATHER_FONT_SIZE);
			this.context.drawText(
				dateText,
				WEATHER_X + i * colWidth + (colWidth - dateWidth) / 2,
				WEATHER_TIME_Y,
				WEATHER_FONT_SIZE,
				this.display.LIGHTGRAY
			);

			this.context.drawImage(forecast.img, WEATHER_X + i * colWidth, WEATHER_ICON_Y, colWidth, colWidth);

			const tempText = this.formatTemp(forecast.feelsLike);
			const tempWidth = this.context.measureText(tempText, WEATHER_FONT_SIZE);
			this.context.drawText(
				tempText,
				WEATHER_X + i * colWidth + (colWidth - tempWidth) / 2,
				WEATHER_TEMP_Y,
				WEATHER_FONT_SIZE,
				this.display.GREEN
			);
		}
	}

	public onTap(): void {
		if (this.isPaused) {
			this.isPaused = false;
			this.display.startScreenTimeout();
		} else {
			this.isPaused = true;
			this.display.stopScreenTimeout();
		}
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

	private formatTemp(temp: number) {
		return `${temp.toFixed(0)}°`;
	}
	private formatRh(rh: number) {
		return `${rh}%`;
	}
}
