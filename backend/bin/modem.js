"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modem = void 0;
const os_1 = require("os");
const promises_1 = require("fs/promises");
const serial_commander_1 = __importDefault(require("@westh/serial-commander"));
const geo_tz_1 = require("geo-tz");
const service_1 = require("./service");
const MODEM_SERIAL = '/dev/ttyUSB2';
const BASE_LAT = 47.17554525;
const BASE_LNG = 8.33849761;
const COPS = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ = /\+CSQ: (\d+),(\d+)/i;
const CCLK = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS = /\+CGPSINFO: ([\d\.]+),(\w),([\d\.]+),(\w),(\d+),([\d\.]+),([\d\.]+),([\d\.]+),/i;
const STATE_PATH = `data/modem/state.json`;
class Modem extends service_1.Service {
    constructor() {
        super(...arguments);
        this.enabled = process.env.MODEM_ENABLED === '1';
        this.update = async () => {
            try {
                this.interfaces = await this.getInterfaces();
            }
            catch (err) {
                console.error(err);
            }
            try {
                this.status = await this.getStatus();
                this.updatedAt = new Date();
                await (0, promises_1.writeFile)(STATE_PATH, JSON.stringify(this.status), 'utf-8');
            }
            catch (err) {
                console.error(err);
                const status = await (0, promises_1.readFile)(STATE_PATH, 'utf-8').catch(() => JSON.stringify({
                    isConnected: false,
                    time: new Date().toISOString(),
                    tzOffset: '+01:00',
                    operator: 'DR',
                    signal: 3,
                    lat: BASE_LAT,
                    lng: BASE_LNG,
                    tzName: (0, geo_tz_1.find)(BASE_LAT, BASE_LNG)[0],
                    cached: true
                }));
                this.status = { ...JSON.parse(status), cached: true };
            }
        };
    }
    async init() {
        if (!this.enabled) {
            console.log('MODEM DISABLED');
            return;
        }
        this.commander = new serial_commander_1.default({
            port: MODEM_SERIAL,
            defaultDelay: 10,
            disableLog: true
        });
        await this.update();
        if (process.env.MODEM_UPDATE_INTERVAL) {
            const interval = 1000 * Number(process.env.MODEM_UPDATE_INTERVAL);
            this.timer = setInterval(this.update, interval);
            console.log('MODEM UPDATE STARTED', interval);
        }
        else {
            console.log('MODEM UPDATE DISABLED');
        }
    }
    async dispose() {
        await this.commander.close();
        clearInterval(this.timer);
    }
    async getInterfaces() {
        const nets = (0, os_1.networkInterfaces)();
        const interfaces = new Map();
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                if (net.internal) {
                    continue;
                }
                let netIps = interfaces.get(name);
                if (!netIps) {
                    netIps = [];
                    interfaces.set(name, netIps);
                }
                netIps.push(net.address);
            }
        }
        return [...interfaces.entries()].map(([name, ips]) => ({ name, ips }));
    }
    async getStatus() {
        if (!(await (0, promises_1.stat)(MODEM_SERIAL).catch(() => false))) {
            throw new Error(`Modem not available @ ${MODEM_SERIAL}`);
        }
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
            const year = `${2000 + Number(cclkMatch[1])}`;
            const month = `${Number(cclkMatch[2])}`.padStart(2, '0');
            const day = `${Number(cclkMatch[3])}`.padStart(2, '0');
            const hour = `${Number(cclkMatch[4])}`.padStart(2, '0');
            const minute = `${Number(cclkMatch[5])}`.padStart(2, '0');
            const second = `${Number(cclkMatch[6])}`.padStart(2, '0');
            const rawTz = Number(cclkMatch[7]) * 15;
            const tzSign = rawTz > 0 ? '+' : '-';
            const tzHours = `${Math.floor(Math.abs(rawTz) / 60)}`.padStart(2, '0');
            const tzMinutes = `${Math.abs(rawTz) % 60}`.padStart(2, '0');
            tzOffset = `${tzSign}${tzHours}:${tzMinutes}`;
            time = `${year}-${month}-${day}T${hour}:${minute}:${second}${tzOffset}`;
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
        return { isConnected: true, operator, signal, time, tzOffset, lat, lng, tzName, cached: false };
    }
}
exports.Modem = Modem;
