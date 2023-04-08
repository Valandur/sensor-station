"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sensor = void 0;
const date_fns_1 = require("date-fns");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const service_1 = require("./service");
const RECORDINGS_PATH = 'data/sensor/recordings.csv';
class Sensor extends service_1.Service {
    devicePath = process.env['SENSOR_DEVICE_PATH'] || '/dev/gpiomem';
    dhtType = process.env['SENSOR_DHT_TYPE'] ? Number(process.env['SENSOR_DHT_TYPE']) : 11;
    dhtPin = process.env['SENSOR_DHT_PIN'] ? Number(process.env['SENSOR_DHT_PIN']) : 17;
    recordingInterval = process.env['SENSOR_RECORDING_INTERVAL']
        ? Number(process.env['SENSOR_RECORDING_INTERVAL'])
        : null;
    dht = null;
    lastRecordedTs = null;
    recordTimer = null;
    newest = null;
    async doInit() {
        await (0, promises_1.mkdir)((0, path_1.dirname)(RECORDINGS_PATH), { recursive: true });
        if (!(await this.checkDevice())) {
            return;
        }
        try {
            this.dht = require('node-dht-sensor').promises;
            this.log(`SENSOR: TYPE: ${this.dhtType}, PIN: ${this.dhtPin}`);
        }
        catch (err) {
            this.error(err);
        }
    }
    async doStart() {
        this.newest = null;
        if (this.recordingInterval) {
            const interval = 1000 * this.recordingInterval;
            this.recordTimer = setInterval(this.record, interval);
            this.log('RECORDING SCHEDULED', interval);
        }
        else {
            this.log('RECORDING DISABLED');
        }
    }
    async doUpdate() {
        if (!this.dht) {
            if (this.isDebug) {
                this.warn('Updating in DEBUG mode');
                this.newest = {
                    ts: new Date().toISOString(),
                    temp: Math.random() * 50 - 20,
                    rh: Math.random() * 60 + 20
                };
            }
            return;
        }
        const { temperature, humidity } = await this.dht.read(this.dhtType, this.dhtPin);
        this.newest = {
            ts: new Date().toISOString(),
            temp: temperature,
            rh: humidity
        };
    }
    async doStop() {
        if (this.recordTimer) {
            clearInterval(this.recordTimer);
            this.recordTimer = null;
        }
        this.newest = null;
    }
    async doDispose() {
        if (this.dht) {
            this.dht = null;
        }
    }
    async checkDevice() {
        try {
            await (0, promises_1.stat)(this.devicePath);
            return true;
        }
        catch {
            this.warn(`GPIO not available @ ${this.devicePath}`);
            return false;
        }
    }
    record = async () => {
        try {
            if (!this.newest) {
                this.error('Could not record sensors, no recording present!');
                return;
            }
            if (this.lastRecordedTs === this.newest.ts) {
                this.error('Skipping recording because no new values are available');
                return;
            }
            await (0, promises_1.appendFile)(RECORDINGS_PATH, `${this.newest.ts},${this.newest.temp},${this.newest.rh}\n`, 'utf-8');
            this.lastRecordedTs = this.newest.ts;
            this.log(`Recorded temp & rh`, this.newest.ts, this.newest.temp, this.newest.rh);
        }
        catch (err) {
            this.error(err);
        }
    };
    getRecordings = async () => {
        const lines = await (0, promises_1.readFile)(RECORDINGS_PATH, 'utf-8');
        return lines
            .split('\n')
            .map((line) => line.split(','))
            .map(([ts, temp, rh]) => ({ ts: ts, temp: Number(temp), rh: Number(rh) }))
            .filter((rec) => (0, date_fns_1.isValid)((0, date_fns_1.parseISO)(rec.ts)) && isFinite(rec.temp) && isFinite(rec.rh));
    };
}
exports.Sensor = Sensor;
//# sourceMappingURL=sensor.js.map