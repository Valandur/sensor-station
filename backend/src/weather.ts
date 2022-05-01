import axios from 'axios';

import { Service } from './service';
import { Modem } from './modem';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall?';
const URL_OPTIONS = '&mode=json&lang=en&units=metric&exclude=minutely,hourly';
const URL_APIKEY = '&APPID=7f866f60fad7f88bf9e647a865892400';
const URL = `${BASE_URL}${URL_OPTIONS}${URL_APIKEY}`;

const DHT_TYPE = 11;
const DHT_PIN = 17;

const UPDATE_INTERVAL = 10 * 60 * 1000;

const ICON_MAP: { [key: number]: string } = {
	200: 'thunderstorm',
	201: 'thunderstorm',
	202: 'thunderstorm',
	210: 'thunderstorm',
	211: 'thunderstorm',
	212: 'thunderstorm',
	221: 'thunderstorm',
	230: 'thunderstorm',
	231: 'thunderstorm',
	232: 'thunderstorm',

	300: 'drizzle',
	301: 'drizzle',
	302: 'drizzle',
	310: 'drizzle',
	311: 'drizzle',
	312: 'drizzle',
	313: 'drizzle',
	314: 'drizzle',
	321: 'drizzle',

	500: 'rain',
	501: 'rain',
	502: 'heavyrain',
	503: 'heavyrain',
	504: 'heavyrain',
	511: 'snow',
	520: 'drizzle',
	521: 'drizzle',
	522: 'drizzle',
	531: 'drizzle',

	600: 'snow',
	601: 'snow',
	602: 'heavysnow',
	611: 'snow',
	612: 'snow',
	613: 'snow',
	615: 'snow',
	616: 'snow',
	620: 'snow',
	621: 'snow',
	622: 'heavysnow',

	701: 'foggy',
	711: 'foggy',
	721: 'foggy',
	731: 'sandstorm',
	741: 'foggy',
	751: 'sand',
	761: 'sand',
	762: 'sand',
	771: 'wind',
	781: 'tornado',

	800: 'clear',

	801: 'clouds',
	802: 'clouds',
	803: 'overcast',
	804: 'overcast'
};

interface WeatherEntry {
	time: Date;
	img: string;
	feelsLike: number;
}

interface Alert {
	sender: string;
	event: string;
	start: Date;
	end: Date;
	description: string;
	tags: string[];
}

interface WeatherStatus {
	temp: number;
	rh: number;
	forecasts: WeatherEntry[];
	alerts: Alert[];
}

export class Weather extends Service {
	private dht: any;
	private timer: NodeJS.Timer;

	public status: WeatherStatus;

	private modem: Modem;

	public constructor(modem?: Modem) {
		super();

		this.modem = modem;

		if (!process.env.DISABLE_SENSOR) {
			try {
				this.dht = require('node-dht-sensor').promises;
			} catch {}
		} else {
			console.log('SENSOR DISABLED');
		}
	}

	public async init(): Promise<void> {
		await this.update();
		this.timer = setInterval(this.update, UPDATE_INTERVAL);
	}

	public dispose(): void {
		clearInterval(this.timer);
	}

	private update = async () => {
		const alerts: Alert[] = [];
		const forecasts: WeatherEntry[] = [];

		const lat = this.modem?.status?.lat || process.env.WEATHER_LAT || '47.3863191';
		const lng = this.modem?.status?.lng || process.env.WEATHER_LNG || '8.6519611';
		const url = `${URL}&lat=${lat}&lon=${lng}`;

		try {
			const { data } = await axios(url);

			const prefix = '/icons/';
			const suffix = '.png';

			const current = data.current;
			forecasts.push({
				time: new Date(current.dt * 1000),
				img: prefix + ICON_MAP[current.weather[0].id] + suffix,
				feelsLike: current.feels_like
			});

			for (const forecast of data.daily) {
				forecasts.push({
					time: new Date(forecast.dt * 1000),
					img: prefix + ICON_MAP[forecast.weather[0].id] + suffix,
					feelsLike: forecast.feels_like.day
				});
			}

			if (data.alerts) {
				for (const alert of data.alerts) {
					alerts.push({
						sender: alert.sender_name,
						event: alert.event,
						start: new Date(alert.start * 1000),
						end: new Date(alert.end * 1000),
						description: alert.description,
						tags: alert.tags
					});
				}
			}
		} catch (err) {
			console.error(err);
		}

		let temp: number;
		let rh: number;
		if (this.dht) {
			try {
				const res = await this.dht.read(DHT_TYPE, DHT_PIN);
				temp = res.temperature;
				rh = res.humidity;
			} catch (err) {
				console.error(err);
			}
		} else if (!process.env.DISABLE_SENSOR) {
			temp = Math.random() * 10;
			rh = Math.random() * 100;
		}

		this.status = {
			temp,
			rh,
			forecasts,
			alerts
		};
	};
}
