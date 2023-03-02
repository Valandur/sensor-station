"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weather = void 0;
const axios_1 = __importDefault(require("axios"));
const service_1 = require("./service");
const BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall?';
const URL_OPTIONS = '&mode=json&lang=en&units=metric&exclude=minutely,hourly';
const URL_APIKEY = '&APPID=7f866f60fad7f88bf9e647a865892400';
const URL = `${BASE_URL}${URL_OPTIONS}${URL_APIKEY}`;
const ICON_MAP = {
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
class Weather extends service_1.Service {
    constructor() {
        super(...arguments);
        this.enabled = process.env.WEATHER_ENABLED === '1';
        this.forecasts = [];
        this.alerts = [];
        this.update = async () => {
            const lat = this.app.modem?.status?.lat || process.env.WEATHER_LAT || '47.3863191';
            const lng = this.app.modem?.status?.lng || process.env.WEATHER_LNG || '8.6519611';
            const url = `${URL}&lat=${lat}&lon=${lng}`;
            try {
                const alerts = [];
                const forecasts = [];
                const { data } = await (0, axios_1.default)(url);
                const prefix = '/icons/';
                const suffix = '.png';
                for (const forecast of data.daily) {
                    forecasts.push({
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
                this.forecasts = forecasts;
                this.alerts = alerts;
                this.updatedAt = new Date();
            }
            catch (err) {
                this.error(err);
            }
        };
    }
    async init() {
        if (!this.enabled) {
            this.log('WEATHER DISABLED');
            return;
        }
        await this.update();
        if (process.env.WEATHER_UPDATE_INTERVAL) {
            const interval = 1000 * Number(process.env.WEATHER_UPDATE_INTERVAL);
            this.timer = setInterval(this.update, interval);
            this.log('WEATHER UPDATE STARTED', interval);
        }
        else {
            this.log('WEATHER UPDATE DISABLED');
        }
    }
    dispose() {
        clearInterval(this.timer);
    }
}
exports.Weather = Weather;
