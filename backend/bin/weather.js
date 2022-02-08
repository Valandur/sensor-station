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
class Weather extends service_1.Service {
    constructor() {
        super();
        this.forecasts = [];
        this.sensorTemp = null;
        this.sensorRh = null;
        this.updateForecasts = async () => {
            const { data } = await (0, axios_1.default)(URL);
            const forecasts = [];
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
        this.forecastInterval = setInterval(this.updateForecasts, 10 * 60 * 1000);
        if (!process.env.DISABLE_SENSOR) {
            await this.updateDHT();
            this.sensorInterval = setInterval(this.updateDHT, 1 * 1000);
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
