"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modem = void 0;
const serial_commander_1 = __importDefault(require("@westh/serial-commander"));
const promises_1 = require("fs/promises");
const geo_tz_1 = require("geo-tz");
const MODEM_SERIAL = '/dev/ttyUSB2';
const UPDATE_INTERVAL = 5 * 60 * 1000;
const COPS = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ = /\+CSQ: (\d+),(\d+)/i;
const CREG = /\+CREG: (\d+),(\d+),([0-9A-F]+),([0-9A-F]+)/i;
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
                operator: 'DR',
                signal: 3,
                lat,
                lng,
                tz: (0, geo_tz_1.find)(lat, lng)[0]
            };
            return;
        }
        this.commander = new serial_commander_1.default({ port: MODEM_SERIAL, disableLog: true });
        await this.update();
        this.timer = setInterval(this.update, UPDATE_INTERVAL);
    }
    async dispose() {
        await this.commander.close();
        clearInterval(this.timer);
    }
    async getStatus() {
        let operator;
        await this.commander.send('AT+COPS=3,0');
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
        let lat;
        let lng;
        let tz;
        const { response: gpsResp } = await this.commander.send('AT+CGPSINFO');
        const gpsMatch = GPS.exec(gpsResp);
        if (gpsMatch) {
            lat = Number(gpsMatch[1]) / (gpsMatch[2] === 'S' ? -100 : 100);
            lng = Number(gpsMatch[3]) / (gpsMatch[4] === 'W' ? -100 : 100);
            tz = (0, geo_tz_1.find)(lat, lng)[0];
        }
        return { isConnected: true, operator, signal, lat, lng, tz };
    }
}
exports.Modem = Modem;
