"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modem = void 0;
const os_1 = require("os");
const promises_1 = require("fs/promises");
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
    commander = null;
    timer = null;
    updatedAt = null;
    status = null;
    interfaces = null;
    async doInit() {
        if (!(await this.checkDevice())) {
            return;
        }
        try {
            const SerialCommander = require('@westh/serial-commander');
            this.commander = new SerialCommander({
                port: MODEM_SERIAL,
                defaultDelay: 10,
                disableLog: true
            });
        }
        catch (err) {
            this.error(err);
        }
    }
    async doStart() {
        // If we didn't initilialize it's not available, so exit early
        if (!this.commander) {
            if (process.env['DEBUG'] === '1') {
                this.status = {
                    isConnected: false,
                    time: new Date().toISOString(),
                    tzOffset: '+01:00',
                    operator: 'DR',
                    signal: 3,
                    lat: BASE_LAT,
                    lng: BASE_LNG,
                    tzName: (0, geo_tz_1.find)(BASE_LAT, BASE_LNG)[0] || 'Unknown',
                    cached: true
                };
            }
            return;
        }
        await this.update();
        if (process.env['MODEM_UPDATE_INTERVAL']) {
            const interval = 1000 * Number(process.env['MODEM_UPDATE_INTERVAL']);
            this.timer = setInterval(this.update, interval);
            this.log('UPDATE STARTED', interval);
        }
        else {
            this.log('UPDATE DISABLED');
        }
    }
    async doStop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.updatedAt = null;
        this.status = null;
        this.interfaces = null;
    }
    async doDispose() {
        if (this.commander) {
            await this.commander.close();
            this.commander = null;
        }
    }
    async checkDevice() {
        try {
            await (0, promises_1.stat)(MODEM_SERIAL);
            return true;
        }
        catch {
            this.warn(`Modem not available @ ${MODEM_SERIAL}`);
            return false;
        }
    }
    update = async () => {
        try {
            this.interfaces = await this.getInterfaces();
        }
        catch (err) {
            this.error(err);
        }
        try {
            this.status = await this.getStatus();
            this.updatedAt = new Date();
            await (0, promises_1.writeFile)(STATE_PATH, JSON.stringify(this.status), 'utf-8');
        }
        catch (err) {
            this.error(err);
            const status = await (0, promises_1.readFile)(STATE_PATH, 'utf-8').catch(() => null);
            if (status) {
                this.status = { ...JSON.parse(status), cached: true };
            }
        }
    };
    async getInterfaces() {
        const networkInterfacesMap = (0, os_1.networkInterfaces)();
        const interfaces = new Map();
        for (const [name, nets] of Object.entries(networkInterfacesMap)) {
            if (!nets) {
                continue;
            }
            for (const net of nets) {
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
        if (!this.commander) {
            throw new Error(`Modem is not available`);
        }
        let operator = null;
        const { response: copsResp } = await this.commander.send('AT+COPS?');
        const copsMatch = COPS.exec(copsResp);
        if (copsMatch) {
            operator = copsMatch[3] || null;
        }
        let signal = null;
        const { response: csqResp } = await this.commander.send('AT+CSQ');
        const csqMatch = CSQ.exec(csqResp);
        if (csqMatch) {
            const rawSig = Number(csqMatch[1]);
            signal = rawSig < 10 ? 1 : rawSig < 15 ? 2 : rawSig < 20 ? 3 : 4;
        }
        let time = null;
        let tzOffset = null;
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
        let lat = null;
        let lng = null;
        let tzName = null;
        const { response: gpsResp } = await this.commander.send('AT+CGPSINFO');
        const gpsMatch = GPS.exec(gpsResp);
        if (gpsMatch) {
            lat = Number(gpsMatch[1]) / (gpsMatch[2] === 'S' ? -100 : 100);
            lng = Number(gpsMatch[3]) / (gpsMatch[4] === 'W' ? -100 : 100);
            tzName = (0, geo_tz_1.find)(lat, lng)[0] || null;
        }
        return { isConnected: true, operator, signal, time, tzOffset, lat, lng, tzName, cached: false };
    }
}
exports.Modem = Modem;
//# sourceMappingURL=modem.js.map