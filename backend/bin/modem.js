"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modem = void 0;
const serial_commander_1 = __importDefault(require("@westh/serial-commander"));
const promises_1 = require("fs/promises");
const geo_tz_1 = require("geo-tz");
const date_fns_tz_1 = require("date-fns-tz");
const date_fns_1 = require("date-fns");
const MODEM_SERIAL = '/dev/ttyUSB2';
const UPDATE_INTERVAL = 5 * 60 * 1000;
const COPS = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ = /\+CSQ: (\d+),(\d+)/i;
const CCLK = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS = /\+CGPSINFO: ([\d\.]+),(\w),([\d\.]+),(\w),(\d+),([\d\.]+),([\d\.]+),([\d\.]+),/i;
class Modem {
    constructor() {
        this.update = async () => {
            try {
                this.status = await this.getStatus();
            }
            catch (err) {
                console.error(err);
            }
        };
    }
    async init() {
        if (!(await (0, promises_1.stat)(MODEM_SERIAL).catch(() => false))) {
            console.log(`Modem not available @ ${MODEM_SERIAL}`);
            const lat = 47.17554525;
            const lng = 8.33849761;
            this.status = {
                isConnected: true,
                time: new Date().toISOString(),
                tzOffset: '+01:00',
                operator: 'DR',
                signal: 3,
                lat,
                lng,
                tzName: (0, geo_tz_1.find)(lat, lng)[0]
            };
            return;
        }
        this.commander = new serial_commander_1.default({
            port: MODEM_SERIAL,
            defaultDelay: 10,
            disableLog: true
        });
        await this.update();
        this.timer = setInterval(this.update, UPDATE_INTERVAL);
    }
    async dispose() {
        await this.commander.close();
        clearInterval(this.timer);
    }
    async getStatus() {
        let operator;
        const { response: copsResp } = await this.commander.send('AT+COPS?');
        const copsMatch = COPS.exec(copsResp);
        if (copsMatch) {
            operator = copsMatch[3];
        }
        let signal;
        const { response: csqResp } = await this.commander.send('AT+CSQ');
        const csqMatch = CSQ.exec(csqResp);
        if (csqMatch) {
            const rawSig = Number(csqMatch[1]);
            signal = rawSig < 10 ? 1 : rawSig < 15 ? 2 : rawSig < 20 ? 3 : 4;
        }
        let time;
        let tzOffset;
        const { response: cclkResp } = await this.commander.send('AT+CCLK?');
        const cclkMatch = CCLK.exec(cclkResp);
        if (cclkMatch) {
            const year = 2000 + Number(cclkMatch[1]);
            const month = Number(cclkMatch[2]);
            const day = Number(cclkMatch[3]);
            const hour = Number(cclkMatch[4]);
            const minute = Number(cclkMatch[5]);
            const second = Number(cclkMatch[6]);
            const rawTz = Number(cclkMatch[7]) * 15;
            const tzSign = rawTz > 0 ? '+' : '-';
            const tzHours = `${Math.floor(Math.abs(rawTz) / 60)}`.padStart(2, '0');
            const tzMinutes = `${Math.abs(rawTz) % 60}`.padStart(2, '0');
            tzOffset = `${tzSign}${tzHours}:${tzMinutes}`;
            const date = (0, date_fns_1.parseISO)(`${year}-${month}-${day}T${hour}:${minute}:${second}T${tzOffset}`);
            time = (0, date_fns_tz_1.zonedTimeToUtc)(date, tzOffset).toISOString();
        }
        let lat;
        let lng;
        let tzName;
        const { response: gpsResp } = await this.commander.send('AT+CGPSINFO');
        const gpsMatch = GPS.exec(gpsResp);
        if (gpsMatch) {
            lat = Number(gpsMatch[1]) / (gpsMatch[2] === 'S' ? -100 : 100);
            lng = Number(gpsMatch[3]) / (gpsMatch[4] === 'W' ? -100 : 100);
            tzName = (0, geo_tz_1.find)(lat, lng)[0];
        }
        return { isConnected: true, operator, signal, time, tzOffset, lat, lng, tzName };
    }
}
exports.Modem = Modem;
