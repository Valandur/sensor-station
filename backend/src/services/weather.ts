import axios from 'axios';

import { Service } from './service';

const KEY = process.env['WEATHER_API_KEY'];
const URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely&appid=${KEY}`;

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

interface Forecast {
	ts: string;
	img: string;
	feelsLike: number;
}

interface Alert {
	sender: string;
	event: string;
	start: string;
	end: string;
	description: string;
	tags: string[];
}

export class Weather extends Service {
	private timer: NodeJS.Timer | null = null;

	public updatedAt: Date | null = null;
	public hourly: Forecast[] | null = null;
	public daily: Forecast[] | null = null;
	public alerts: Alert[] | null = null;

	protected override async doInit(): Promise<void> {}

	protected override async doStart(): Promise<void> {
		await this.update();

		if (process.env['WEATHER_UPDATE_INTERVAL']) {
			const interval = 1000 * Number(process.env['WEATHER_UPDATE_INTERVAL']);
			this.timer = setInterval(this.update, interval);
			this.log('UPDATE STARTED', interval);
		} else {
			this.log('UPDATE DISABLED');
		}
	}

	protected override async doStop(): Promise<void> {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}

		this.updatedAt = null;
		this.hourly = null;
		this.daily = null;
		this.alerts = null;
	}

	protected override async doDispose(): Promise<void> {}

	private update = async () => {
		const lat = this.app.modem?.status?.lat || process.env['WEATHER_LAT'] || '47.3863191';
		const lng = this.app.modem?.status?.lng || process.env['WEATHER_LNG'] || '8.6519611';
		const url = `${URL}&lat=${lat}&lon=${lng}`;

		try {
			const alerts: Alert[] = [];
			const daily: Forecast[] = [];
			const hourly: Forecast[] = [];

			const { data } = await axios(url);

			const prefix = '/icons/';
			const suffix = '.png';

			for (const forecast of data.hourly) {
				hourly.push({
					ts: new Date(forecast.dt * 1000).toISOString(),
					img: prefix + ICON_MAP[forecast.weather[0].id] + suffix,
					feelsLike: forecast.feels_like
				});
			}

			for (const forecast of data.daily) {
				daily.push({
					ts: new Date(forecast.dt * 1000).toISOString(),
					img: prefix + ICON_MAP[forecast.weather[0].id] + suffix,
					feelsLike: forecast.feels_like.day
				});
			}

			if (data.alerts) {
				for (const alert of data.alerts) {
					alerts.push({
						sender: alert.sender_name,
						event: alert.event,
						start: new Date(alert.start * 1000).toISOString(),
						end: new Date(alert.end * 1000).toISOString(),
						description: alert.description,
						tags: alert.tags
					});
				}
			}

			this.updatedAt = new Date();
			this.hourly = hourly;
			this.daily = daily;
			this.alerts = alerts;
		} catch (err) {
			this.error(err);
		}
	};
}
