"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sensor = void 0;
const promises_1 = require("fs/promises");
const date_fns_1 = require("date-fns");
const service_1 = require("./service");
class Sensor extends service_1.Service {
    constructor() {
        super(...arguments);
        this.enabled = !process.env.SENSOR_DISABLED;
        this.dhtType = process.env.SENSOR_DHT_22 ? 22 : 11;
        this.dhtPin = 17;
        this.update = async () => {
            try {
                const { temperature, humidity } = await this.dht.read(this.dhtType, this.dhtPin);
                this.temperature = temperature;
                this.relativeHumidity = humidity;
                this.updatedAt = new Date();
            }
            catch (err) {
                console.error(err);
            }
        };
        this.record = async () => {
            try {
                const date = this.updatedAt;
                const temp = this.temperature;
                const rh = this.relativeHumidity;
                const fileName = `./data/recordings/${(0, date_fns_1.format)(date, 'yyyy_MM')}.txt`;
                if (isNaN(temp) || isNaN(rh)) {
                    console.error('Could not record data because of invalid values', date, temp, rh);
                    return;
                }
                if (!(await (0, promises_1.stat)(fileName).catch(() => false))) {
                    await (0, promises_1.writeFile)(fileName, `${date.toISOString()},${temp},${rh}\n`, 'utf-8');
                }
                else {
                    await (0, promises_1.appendFile)(fileName, `${date.toISOString()},${temp},${rh}\n`, 'utf-8');
                }
                console.log(`Recorded temp & rh`, date, temp, rh);
            }
            catch (err) {
                console.error(err);
            }
        };
    }
    async init() {
        if (!this.enabled) {
            console.log('SENSOR DISABLED');
            return;
        }
        try {
            this.dht = require('node-dht-sensor').promises;
            console.log(`SENSOR: TYPE: ${this.dhtType}, PIN: ${this.dhtPin}`);
        }
        catch (err) {
            console.error(err);
            return;
        }
        await this.update();
        if (process.env.SENSOR_UPDATE_INTERVAL) {
            const interval = 1000 * Number(process.env.SENSOR_UPDATE_INTERVAL);
            this.updateTimer = setInterval(this.update, interval);
            console.log('SENSOR UPDATE STARTED', interval);
        }
        else {
            console.log('SENSOR UPDATE DISABLED');
        }
        if (process.env.SENSOR_RECORDING_INTERVAL) {
            await (0, promises_1.mkdir)('./data/recordings/', { recursive: true });
            const interval = 1000 * Number(process.env.SENSOR_RECORDING_INTERVAL);
            this.recordTimer = setInterval(this.record, interval);
            console.log('SENSOR RECORDING STARTED', interval);
        }
        else {
            console.log('SENSOR RECORDING DISABLED');
        }
    }
    dispose() {
        clearInterval(this.updateTimer);
        clearInterval(this.recordTimer);
    }
}
exports.Sensor = Sensor;
