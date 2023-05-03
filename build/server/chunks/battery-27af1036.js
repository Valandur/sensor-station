import { stat } from 'fs/promises';
import { differenceInSeconds } from 'date-fns';
import { b as private_env } from './shared-server-b7e48788.js';

var BatteryState = /* @__PURE__ */ ((BatteryState2) => {
  BatteryState2[BatteryState2["NORMAL"] = 0] = "NORMAL";
  BatteryState2[BatteryState2["CHARGING_FROM_IN"] = 1] = "CHARGING_FROM_IN";
  BatteryState2[BatteryState2["CHARGING_FROM_5V_IO"] = 2] = "CHARGING_FROM_5V_IO";
  BatteryState2[BatteryState2["NONE"] = 3] = "NONE";
  return BatteryState2;
})(BatteryState || {});
var BatteryPowerState = /* @__PURE__ */ ((BatteryPowerState2) => {
  BatteryPowerState2[BatteryPowerState2["NONE"] = 0] = "NONE";
  BatteryPowerState2[BatteryPowerState2["BAD"] = 1] = "BAD";
  BatteryPowerState2[BatteryPowerState2["WEAK"] = 2] = "WEAK";
  BatteryPowerState2[BatteryPowerState2["PRESENT"] = 3] = "PRESENT";
  return BatteryPowerState2;
})(BatteryPowerState || {});
var BatteryChargingTemperature = /* @__PURE__ */ ((BatteryChargingTemperature2) => {
  BatteryChargingTemperature2[BatteryChargingTemperature2["NORMAL"] = 0] = "NORMAL";
  BatteryChargingTemperature2[BatteryChargingTemperature2["SUSPEND"] = 1] = "SUSPEND";
  BatteryChargingTemperature2[BatteryChargingTemperature2["COOL"] = 2] = "COOL";
  BatteryChargingTemperature2[BatteryChargingTemperature2["WARM"] = 3] = "WARM";
  return BatteryChargingTemperature2;
})(BatteryChargingTemperature || {});
const ENABLED = private_env.BATTERY_ENABLED === "1";
const CACHE_TIME = Number(private_env.BATTERY_CACHE_TIME);
const BUS_NUMBER = Number(private_env.BATTERY_BUS_NUMBER);
const I2C_ADDRESS = Number(private_env.BATTERY_I2C_ADDRESS);
Number(private_env.BATTERY_RECORDING_INTERVAL);
const CMD_STATUS = 64;
const CMD_FAULT_EVENT = 68;
const CMD_CHARGE_LEVEL = 65;
const CMD_BATTERY_TEMPERATURE = 71;
const CMD_BATTERY_VOLTAGE = 73;
const CMD_BATTERY_CURRENT = 75;
const CMD_IO_VOLTAGE = 77;
const CMD_IO_CURRENT = 79;
let status = null;
let cachedAt = /* @__PURE__ */ new Date(0);
async function getStatus() {
  if (differenceInSeconds(/* @__PURE__ */ new Date(), cachedAt) <= CACHE_TIME) {
    return status;
  }
  const bus = ENABLED ? await openBus() : null;
  if (!bus) {
    return null;
  }
  const data = await read(bus, CMD_STATUS, 1);
  const rawStatus = data.readUint8(0);
  const isFault = (rawStatus & 1) !== 0;
  const isButton = (rawStatus & 2) !== 0;
  const state = BatteryState[rawStatus >>> 2 & 3] || "UNKNOWN";
  const powerIn = BatteryPowerState[rawStatus >>> 4 & 3] || "UNKNOWN";
  const powerIn5vIo = BatteryPowerState[rawStatus >>> 6 & 3] || "UNKNOWN";
  const charge = await getChargeLevel(bus);
  const temperature = await getBatteryTemperature(bus);
  const fault = await getFaultStatus(bus);
  const voltage = await getBatteryVoltage(bus);
  const current = await getBatteryCurrent(bus);
  const ioVoltage = await getIOVoltage(bus);
  const ioCurrent = await getIOCurrent(bus);
  await bus.close();
  const newStatus = {
    ts: /* @__PURE__ */ new Date(),
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
  status = newStatus;
  cachedAt = /* @__PURE__ */ new Date();
  return newStatus;
}
async function openBus() {
  if (!await checkDevice()) {
    return null;
  }
  try {
    const str = "i2c";
    const i2c = await import(
      /* @vite-ignore */
      `${str}-bus`
    );
    return i2c.openPromisified(BUS_NUMBER);
  } catch (err) {
    console.error(err);
    return null;
  }
}
async function checkDevice() {
  const path = `/dev/i2c-${BUS_NUMBER}`;
  try {
    await stat(path);
    return true;
  } catch {
    console.warn(`PiJuice not available @ ${path}`);
    return false;
  }
}
async function getChargeLevel(bus) {
  const data = await read(bus, CMD_CHARGE_LEVEL, 1);
  return data.readUint8(0);
}
async function getBatteryTemperature(bus) {
  const data = await read(bus, CMD_BATTERY_TEMPERATURE, 2);
  let temp = data.readUint8(0);
  if (temp & 1 << 7) {
    temp = temp - (1 << 8);
  }
  return temp;
}
async function getBatteryVoltage(bus) {
  const data = await read(bus, CMD_BATTERY_VOLTAGE, 2);
  return data.readUInt16LE(0) / 1e3;
}
async function getBatteryCurrent(bus) {
  const data = await read(bus, CMD_BATTERY_CURRENT, 2);
  let curr = data.readUInt16LE(0);
  if (curr & 1 << 15) {
    curr = curr - (1 << 16);
  }
  return curr / 1e3;
}
async function getIOVoltage(bus) {
  const data = await read(bus, CMD_IO_VOLTAGE, 2);
  return data.readUInt16LE(0) / 1e3;
}
async function getIOCurrent(bus) {
  const data = await read(bus, CMD_IO_CURRENT, 2);
  let curr = data.readUInt16LE(0);
  if (curr & 1 << 15) {
    curr = curr - (1 << 16);
  }
  return curr / 1e3;
}
async function getFaultStatus(bus) {
  const data = await read(bus, CMD_FAULT_EVENT, 1);
  const status2 = data.readUint8(0);
  const buttonPowerOff = (status2 & 1) !== 0;
  const forcedPowerOff = (status2 & 2) !== 0;
  const forcedSysPowerOff = (status2 & 4) !== 0;
  const watchdogReset = (status2 & 8) !== 0;
  const batteryProfileInvalid = (status2 & 32) !== 0;
  const chargingTemperatureFault = BatteryChargingTemperature[status2 >>> 6 & 3] || "UNKNOWN";
  return {
    buttonPowerOff,
    forcedPowerOff,
    forcedSysPowerOff,
    watchdogReset,
    batteryProfileInvalid,
    chargingTemperatureFault
  };
}
async function read(bus, cmd, len, retry) {
  const { buffer, bytesRead } = await bus.readI2cBlock(
    I2C_ADDRESS,
    cmd,
    len + 1,
    Buffer.alloc(len + 1)
  );
  if (bytesRead !== len + 1) {
    throw new Error(`Read ${bytesRead} instead of ${len + 1} bytes`);
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
        return await read(bus, cmd, len, true);
      } else {
        throw new Error(
          `Checksums ${check} and ${check2} don't match ${buffer[buffer.length - 1]}`
        );
      }
    }
  }
  return buffer.slice(0, buffer.length - 1);
}

export { ENABLED as E, getStatus as g };
//# sourceMappingURL=battery-27af1036.js.map
