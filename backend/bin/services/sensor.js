"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sensor = void 0;
const service_1 = require("./service");
class Sensor extends service_1.Service {
    constructor() {
        super(...arguments);
        this.enabled = process.env.SENSOR_ENABLED === '1';
        this.dhtType = process.env.SENSOR_DHT_TYPE ? Number(process.env.SENSOR_DHT_TYPE) : 11;
        this.dhtPin = 17;
        this.update = async () => {
            try {
                const { temperature, humidity } = await this.dht.read(this.dhtType, this.dhtPin);
                this.newest = {
                    ts: new Date(),
                    temp: temperature,
                    rh: humidity
                };
            }
            catch (err) {
                this.error(err);
            }
        };
        this.record = async () => {
            try {
                if (!this.newest) {
                    this.error('Could not record sensors, no recording present!');
                    return;
                }
                if (this.lastRecordedTs.getTime() === this.newest.ts.getTime()) {
                    this.error('Skipping recording because no new values are available');
                    return;
                }
                await this.app.storage.run('INSERT INTO recordings (ts, temp, rh) VALUES (?, ?, ?)', [
                    this.newest.ts.toISOString(),
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
        this.getRecordings = async () => {
            return this.app.storage.all('SELECT ts, temp, rh FROM recordings');
        };
    }
    async init() {
        if (!this.enabled) {
            this.log('SENSOR DISABLED');
            return;
        }
        try {
            this.dht = require('node-dht-sensor').promises;
            this.log(`SENSOR: TYPE: ${this.dhtType}, PIN: ${this.dhtPin}`);
        }
        catch (err) {
            this.error(err);
        }
        await this.app.storage.run('CREATE TABLE IF NOT EXISTS recordings (id INTEGER PRIMARY KEY AUTOINCREMENT, ts DATETIME, temp DOUBLE, rh DOUBLE)');
        await this.update();
        if (process.env.SENSOR_UPDATE_INTERVAL) {
            const interval = 1000 * Number(process.env.SENSOR_UPDATE_INTERVAL);
            this.updateTimer = setInterval(this.update, interval);
            this.log('SENSOR UPDATE STARTED', interval);
        }
        else {
            this.log('SENSOR UPDATE DISABLED');
        }
        if (process.env.SENSOR_RECORDING_INTERVAL) {
            const interval = 1000 * Number(process.env.SENSOR_RECORDING_INTERVAL);
            this.recordTimer = setInterval(this.record, interval);
            this.log('SENSOR RECORDING STARTED', interval);
        }
        else {
            this.log('SENSOR RECORDING DISABLED');
        }
    }
    dispose() {
        clearInterval(this.updateTimer);
        clearInterval(this.recordTimer);
    }
}
exports.Sensor = Sensor;
