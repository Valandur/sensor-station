"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const chalk_1 = __importDefault(require("chalk"));
const date_fns_1 = require("date-fns");
const util_1 = require("util");
const battery_1 = require("./services/battery");
const calendar_1 = require("./services/calendar");
const games_1 = require("./services/games");
const modem_1 = require("./services/modem");
const news_1 = require("./services/news");
const post_1 = require("./services/post");
const sbb_1 = require("./services/sbb");
const sensor_1 = require("./services/sensor");
const server_1 = require("./services/server");
const weather_1 = require("./services/weather");
class Application {
    battery;
    calendar;
    games;
    modem;
    news;
    post;
    sbb;
    sensor;
    server;
    weather;
    services = [];
    constructor() {
        this.battery = new battery_1.Battery(this);
        this.calendar = new calendar_1.Calendar(this);
        this.games = new games_1.Games(this);
        this.modem = new modem_1.Modem(this);
        this.news = new news_1.News(this);
        this.post = new post_1.Post(this);
        this.sbb = new sbb_1.SBB(this);
        this.sensor = new sensor_1.Sensor(this);
        this.server = new server_1.Server(this);
        this.weather = new weather_1.Weather(this);
        this.services = [
            this.battery,
            this.calendar,
            this.games,
            this.modem,
            this.news,
            this.post,
            this.sbb,
            this.sensor,
            this.server,
            this.weather
        ];
    }
    async init() {
        this.log('MAIN', 'INIT');
        for (const srv of this.services) {
            await srv.init();
        }
        this.log('MAIN', 'INITIALIZED');
    }
    async start() {
        this.log('MAIN', 'START');
        for (const srv of this.services) {
            await srv.start();
        }
        this.log('MAIN', 'STARTED');
    }
    async stop() {
        this.log('MAIN', 'STOP');
        for (const srv of this.services) {
            await srv.stop();
        }
        this.log('MAIN', 'STOPPED');
    }
    async dispose() {
        this.log('MAIN', 'DISPOSE');
        for (const srv of this.services) {
            await srv.dispose();
        }
        this.log('MAIN', 'DISPOSED');
    }
    getDate() {
        return chalk_1.default.grey((0, date_fns_1.format)(new Date(), 'HH:mm:ss'));
    }
    debug(service, message, ...params) {
        const msg = chalk_1.default.gray(typeof message === 'string' ? message : (0, util_1.inspect)(message));
        console.log(`${this.getDate()} [${chalk_1.default.gray('DEBUG')}] [${chalk_1.default.magenta(service)}] ${msg}`, ...params);
    }
    log(service, message, ...params) {
        const msg = typeof message === 'string' ? message : (0, util_1.inspect)(message);
        console.log(`${this.getDate()} [${chalk_1.default.cyan('INFO')}] [${chalk_1.default.magenta(service)}] ${msg}`, ...params);
    }
    warn(service, message, ...params) {
        const msg = chalk_1.default.yellow(typeof message === 'string' ? message : (0, util_1.inspect)(message));
        console.log(`${this.getDate()} [${chalk_1.default.yellow('WARN')}] [${chalk_1.default.magenta(service)}] ${msg}`, ...params);
    }
    error(service, message, ...params) {
        const msg = chalk_1.default.red(typeof message === 'string' ? message : (0, util_1.inspect)(message));
        console.error(`${this.getDate()} [${chalk_1.default.red('ERROR')}] [${chalk_1.default.magenta(service)}] ${msg}`, ...params);
    }
}
exports.Application = Application;
//# sourceMappingURL=app.js.map