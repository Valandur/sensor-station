"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weather = void 0;
const axios_1 = __importDefault(require("axios"));
const service_1 = require("./service");
const UPDATE_INTERVAL = 60 * 60 * 1000;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall?';
const URL_OPTIONS = '&mode=json&lang=en&units=metric&exclude=minutely,hourly';
const URL_LOC = '&lat=47.2949&lon=8.5645';
const URL_APIKEY = '&APPID=7f866f60fad7f88bf9e647a865892400';
const URL = `${BASE_URL}${URL_OPTIONS}${URL_LOC}${URL_APIKEY}`;
class Weather extends service_1.Service {
    constructor() {
        super(...arguments);
        this.forecasts = [];
        this.updateForecasts = async () => {
            const { data } = await axios_1.default(URL);
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
    }
    async init() {
        await this.updateForecasts();
        this.forecastInterval = setInterval(this.updateForecasts, UPDATE_INTERVAL);
    }
    dispose() {
        clearInterval(this.forecastInterval);
    }
}
exports.Weather = Weather;
