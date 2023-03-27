"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Battery = exports.BatteryChargingTemperature = exports.PowerIn = exports.BatteryStatus = void 0;
const promises_1 = require("fs/promises");
const service_1 = require("./service");
const BUS_NUMBER = 0x01;
const I2C_ADDRESS = 0x14;
const CMD_STATUS = 0x40;
const CMD_FAULT_EVENT = 0x44;
const CMD_CHARGE_LEVEL = 0x41;
// const CMD_BUTTON_EVENT = 0x45;
const CMD_BATTERY_TEMPERATURE = 0x47;
const CMD_BATTERY_VOLTAGE = 0x49;
const CMD_BATTERY_CURRENT = 0x4b;
const CMD_IO_VOLTAGE = 0x4d;
const CMD_IO_CURRENT = 0x4f;
// const CMD_LED_STATE = 0x66;
// const CMD_LED_BLINK = 0x68;
// const CMD_IO_PIN_ACCESS = 0x75;
const DEVICE_PATH = `/dev/i2c-${BUS_NUMBER}`;
var BatteryStatus;
(function (BatteryStatus) {
    BatteryStatus[BatteryStatus["NORMAL"] = 0] = "NORMAL";
    BatteryStatus[BatteryStatus["CHARGING_FROM_IN"] = 1] = "CHARGING_FROM_IN";
    BatteryStatus[BatteryStatus["CHARGING_FROM_5V_IO"] = 2] = "CHARGING_FROM_5V_IO";
    BatteryStatus[BatteryStatus["NONE"] = 3] = "NONE";
})(BatteryStatus = exports.BatteryStatus || (exports.BatteryStatus = {}));
var PowerIn;
(function (PowerIn) {
    PowerIn[PowerIn["NONE"] = 0] = "NONE";
    PowerIn[PowerIn["BAD"] = 1] = "BAD";
    PowerIn[PowerIn["WEAK"] = 2] = "WEAK";
    PowerIn[PowerIn["PRESENT"] = 3] = "PRESENT";
})(PowerIn = exports.PowerIn || (exports.PowerIn = {}));
var BatteryChargingTemperature;
(function (BatteryChargingTemperature) {
    BatteryChargingTemperature[BatteryChargingTemperature["NORMAL"] = 0] = "NORMAL";
    BatteryChargingTemperature[BatteryChargingTemperature["SUSPEND"] = 1] = "SUSPEND";
    BatteryChargingTemperature[BatteryChargingTemperature["COOL"] = 2] = "COOL";
    BatteryChargingTemperature[BatteryChargingTemperature["WARM"] = 3] = "WARM";
})(BatteryChargingTemperature = exports.BatteryChargingTemperature || (exports.BatteryChargingTemperature = {}));
class Battery extends service_1.Service {
    bus = null;
    timer = null;
    updatedAt = null;
    status = null;
    async doInit() {
        if (!(await this.checkDevice())) {
            return;
        }
        try {
            const i2c = require('i2c-bus');
            this.bus = await i2c.openPromisified(BUS_NUMBER);
        }
        catch (err) {
            this.error(err);
        }
    }
    async doStart() {
        // If we didn't initilialize it's not available, so exit early
        if (!this.bus) {
            if (process.env['DEBUG'] === '1') {
                this.status = {
                    isFault: false,
                    isButton: false,
                    status: 'CHARGING_FROM_IN',
                    powerIn: 'PRESENT',
                    powerIn5vIo: 'NONE',
                    charge: 43,
                    current: -1.132,
                    voltage: 3.942,
                    temperature: 56.2,
                    ioVoltage: 5.23,
                    ioCurrent: 1.02,
                    fault: {
                        batteryProfileInvalid: false,
                        buttonPowerOff: false,
                        forcedPowerOff: false,
                        forcedSysPowerOff: false,
                        watchdogReset: false,
                        chargingTemperatureFault: 'UNKNOWN'
                    }
                };
            }
            return;
        }
        await this.update();
        if (process.env['BATTERY_UPDATE_INTERVAL']) {
            const interval = 1000 * Number(process.env['BATTERY_UPDATE_INTERVAL']);
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
    }
    async doDispose() {
        if (this.bus) {
            await this.bus.close();
            this.bus = null;
        }
    }
    async checkDevice() {
        try {
            await (0, promises_1.stat)(DEVICE_PATH);
            return true;
        }
        catch {
            this.warn(`PiJuice not available @ ${DEVICE_PATH}`);
            return false;
        }
    }
    update = async () => {
        try {
            this.status = await this.getStatus();
            this.updatedAt = new Date();
        }
        catch (err) {
            this.error(err);
        }
    };
    async getStatus() {
        const data = await this.read(CMD_STATUS, 1);
        const rawStatus = data.readUint8(0);
        const isFault = (rawStatus & 0x01) !== 0;
        const isButton = (rawStatus & 0x02) !== 0;
        const status = BatteryStatus[(rawStatus >>> 2) & 0x03] || 'UNKNOWN';
        const powerIn = PowerIn[(rawStatus >>> 4) & 0x03] || 'UNKNOWN';
        const powerIn5vIo = PowerIn[(rawStatus >>> 6) & 0x03] || 'UNKNOWN';
        const charge = await this.getChargeLevel();
        const voltage = await this.getBatteryVoltage();
        const current = await this.getBatteryCurrent();
        const temperature = await this.getBatteryTemperature();
        const ioVoltage = await this.getIOVoltage();
        const ioCurrent = await this.getIOCurrent();
        const fault = await this.getFaultStatus();
        return {
            isFault,
            isButton,
            status,
            powerIn,
            powerIn5vIo,
            charge,
            voltage,
            current,
            temperature,
            ioVoltage,
            ioCurrent,
            fault
        };
    }
    async getChargeLevel() {
        const data = await this.read(CMD_CHARGE_LEVEL, 1);
        return data.readUint8(0);
    }
    async getBatteryTemperature() {
        const data = await this.read(CMD_BATTERY_TEMPERATURE, 2);
        let temp = data.readUint8(0);
        if (temp & (1 << 7)) {
            temp = temp - (1 << 8);
        }
        return temp;
    }
    async getBatteryVoltage() {
        const data = await this.read(CMD_BATTERY_VOLTAGE, 2);
        return data.readUInt16LE(0) / 1000;
    }
    async getBatteryCurrent() {
        const data = await this.read(CMD_BATTERY_CURRENT, 2);
        let curr = data.readUInt16LE(0);
        if (curr & (1 << 15)) {
            curr = curr - (1 << 16);
        }
        return curr / 1000;
    }
    async getIOVoltage() {
        const data = await this.read(CMD_IO_VOLTAGE, 2);
        return data.readUInt16LE(0) / 1000;
    }
    async getIOCurrent() {
        const data = await this.read(CMD_IO_CURRENT, 2);
        let curr = data.readUInt16LE(0);
        if (curr & (1 << 15)) {
            curr = curr - (1 << 16);
        }
        return curr / 1000;
    }
    async getFaultStatus() {
        const data = await this.read(CMD_FAULT_EVENT, 1);
        const status = data.readUint8(0);
        const buttonPowerOff = (status & 0x01) !== 0;
        const forcedPowerOff = (status & 0x02) !== 0;
        const forcedSysPowerOff = (status & 0x04) !== 0;
        const watchdogReset = (status & 0x08) !== 0;
        const batteryProfileInvalid = (status & 0x20) !== 0;
        const chargingTemperatureFault = BatteryChargingTemperature[(status >>> 6) & 0x03] || 'UNKNOWN';
        return {
            buttonPowerOff,
            forcedPowerOff,
            forcedSysPowerOff,
            watchdogReset,
            batteryProfileInvalid,
            chargingTemperatureFault
        };
    }
    read = async (cmd, len, retry) => {
        if (!this.bus) {
            throw new Error('Bus not initialized');
        }
        const { buffer, bytesRead } = await this.bus.readI2cBlock(I2C_ADDRESS, cmd, len + 1, Buffer.alloc(len + 1));
        if (bytesRead !== len + 1) {
            throw new Error(`Read ${bytesRead} instead of ${len + 1} bytes`);
        }
        let check = 0xff;
        for (let i = 0; i < buffer.length - 1; i++) {
            check ^= buffer.readUint8(i);
        }
        if (check !== buffer[buffer.length - 1]) {
            // With n+1 byte data (n data bytes and 1 checksum byte) sometimes the
            // MSbit of the first received data byte is 0 while it should be 1. So we
            // repeat the checksum test with the MSbit of the first data byte set to 1.
            // See: https://github.com/PiSupply/PiJuice/blob/master/Software/Source/pijuice.py#L97
            buffer[0] |= 0x80;
            let check2 = 0xff;
            for (let i = 0; i < buffer.length - 1; i++) {
                check2 ^= buffer.readUint8(i);
            }
            if (check2 !== buffer[buffer.length - 1]) {
                if (!retry) {
                    return await this.read(cmd, len, true);
                }
                else {
                    throw new Error(`Checksums ${check} and ${check2} don't match ${buffer[buffer.length - 1]}`);
                }
            }
        }
        return buffer.slice(0, buffer.length - 1);
    };
}
exports.Battery = Battery;
//# sourceMappingURL=battery.js.map