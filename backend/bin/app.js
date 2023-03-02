"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const battery_1 = require("./services/battery");
const modem_1 = require("./services/modem");
const news_1 = require("./services/news");
const sensor_1 = require("./services/sensor");
const server_1 = require("./services/server");
const weather_1 = require("./services/weather");
const storage_1 = require("./services/storage");
const calendar_1 = require("./services/calendar");
class Application {
    constructor() {
        this.services = [];
        this.storage = new storage_1.Storage(this);
        this.battery = new battery_1.Battery(this);
        this.modem = new modem_1.Modem(this);
        this.news = new news_1.News(this);
        this.sensor = new sensor_1.Sensor(this);
        this.weather = new weather_1.Weather(this);
        this.server = new server_1.Server(this);
        this.calendar = new calendar_1.Calendar(this);
        this.services = [
            this.storage,
            this.battery,
            this.modem,
            this.news,
            this.sensor,
            this.weather,
            this.server,
            this.calendar
        ];
    }
    async init() {
        for (const srv of this.services) {
            await srv.init();
        }
    }
    async run() {
        for (const srv of this.services) {
            await srv.start();
        }
    }
    log(service, message, ...params) {
        const date = new Date().toISOString();
        console.log(`${date} [LOG] [${service}] ${message}`, ...params);
    }
    error(service, message, ...params) {
        const date = new Date().toISOString();
        console.error(`${date} [ERROR] [${service}] ${message}`, ...params);
    }
}
exports.Application = Application;
