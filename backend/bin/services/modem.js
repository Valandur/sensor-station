"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modem = void 0;
const os_1 = require("os");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const geo_tz_1 = require("geo-tz");
const service_1 = require("./service");
const COPS = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ = /\+CSQ: (\d+),(\d+)/i;
const CCLK = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS = /\+CGPSINFO: ([\d\.]+),(\w),([\d\.]+),(\w),(\d+),([\d\.]+),([\d\.]+),([\d\.]+),/i;
const STATE_PATH = `data/modem/state.json`;
class Modem extends service_1.Service {
    devicePath = process.env['MODEM_SERIAL_PATH'] || '/dev/ttyUSB2';
    baseLat = process.env['MODEM_BASE_LAT'] ? Number(process.env['MODEM_BASE_LAT']) : 47.3775366;
    baseLng = process.env['MODEM_BASE_LNG'] ? Number(process.env['MODEM_BASE_LNG']) : 8.466696;
    commander = null;
    status = null;
    interfaces = null;
    async doInit() {
        await (0, promises_1.mkdir)((0, path_1.dirname)(STATE_PATH), { recursive: true });
        if (!(await this.checkDevice())) {
            return;
        }
        try {
            const SerialCommander = require('@westh/serial-commander');
            this.commander = new SerialCommander({
                port: this.devicePath,
                defaultDelay: 10,
                disableLog: true
            });
        }
        catch (err) {
            this.error(err);
        }
    }
    async doStart() {
        this.interfaces = null;
        const status = await (0, promises_1.readFile)(STATE_PATH, 'utf-8').catch(() => null);
        if (status) {
            this.status = { ...JSON.parse(status), cached: true };
        }
        else {
            this.status = null;
        }
    }
    async doUpdate() {
        if (!this.commander) {
            if (this.isDebug) {
                this.status = {
                    isConnected: Math.random() > 0.5,
                    time: new Date().toISOString(),
                    tzOffset: '+01:00',
                    operator: 'DR',
                    signal: Math.round(Math.random() * 4),
                    lat: this.baseLat,
                    lng: this.baseLng,
                    tzName: (0, geo_tz_1.find)(this.baseLat, this.baseLng)[0] || 'Unknown',
                    cached: Math.random() > 0.5
                };
            }
            return;
        }
        this.interfaces = await this.getInterfaces();
        this.status = await this.getStatus();
        await (0, promises_1.writeFile)(STATE_PATH, JSON.stringify(this.status), 'utf-8');
    }
    async doStop() {
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
            await (0, promises_1.stat)(this.devicePath);
            return true;
        }
        catch {
            this.warn(`Modem not available @ ${this.devicePath}`);
            return false;
        }
    }
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