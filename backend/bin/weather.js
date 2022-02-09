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
const URL_LOC = '&lat=47.2949&lon=8.5645';
const URL_APIKEY = '&APPID=7f866f60fad7f88bf9e647a865892400';
const URL = `${BASE_URL}${URL_OPTIONS}${URL_LOC}${URL_APIKEY}`;
const DHT_TYPE = 11;
const DHT_PIN = 17;
const UPDATE_INTERVAL_FORECASTS = 10 * 60 * 1000;
const UPDATE_INTERVAL_SENSOR = 10 * 1000;
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
        super();
        this.forecasts = [];
        this.sensorTemp = null;
        this.sensorRh = null;
        this.updateForecasts = async () => {
            const { data } = await (0, axios_1.default)(URL);
            const forecasts = [];
            const hours = new Date().getHours();
            const prefix = '/icons/';
            const suffix = hours > 20 || hours < 6 ? '_n.png' : '_d.png';
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
            this.forecasts = forecasts;
        };
        this.updateDHT = async () => {
            if (!this.dht) {
                this.sensorTemp = Math.random() * 10;
                this.sensorRh = Math.random() * 100;
            }
            try {
                const res = await this.dht.read(DHT_TYPE, DHT_PIN);
                this.sensorTemp = res.temperature;
                this.sensorRh = res.humidity;
            }
            catch (err) {
                // NO-OP
            }
        };
        try {
            this.dht = require('node-dht-sensor').promises;
        }
        catch {
            // NO-OP
        }
    }
    async init() {
        await this.updateForecasts();
        this.forecastInterval = setInterval(this.updateForecasts, UPDATE_INTERVAL_FORECASTS);
        if (!process.env.DISABLE_SENSOR) {
            await this.updateDHT();
            this.sensorInterval = setInterval(this.updateDHT, UPDATE_INTERVAL_SENSOR);
        }
        else {
            console.log('SENSOR DISABLED');
        }
    }
    dispose() {
        clearInterval(this.forecastInterval);
        if (this.sensorInterval) {
            clearInterval(this.sensorInterval);
        }
    }
}
exports.Weather = Weather;
