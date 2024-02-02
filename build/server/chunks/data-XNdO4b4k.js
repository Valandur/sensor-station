import { mkdir, stat, appendFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { e as error } from './index-H42hWO6o.js';
import { isSameMinute, format } from 'date-fns';
import { d as private_env } from './shared-server-49TKSBDM.js';
import { B as BaseCache } from './BaseCache-CtKtXkXQ.js';
import { B as BaseLogger } from './BaseLogger-SyOYFtXW.js';

var BatteryChargingTemperature = /* @__PURE__ */ ((BatteryChargingTemperature2) => {
  BatteryChargingTemperature2[BatteryChargingTemperature2["NORMAL"] = 0] = "NORMAL";
  BatteryChargingTemperature2[BatteryChargingTemperature2["SUSPEND"] = 1] = "SUSPEND";
  BatteryChargingTemperature2[BatteryChargingTemperature2["COOL"] = 2] = "COOL";
  BatteryChargingTemperature2[BatteryChargingTemperature2["WARM"] = 3] = "WARM";
  return BatteryChargingTemperature2;
})(BatteryChargingTemperature || {});
var BatteryPowerState = /* @__PURE__ */ ((BatteryPowerState2) => {
  BatteryPowerState2[BatteryPowerState2["NONE"] = 0] = "NONE";
  BatteryPowerState2[BatteryPowerState2["BAD"] = 1] = "BAD";
  BatteryPowerState2[BatteryPowerState2["WEAK"] = 2] = "WEAK";
  BatteryPowerState2[BatteryPowerState2["PRESENT"] = 3] = "PRESENT";
  return BatteryPowerState2;
})(BatteryPowerState || {});
var BatteryState = /* @__PURE__ */ ((BatteryState2) => {
  BatteryState2[BatteryState2["NORMAL"] = 0] = "NORMAL";
  BatteryState2[BatteryState2["CHARGING_FROM_IN"] = 1] = "CHARGING_FROM_IN";
  BatteryState2[BatteryState2["CHARGING_FROM_5V_IO"] = 2] = "CHARGING_FROM_5V_IO";
  BatteryState2[BatteryState2["NONE"] = 3] = "NONE";
  return BatteryState2;
})(BatteryState || {});
const CMD_STATUS = 64;
const CMD_FAULT_EVENT = 68;
const CMD_CHARGE_LEVEL = 65;
const CMD_BATTERY_TEMPERATURE = 71;
const CMD_BATTERY_VOLTAGE = 73;
const CMD_BATTERY_CURRENT = 75;
const CMD_IO_VOLTAGE = 77;
const CMD_IO_CURRENT = 79;
class Device {
  bus = null;
  busNumber;
  i2cAddress;
  constructor(busNumber, i2cAddress) {
    this.busNumber = busNumber;
    this.i2cAddress = i2cAddress;
  }
  async open() {
    const str = "i2c";
    const i2c = await import(
      /* @vite-ignore */
      `${str}-bus`
    );
    this.bus = await i2c.openPromisified(this.busNumber);
  }
  async close() {
    return this.bus?.close();
  }
  async checkReady() {
    const path = `/dev/i2c-${this.busNumber}`;
    if (!await stat(path).catch(() => null)) {
      return false;
    }
    return true;
  }
  async readAll() {
    const data = await this.read(CMD_STATUS, 1);
    const rawStatus = data.readUint8(0);
    const isFault = (rawStatus & 1) !== 0;
    const isButton = (rawStatus & 2) !== 0;
    const state = BatteryState[rawStatus >>> 2 & 3] || "UNKNOWN";
    const powerIn = BatteryPowerState[rawStatus >>> 4 & 3] || "UNKNOWN";
    const powerIn5vIo = BatteryPowerState[rawStatus >>> 6 & 3] || "UNKNOWN";
    const charge = await this.getChargeLevel();
    const temperature = await this.getBatteryTemperature();
    const fault = await this.getFaultStatus();
    const voltage = await this.getBatteryVoltage();
    const current = await this.getBatteryCurrent();
    const ioVoltage = await this.getIOVoltage();
    const ioCurrent = await this.getIOCurrent();
    return {
      isFault,
      isButton,
      state,
      charge,
      temperature,
      powerIn: {
        state: powerIn,
        voltage,
        current
      },
      powerIn5vIo: {
        state: powerIn5vIo,
        voltage: ioVoltage,
        current: ioCurrent
      },
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
    if (temp & 1 << 7) {
      temp = temp - (1 << 8);
    }
    return temp;
  }
  async getBatteryVoltage() {
    const data = await this.read(CMD_BATTERY_VOLTAGE, 2);
    return data.readUInt16LE(0) / 1e3;
  }
  async getBatteryCurrent() {
    const data = await this.read(CMD_BATTERY_CURRENT, 2);
    let curr = data.readUInt16LE(0);
    if (curr & 1 << 15) {
      curr = curr - (1 << 16);
    }
    return curr / 1e3;
  }
  async getIOVoltage() {
    const data = await this.read(CMD_IO_VOLTAGE, 2);
    return data.readUInt16LE(0) / 1e3;
  }
  async getIOCurrent() {
    const data = await this.read(CMD_IO_CURRENT, 2);
    let curr = data.readUInt16LE(0);
    if (curr & 1 << 15) {
      curr = curr - (1 << 16);
    }
    return curr / 1e3;
  }
  async getFaultStatus() {
    const data = await this.read(CMD_FAULT_EVENT, 1);
    const status = data.readUint8(0);
    const buttonPowerOff = (status & 1) !== 0;
    const forcedPowerOff = (status & 2) !== 0;
    const forcedSysPowerOff = (status & 4) !== 0;
    const watchdogReset = (status & 8) !== 0;
    const batteryProfileInvalid = (status & 32) !== 0;
    const chargingTemperatureFault = BatteryChargingTemperature[status >>> 6 & 3] || "UNKNOWN";
    return {
      buttonPowerOff,
      forcedPowerOff,
      forcedSysPowerOff,
      watchdogReset,
      batteryProfileInvalid,
      chargingTemperatureFault
    };
  }
  async read(cmd, len, retry) {
    if (!this.bus) {
      throw new Error("battery.noBus");
    }
    const { buffer, bytesRead } = await this.bus.readI2cBlock(
      this.i2cAddress,
      cmd,
      len + 1,
      Buffer.alloc(len + 1)
    );
    if (bytesRead !== len + 1) {
      throw new Error("battery.incorrectByteCountRead");
    }
    let check = 255;
    for (let i = 0; i < buffer.length - 1; i++) {
      check ^= buffer.readUint8(i);
    }
    if (check !== buffer[buffer.length - 1]) {
      buffer[0] |= 128;
      let check2 = 255;
      for (let i = 0; i < buffer.length - 1; i++) {
        check2 ^= buffer.readUint8(i);
      }
      if (check2 !== buffer[buffer.length - 1]) {
        if (!retry) {
          return await this.read(cmd, len, true);
        } else {
          throw new Error("battery.invalidChecksum");
        }
      }
    }
    return buffer.subarray(0, buffer.length - 1);
  }
}
const ENABLED = private_env.BATTERY_ENABLED === "1";
const CACHE_TIME = Number(private_env.BATTERY_CACHE_TIME);
const BUS_NUMBER = Number(private_env.BATTERY_BUS_NUMBER);
const I2C_ADDRESS = Number(private_env.BATTERY_I2C_ADDRESS);
const RECORDING_INTERVAL = Number(private_env.BATTERY_RECORDING_INTERVAL);
const RECORDING_FORMAT = private_env.BATTERY_RECORDING_FORMAT;
const RECORDINGS_PATH = "data/battery/recording";
const logger = new BaseLogger("BATTERY");
const cache = new BaseCache(logger, CACHE_TIME);
let recordTimer = null;
let lastRecordedTs = /* @__PURE__ */ new Date(0);
async function getData(forceUpdate = false) {
  let device = null;
  if (!ENABLED) {
    throw error(400, {
      message: `Battery is disabled`,
      key: "battery.disabled"
    });
  }
  return cache.withDefault(
    forceUpdate,
    async () => {
      device = new Device(BUS_NUMBER, I2C_ADDRESS);
      if (!await device.checkReady()) {
        throw error(500, {
          message: `Modem not ready`,
          key: "modem.notReady"
        });
      }
      await device.open();
      const data = await device.readAll();
      return {
        ts: /* @__PURE__ */ new Date(),
        ...data
      };
    },
    async () => {
      await device?.close();
    }
  );
}
function setup() {
  if (recordTimer) {
    logger.info("Recording stopped");
    clearInterval(recordTimer);
    recordTimer = null;
  }
  if (!RECORDING_INTERVAL) {
    return;
  }
  logger.info("Recording started", RECORDING_INTERVAL);
  recordTimer = setInterval(() => record(), RECORDING_INTERVAL * 1e3);
}
async function record() {
  try {
    const data = cache.getDefaultData();
    if (!data) {
      logger.warn("No data to record");
      return;
    }
    if (isSameMinute(lastRecordedTs, data.ts)) {
      logger.debug("Skipping recording because no new data is available");
      return;
    }
    const fileName = `${RECORDINGS_PATH}_${format(/* @__PURE__ */ new Date(), RECORDING_FORMAT)}.csv`;
    await mkdir(dirname(fileName), { recursive: true });
    if (!await stat(fileName).catch(() => null)) {
      await appendFile(fileName, csvHeader(), "utf-8");
    }
    const recordedTs = new Date(data.ts);
    const recordedData = JSON.parse(JSON.stringify(data));
    await appendFile(fileName, dataToCsv(recordedData), "utf-8");
    lastRecordedTs = recordedTs;
    logger.debug(`Recorded`, recordedTs, recordedData.state, recordedData.charge);
  } catch (err) {
    logger.error(err);
  }
}
function csvHeader() {
  return `Timestamp,IsFault,IsButton,State,Charge,Temperature,PowerIn_State,PowerIn_Voltage,PowerIn_Current,PowerIn5vIO_State,PowerIn5vIO_Voltage,PowerIn5vIO_Current,ButtonPowerOff,ForcedPowerOff,ForcedSysPowerOff,WatchdogReset,BatteryProfileInvalid,ChargingTemperatureFault
`;
}
function dataToCsv(s) {
  const p = s.powerIn;
  const p5 = s.powerIn5vIo;
  const f = s.fault;
  return `${s.ts},${s.isFault},${s.isButton},${s.state},${s.charge},${s.temperature},${p.state},${p.voltage},${p.current},${p5.state},${p5.voltage},${p5.current},${f.buttonPowerOff},${f.forcedPowerOff},${f.forcedSysPowerOff},${f.watchdogReset},${f.batteryProfileInvalid},${f.chargingTemperatureFault}
`;
}

export { getData as g, setup as s };
//# sourceMappingURL=data-XNdO4b4k.js.map
