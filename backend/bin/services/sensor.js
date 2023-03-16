"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sensor = void 0;
const promises_1 = require("fs/promises");
const service_1 = require("./service");
const DEVICE_PATH = `/dev/gpiomem`;
class Sensor extends service_1.Service {
    dhtType = process.env['SENSOR_DHT_TYPE'] ? Number(process.env['SENSOR_DHT_TYPE']) : 11;
    dhtPin = process.env['SENSOR_DHT_PIN'] ? Number(process.env['SENSOR_DHT_PIN']) : 17;
    dht = null;
    lastRecordedTs = null;
    updateTimer = null;
    recordTimer = null;
    newest = null;
    async doInit() {
        await this.app.storage.run('CREATE TABLE IF NOT EXISTS recordings (id INTEGER PRIMARY KEY AUTOINCREMENT, ts DATETIME, temp DOUBLE, rh DOUBLE)');
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
        await this.update();
        if (process.env['SENSOR_UPDATE_INTERVAL']) {
            const interval = 1000 * Number(process.env['SENSOR_UPDATE_INTERVAL']);
            this.updateTimer = setInterval(this.update, interval);
            this.log('UPDATE STARTED', interval);
        }
        else {
            this.log('UPDATE DISABLED');
        }
        if (process.env['SENSOR_RECORDING_INTERVAL']) {
            const interval = 1000 * Number(process.env['SENSOR_RECORDING_INTERVAL']);
            this.recordTimer = setInterval(this.record, interval);
            this.log('RECORDING STARTED', interval);
        }
        else {
            this.log('RECORDING DISABLED');
        }
    }
    async doStop() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
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
            await (0, promises_1.stat)(DEVICE_PATH);
            return true;
        }
        catch {
            this.warn(`GPIO not available @ ${DEVICE_PATH}`);
            return false;
        }
    }
    update = async () => {
        if (!this.dht) {
            if (process.env['DEBUG'] === '1') {
                this.warn('Updating in DEBUG mode');
                this.newest = {
                    ts: new Date().toISOString(),
                    temp: Math.random() * 50 - 20,
                    rh: Math.random() * 60 + 20
                };
                return;
            }
            else {
                throw new Error(`DHT is not available`);
            }
        }
        try {
            const { temperature, humidity } = await this.dht.read(this.dhtType, this.dhtPin);
            this.newest = {
                ts: new Date().toISOString(),
                temp: temperature,
                rh: humidity
            };
        }
        catch (err) {
            this.error(err);
        }
    };
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
            await this.app.storage.run('INSERT INTO recordings (ts, temp, rh) VALUES (?, ?, ?)', [
                this.newest.ts,
                this.newest.temp,
                this.newest.rh
            ]);
            this.lastRecordedTs = this.newest.ts;
            this.log(`Recorded temp & rh`, this.newest);
        }
        catch (err) {
            this.error(err);
        }
    };
    getRecordings = async () => {
        return this.app.storage.all('SELECT ts, temp, rh FROM recordings');
    };
}
exports.Sensor = Sensor;
//# sourceMappingURL=sensor.js.map