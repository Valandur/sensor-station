import superagent from 'superagent';

import { Service } from './service';

const URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;

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
	content: string;
	tags: string[];
}

export class Weather extends Service {
	private readonly apiKey = process.env['WEATHER_API_KEY'] || '';

	public hourly: Forecast[] | null = null;
	public daily: Forecast[] | null = null;
	public alerts: Alert[] | null = null;

	protected override async doInit(): Promise<void> {}

	protected override async doStart(): Promise<void> {
		this.hourly = null;
		this.daily = null;
		this.alerts = null;
	}

	protected override async doUpdate(): Promise<void> {
		const lat = this.app.modem?.status?.lat || process.env['WEATHER_LAT'] || '47.3863129';
		const lng = this.app.modem?.status?.lng || process.env['WEATHER_LNG'] || '8.6542843';
		const url = `${URL}&appid=${this.apiKey}&lat=${lat}&lon=${lng}`;

		const alerts: Alert[] = [];
		const daily: Forecast[] = [];
		const hourly: Forecast[] = [];

		const { body } = await superagent.get(url);

		const prefix = '/icons/';
		const suffix = '.png';

		for (const forecast of body.hourly) {
			hourly.push({
				ts: new Date(forecast.dt * 1000).toISOString(),
				img: prefix + ICON_MAP[forecast.weather[0].id] + suffix,
				feelsLike: forecast.feels_like
			});
		}

		for (const forecast of body.daily) {
			daily.push({
				ts: new Date(forecast.dt * 1000).toISOString(),
				img: prefix + ICON_MAP[forecast.weather[0].id] + suffix,
				feelsLike: forecast.feels_like.day
			});
		}

		if (body.alerts) {
			for (const alert of body.alerts) {
				alerts.push({
					sender: alert.sender_name,
					event: alert.event,
					start: new Date(alert.start * 1000).toISOString(),
					end: new Date(alert.end * 1000).toISOString(),
					content: alert.description,
					tags: alert.tags
				});
			}
		}

		if (this.isDebug && alerts.length === 0) {
			alerts.push(
				{
					sender: 'MeteoSwiss',
					event: 'Yellow Wind Warning',
					start: '2023-03-31T07:00:00.000Z',
					end: '2023-03-31T19:00:00.000Z',
					content:
						'- Highest wind gusts in exposed locations: 70 - 90 km/h, above 1000 m 80 - 110 km/h\n- Main wind direction southwest to west',
					tags: ['Wind']
				},
				{
					sender: 'MeteoSwiss',
					event: 'Orange Wind Warning',
					start: '2023-03-31T06:00:00.000Z',
					end: '2023-03-31T19:00:00.000Z',
					content:
						'- Highest wind gusts in exposed locations: 80 - 110 km/h, above 1000 m  100 - 140 km/h\n- Main wind direction: west to southwest\n- Peak phase of the event: Fri 12 - Fri 17\n- Intensifying conditions: -',
					tags: ['Wind']
				}
			);
		}

		this.hourly = hourly;
		this.daily = daily;
		this.alerts = alerts;
	}

	protected override async doStop(): Promise<void> {
		this.hourly = null;
		this.daily = null;
		this.alerts = null;
	}

	protected override async doDispose(): Promise<void> {}
}
