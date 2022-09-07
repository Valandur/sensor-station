"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const battery_1 = require("./battery");
const modem_1 = require("./modem");
const news_1 = require("./news");
const sensor_1 = require("./sensor");
const server_1 = require("./server");
const weather_1 = require("./weather");
class Application {
    constructor() {
        this.battery = new battery_1.Battery(this);
        this.modem = new modem_1.Modem(this);
        this.news = new news_1.News(this);
        this.sensor = new sensor_1.Sensor(this);
        this.server = new server_1.Server(this);
        this.weather = new weather_1.Weather(this);
    }
    async run() {
        // Battery
        console.log('battery...');
        await this.battery.init();
        // Modem
        console.log('modem...');
        await this.modem.init();
        // Weather
        console.log('weather...');
        await this.weather.init();
        // News
        console.log('news...');
        await this.news.init();
        // Server
        console.log('server...');
        await this.server.init();
        // RUN
        return this.server.run();
    }
}
exports.Application = Application;
