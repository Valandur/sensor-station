import { dirname } from 'path';
import { mkdir, readFile, writeFile, stat, rm as rm$1 } from 'fs/promises';
import { d as private_env, i as isHttpError, e as error, f as fail } from './index2-ahRAPocb.js';
import { format } from 'date-fns/format';
import { inspect } from 'node:util';
import chalk from 'chalk';
import { parseISO, differenceInMinutes, parse, differenceInSeconds } from 'date-fns';
import { mkdir as mkdir$1, stat as stat$1, writeFile as writeFile$1, rm, readFile as readFile$1, readdir } from 'node:fs/promises';
import { google } from 'googleapis';
import Holidays from 'date-holidays';
import { isSameDay } from 'date-fns/isSameDay';
import { createWriteStream } from 'node:fs';
import { basename } from 'node:path';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { createHash } from 'node:crypto';
import getDimensions from 'get-video-dimensions';
import imageSize from 'image-size';
import mime from 'mime-types';
import { find } from 'geo-tz/now';
import { Client } from '@googlemaps/google-maps-services-js';
import { SerialPort, InterByteTimeoutParser } from 'serialport';
import { networkInterfaces } from 'node:os';
import { resolve } from 'node:dns/promises';
import { exec } from 'node:child_process';
import wifi from 'node-wifi';
import { Parser } from 'xml2js';
import { parse as parse$1 } from 'node-html-parser';
import Parser$1 from 'rss-parser';
import { decode } from 'html-entities';
import makeFetchCookie from 'fetch-cookie';
import { parseISO as parseISO$1 } from 'date-fns/parseISO';
import { CookieJar } from 'tough-cookie';
import TuyAPI from 'tuyapi';

const BATTERY_SERVICE_TYPE = "battery";
const BATTERY_SERVICE_ACTIONS = ["main", "config", "icon"];
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
const CALENDAR_SERVICE_TYPE = "calendar";
const CALENDAR_SERVICE_ACTIONS = ["main", "config"];
const CAROUSEL_SERVICE_TYPE = "carousel";
const CAROUSEL_SERVICE_ACTIONS = ["main", "config"];
const EPIC_GAMES_SERVICE_TYPE = "epic-games";
const EPIC_GAMES_SERVICE_ACTIONS = ["main", "config"];
const GALLERY_SERVICE_TYPE = "gallery";
const GALLERY_SERVICE_ACTIONS = ["main", "config"];
const MODEM_SERVICE_TYPE = "modem";
const MODEM_SERVICE_ACTIONS = ["main", "icon", "config"];
var ModemNetworkType = /* @__PURE__ */ ((ModemNetworkType2) => {
  ModemNetworkType2[ModemNetworkType2["NONE"] = 0] = "NONE";
  ModemNetworkType2[ModemNetworkType2["GSM"] = 1] = "GSM";
  ModemNetworkType2[ModemNetworkType2["GPRS"] = 2] = "GPRS";
  ModemNetworkType2[ModemNetworkType2["EDGE"] = 3] = "EDGE";
  ModemNetworkType2[ModemNetworkType2["WCDMA"] = 4] = "WCDMA";
  ModemNetworkType2[ModemNetworkType2["WCDMA_HSDPA"] = 5] = "WCDMA_HSDPA";
  ModemNetworkType2[ModemNetworkType2["WCDMA_HSUPA"] = 6] = "WCDMA_HSUPA";
  ModemNetworkType2[ModemNetworkType2["HSPA"] = 7] = "HSPA";
  ModemNetworkType2[ModemNetworkType2["LTE"] = 8] = "LTE";
  ModemNetworkType2[ModemNetworkType2["TDS_CDMA"] = 9] = "TDS_CDMA";
  ModemNetworkType2[ModemNetworkType2["TDS_HSDPA"] = 10] = "TDS_HSDPA";
  ModemNetworkType2[ModemNetworkType2["TDS_HSUPA"] = 11] = "TDS_HSUPA";
  ModemNetworkType2[ModemNetworkType2["TDS_HSPA"] = 12] = "TDS_HSPA";
  ModemNetworkType2[ModemNetworkType2["CDMA"] = 13] = "CDMA";
  ModemNetworkType2[ModemNetworkType2["EVDO"] = 14] = "EVDO";
  ModemNetworkType2[ModemNetworkType2["HYBRID"] = 15] = "HYBRID";
  ModemNetworkType2[ModemNetworkType2["CDMA_LTE"] = 16] = "CDMA_LTE";
  ModemNetworkType2[ModemNetworkType2["eHRPD"] = 23] = "eHRPD";
  ModemNetworkType2[ModemNetworkType2["CDMA_eHRPD"] = 24] = "CDMA_eHRPD";
  return ModemNetworkType2;
})(ModemNetworkType || {});
const NETWORK_SERVICE_TYPE = "network";
const NETWORK_SERVICE_ACTIONS = ["main", "config", "icon"];
const PRUSA_SERVICE_TYPE = "prusa";
const PRUSA_SERVICE_ACTIONS = ["main", "config"];
const SBB_ALERTS_SERVICE_TYPE = "sbb-alerts";
const SBB_ALERTS_SERVICE_ACTIONS = ["main", "config"];
const SBB_DEPARTURES_SERVICE_TYPE = "sbb-departures";
const SBB_DEPARTURES_SERVICE_ACTIONS = ["main", "config"];
const SRF_SERVICE_TYPE = "srf";
const SRF_SERVICE_ACTIONS = ["main", "details", "config"];
const SWISS_POST_SERVICE_TYPE = "swiss-post";
const SWISS_POST_SERVICE_ACTIONS = ["main", "config"];
const GLOBAL_STATUS = {
  CANCELLED: "Annulliert",
  ARCHIVED: "Archiviert",
  MISSED_DELIVERY: "Verpasst",
  RETURNED: "Rücksendung",
  UNKNOWN: "Unbekannt",
  DELIVERED: "Geliefert",
  TO_BE_DELIVERED: "Unterwegs",
  REPORTED: "Angemeldet"
};
const TUYA_SERVICE_TYPE = "tuya";
const TUYA_SERVICE_ACTIONS = ["main", "config"];
const FILTER_LIFE_MAX = 43200;
const PUMP_TIME_MAX = 86400;
const UV_RUNTIME_MAX = 10800;
const IDENT = (value) => value;
const PROP_MAP = /* @__PURE__ */ new Map([
  [1, { key: "on", map: IDENT }],
  [3, { key: "waterTime", map: IDENT }],
  [4, { key: "filterLife", map: (value) => value / FILTER_LIFE_MAX * 100 }],
  [5, { key: "pumpTime", map: (value) => value / PUMP_TIME_MAX * 100 }],
  [6, { key: "waterReset", map: IDENT }],
  [7, { key: "filterReset", map: IDENT }],
  [8, { key: "pumpReset", map: IDENT }],
  [10, { key: "uv", map: IDENT }],
  [11, { key: "uvRuntime", map: (value) => value / UV_RUNTIME_MAX * 100 }],
  [
    12,
    {
      key: "waterLevel",
      map: (value) => value === "level_3" ? 100 : value === "level_2" ? 50 : 0
    }
  ],
  [101, { key: "waterLack", map: IDENT }],
  [102, { key: "ecoMode", map: IDENT }],
  [103, { key: "waterState", map: IDENT }],
  [104, { key: "waterEmpty", map: IDENT }]
]);
const WEATHER_SERVICE_TYPE = "weather";
const WEATHER_SERVICE_ACTIONS = ["config", "daily", "hourly", "alerts"];
const ICON_MAP = {
  200: "thunderstorm",
  201: "thunderstorm",
  202: "thunderstorm",
  210: "thunderstorm",
  211: "thunderstorm",
  212: "thunderstorm",
  221: "thunderstorm",
  230: "thunderstorm",
  231: "thunderstorm",
  232: "thunderstorm",
  300: "drizzle",
  301: "drizzle",
  302: "drizzle",
  310: "drizzle",
  311: "drizzle",
  312: "drizzle",
  313: "drizzle",
  314: "drizzle",
  321: "drizzle",
  500: "rain",
  501: "rain",
  502: "heavyrain",
  503: "heavyrain",
  504: "heavyrain",
  511: "snow",
  520: "drizzle",
  521: "drizzle",
  522: "drizzle",
  531: "drizzle",
  600: "snow",
  601: "snow",
  602: "heavysnow",
  611: "snow",
  612: "snow",
  613: "snow",
  615: "snow",
  616: "snow",
  620: "snow",
  621: "snow",
  622: "heavysnow",
  701: "foggy",
  711: "foggy",
  721: "foggy",
  731: "sandstorm",
  741: "foggy",
  751: "sand",
  761: "sand",
  762: "sand",
  771: "wind",
  781: "tornado",
  800: "clear",
  801: "clouds",
  802: "clouds",
  803: "overcast",
  804: "overcast"
};

const DHT_SENSOR_SERVICE_TYPE = "dht-sensor";
const DHT_SENSOR_SERVICE_ACTIONS = ["main", "config"];
class Logger {
  constructor(moduleName) {
    this.moduleName = moduleName;
    this.moduleLowerName = moduleName.toLowerCase();
  }
  moduleLowerName;
  getDate() {
    return chalk.grey(format(/* @__PURE__ */ new Date(), "HH:mm:ss"));
  }
  debug(message, ...params) {
    const msg = chalk.gray(typeof message === "string" ? message : inspect(message));
    console.log(
      `${this.getDate()} [${chalk.gray("DEBUG")}] [${chalk.green(this.moduleName)}] ${msg}`,
      ...params
    );
  }
  info(message, ...params) {
    const msg = typeof message === "string" ? message : inspect(message);
    console.log(
      `${this.getDate()} [${chalk.cyan("INFO")}] [${chalk.green(this.moduleName)}] ${msg}`,
      ...params
    );
  }
  warn(message, ...params) {
    const msg = chalk.yellow(typeof message === "string" ? message : inspect(message));
    console.log(
      `${this.getDate()} [${chalk.yellow("WARN")}] [${chalk.green(this.moduleName)}] ${msg}`,
      ...params
    );
  }
  error(message, ...params) {
    const msg = chalk.red(typeof message === "string" ? message : inspect(message));
    console.error(
      `${this.getDate()} [${chalk.red("ERROR")}] [${chalk.green(this.moduleName)}] ${msg}`,
      ...params
    );
  }
  toSvelteError(err, extra) {
    this.error(err);
    if (isHttpError(err)) {
      err.body = { ...extra, ...err.body, params: { ...extra?.params, ...err.body.params } };
      return err;
    }
    try {
      return error(500, {
        ...extra,
        message: err instanceof Error ? err.message : JSON.stringify(err),
        params: { ...extra?.params, error: JSON.parse(JSON.stringify(err)) }
      });
    } catch (err2) {
      return err2;
    }
  }
}
class BaseService {
  name;
  config;
  logger;
  _actions;
  constructor(name, config) {
    this.name = name;
    this.logger = new Logger(name);
    this.config = config ?? this.getDefaultConfig();
    this._actions = this.getActions();
  }
  async init() {
  }
  get(action, options) {
    const func = this._actions[action]?.get;
    if (!func) {
      error(400, `Get action '${action}' not supported on service ${this.name}`);
    }
    return func(options);
  }
  set(action, options) {
    const func = this._actions[action]?.set;
    if (!func) {
      error(400, `Set action '${action}' not supported on service ${this.name}`);
    }
    return func(options);
  }
  serialize() {
    return {
      name: this.name,
      type: this.type,
      config: this.config
    };
  }
}
const DEFAULT_KEY = "__default__";
const DEFAULT_RESULT_CACHE_TIME = Number(private_env.CACHE_DEFAULT_RESULT_CACHE_TIME);
const DEFAULT_ERROR_CACHE_TIME = Number(private_env.CACHE_DEFAULT_ERROR_CACHE_TIME);
class Cache {
  logger;
  cache = /* @__PURE__ */ new Map();
  constructor(logger) {
    this.logger = logger;
  }
  getDefaultData() {
    return this.getData(DEFAULT_KEY);
  }
  getTs(key) {
    return this.cache.get(key)?.updatedAt || null;
  }
  getData(key) {
    return this.cache.get(key)?.data || null;
  }
  async with(options, onTry, onFinally, onCatch) {
    const key = options.key ?? DEFAULT_KEY;
    const cacheEntry = this.cache.get(key);
    let updatedAt = cacheEntry?.updatedAt || /* @__PURE__ */ new Date(0);
    let cachedData = cacheEntry?.data || null;
    let cachedError = cacheEntry?.error || null;
    if (!options.force) {
      const timeDiff = differenceInSeconds(/* @__PURE__ */ new Date(), updatedAt);
      if (cachedData && timeDiff <= (options.resultCacheTime ?? DEFAULT_RESULT_CACHE_TIME)) {
        this.logger.debug("Using cached data");
        return cachedData;
      } else if (cachedError && timeDiff <= (options.errorCacheTime ?? DEFAULT_ERROR_CACHE_TIME)) {
        this.logger.debug("Using cached error");
        throw cachedError;
      }
    }
    this.logger.debug("Updating...");
    const startTime = process.hrtime.bigint();
    try {
      const newData = await onTry(cachedData);
      cachedData = newData;
      cachedError = null;
      return cachedData;
    } catch (err) {
      cachedError = this.logger.toSvelteError(err);
      if (onCatch) {
        await onCatch(cachedError).catch((err2) => this.logger.warn("Catch error", err2));
      }
      throw cachedError;
    } finally {
      if (onFinally) {
        await onFinally().catch((err) => this.logger.warn("Finally error", err));
      }
      updatedAt = /* @__PURE__ */ new Date();
      this.cache.set(key, { updatedAt, data: cachedData, error: cachedError });
      const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
      this.logger.info("Updated", diffTime, "ms");
    }
  }
}
const CMD_STATUS = 64;
const CMD_FAULT_EVENT = 68;
const CMD_CHARGE_LEVEL = 65;
const CMD_BATTERY_TEMPERATURE = 71;
const CMD_BATTERY_VOLTAGE = 73;
const CMD_BATTERY_CURRENT = 75;
const CMD_IO_VOLTAGE = 77;
const CMD_IO_CURRENT = 79;
let Device$1 = class Device {
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
    if (!await stat$1(path).catch(() => null)) {
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
};
const ENABLED$e = private_env.BATTERY_ENABLED === "1";
class BatteryService extends BaseService {
  static actions = BATTERY_SERVICE_ACTIONS;
  type = BATTERY_SERVICE_TYPE;
  cache = new Cache(this.logger);
  getDefaultConfig() {
    return {
      busNumber: 1,
      i2cAddress: 20
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      },
      icon: {
        get: this.getData.bind(this)
      }
    };
  }
  async getConfig(_) {
    if (!ENABLED$e) {
      error(400, `Battery is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config
    };
  }
  async setConfig({ form }) {
    const busNumber = Number(form.get("busNumber"));
    if (!isFinite(busNumber)) {
      return fail(400, { message: "Invalid bus number" });
    }
    const i2cAddress = Number(form.get("i2cAddress"));
    if (!isFinite(i2cAddress)) {
      return fail(400, { message: "Invalid i2c address" });
    }
    this.config.busNumber = busNumber;
    this.config.i2cAddress = i2cAddress;
  }
  async getData({ url }) {
    if (!ENABLED$e) {
      error(400, `Battery is disabled`);
    }
    const forceUpdate = url.searchParams.has("force");
    let device = null;
    const data = await this.cache.with(
      {
        key: `${this.config.busNumber}-${this.config.i2cAddress}`,
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        device = new Device$1(this.config.busNumber, this.config.i2cAddress);
        if (!await device.checkReady()) {
          error(500, `Battery not ready`);
        }
        await device.open();
        const info = await device.readAll();
        return {
          ts: /* @__PURE__ */ new Date(),
          info
        };
      },
      async () => {
        await device?.close();
      }
    );
    return {
      ts: data.ts,
      type: "data",
      info: data.info
    };
  }
}
function clamp(max, idx, amount, array) {
  const index = clampIndex(max, idx, amount);
  const prev = clampIndex(max, idx - 1, amount);
  const next = clampIndex(max, idx + 1, amount);
  const arr = array.slice(index, index + amount);
  return [arr, prev, next, index];
}
function clampIndex(max, idx, amount) {
  return Math.max(Math.min(idx, max - amount), 0);
}
function wrap(max, idx, amount, array) {
  const index = wrapIndex(max, idx);
  const prev = wrapIndex(max, idx - 1);
  const next = wrapIndex(max, idx + 1);
  const arr = [
    ...array.slice(idx, idx + amount),
    ...array.slice(0, Math.max(amount - (max - idx), 0))
  ];
  return [arr, prev, next, index];
}
function wrapIndex(max, idx) {
  const index = idx % max;
  if (index >= 0) {
    return index;
  } else {
    return max + index;
  }
}
const ENABLED$d = private_env.CALENDAR_ENABLED === "1";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
class CalendarService extends BaseService {
  static actions = CALENDAR_SERVICE_ACTIONS;
  type = CALENDAR_SERVICE_TYPE;
  cache = new Cache(this.logger);
  getDefaultConfig() {
    return {
      calendarId: "",
      privateKey: "",
      serviceEmail: "",
      itemsPerPage: 6
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      }
    };
  }
  async getConfig(_) {
    if (!ENABLED$d) {
      error(400, `Calendar is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config
    };
  }
  async setConfig({ form }) {
    const calendarId = form.get("calendarId");
    if (typeof calendarId !== "string") {
      return fail(400, { message: "Invalid calendar id" });
    }
    const serviceEmail = form.get("serviceEmail");
    if (typeof serviceEmail !== "string") {
      return fail(400, { message: "Invalid service email" });
    }
    const privateKey = form.get("privateKey");
    if (typeof privateKey !== "string") {
      return fail(400, { message: "Invalid private key" });
    }
    const itemsPerPage = Number(form.get("itemsPerPage"));
    if (!isFinite(itemsPerPage)) {
      return fail(400, { message: "Invalid number of items per page" });
    }
    this.config.calendarId = calendarId;
    this.config.serviceEmail = serviceEmail;
    this.config.privateKey = privateKey;
    this.config.itemsPerPage = itemsPerPage;
    const jwtClient = new google.auth.JWT(serviceEmail, void 0, privateKey, SCOPES);
    const calendar = google.calendar({ version: "v3", auth: jwtClient });
    const res = await calendar.events.list({
      calendarId,
      timeMin: (/* @__PURE__ */ new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime"
    });
    if (res.status !== 200) {
      return fail(400, { message: "Could not access calendar" });
    }
  }
  async getData({ url }) {
    if (!ENABLED$d) {
      error(400, `Calendar is disabled`);
    }
    if (!this.config.calendarId || !this.config.serviceEmail || !this.config.privateKey) {
      error(400, "Invalid calendar config");
    }
    const forceUpdate = url.searchParams.has("force");
    const data = await this.cache.with(
      {
        key: this.config.calendarId,
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        const jwtClient = new google.auth.JWT(
          this.config.serviceEmail,
          void 0,
          this.config.privateKey,
          SCOPES
        );
        const calendar = google.calendar({ version: "v3", auth: jwtClient });
        const res = await calendar.events.list({
          calendarId: this.config.calendarId,
          timeMin: (/* @__PURE__ */ new Date()).toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: "startTime"
        });
        const items = res.data.items || [];
        const events2 = [];
        for (const event of items) {
          const start = event.start?.dateTime || event.start?.date;
          const end = event.end?.dateTime || event.end?.date;
          if (!start || !end || !event.summary) {
            continue;
          }
          events2.push({
            tsStart: parseISO(start),
            tsEnd: parseISO(end),
            content: event.summary,
            isWholeDay: !!event.start?.date
          });
        }
        return {
          ts: /* @__PURE__ */ new Date(),
          events: events2
        };
      }
    );
    let page = Number(url.searchParams.get("page"));
    if (!isFinite(page)) {
      page = 0;
    }
    const [events, prevPage, nextPage] = clamp(
      data.events.length,
      page,
      this.config.itemsPerPage,
      data.events
    );
    return {
      ts: data.ts,
      type: "data",
      prevPage,
      nextPage,
      events
    };
  }
}
const ENABLED$c = private_env.CAROUSEL_ENABLED === "1";
class CarouselService extends BaseService {
  type = CAROUSEL_SERVICE_TYPE;
  static actions = CAROUSEL_SERVICE_ACTIONS;
  holidaysCache = new Cache(this.logger);
  getDefaultConfig() {
    return {
      screens: [],
      icons: [],
      switchInterval: 20,
      updateInterval: 60,
      country: "",
      state: ""
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this, "main")
      }
    };
  }
  async getConfig(_) {
    if (!ENABLED$c) {
      error(400, `Carousel is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config,
      services: servicesService.getInstances().sort((a, b) => a.name.localeCompare(b.name))
    };
  }
  async setConfig({ form }) {
    const formAction = form.get("action");
    switch (formAction) {
      case "add_screen": {
        const serviceName = form.get("service");
        if (typeof serviceName !== "string") {
          return fail(400, { message: `Invalid service name ${serviceName}` });
        }
        const action = form.get("action");
        if (typeof action !== "string") {
          return fail(400, { message: `Invalid action ${action}` });
        }
        const service = servicesService.getByName(serviceName);
        this.config.screens.push({ name: service.name, action });
        break;
      }
      case "move_screen": {
        const index = Number(form.get("index"));
        if (!isFinite(index)) {
          return fail(400, { message: "Invalid index" });
        }
        const dir = form.get("dir");
        if (dir !== "up" && dir !== "down") {
          return fail(400, { message: "Invalid direction" });
        }
        if (dir === "up") {
          if (index === 0) {
            return fail(400, { message: "Invalid direction" });
          }
          this.config.screens = [
            ...this.config.screens.slice(0, index - 1),
            this.config.screens[index],
            this.config.screens[index - 1],
            ...this.config.screens.slice(index + 1)
          ];
        } else if (dir === "down") {
          if (index === this.config.screens.length - 1) {
            return fail(400, { message: "Invalid direction" });
          }
          this.config.screens = [
            ...this.config.screens.slice(0, index),
            this.config.screens[index + 1],
            this.config.screens[index],
            ...this.config.screens.slice(index + 2)
          ];
        }
        break;
      }
      case "delete_screen": {
        const index = Number(form.get("index"));
        if (!isFinite(index)) {
          return fail(400, { message: `Invalid form index ${index}` });
        }
        this.config.screens.splice(index, 1);
        break;
      }
      case "add_icon": {
        const serviceName = form.get("service");
        if (typeof serviceName !== "string") {
          return fail(400, { message: `Invalid service name ${serviceName}` });
        }
        const action = form.get("action");
        if (typeof action !== "string") {
          return fail(400, { message: `Invalid action ${action}` });
        }
        const service = servicesService.getByName(serviceName);
        this.config.icons.push({ name: service.name, action });
        break;
      }
      case "move_icon": {
        const index = Number(form.get("index"));
        if (!isFinite(index)) {
          return fail(400, { message: "Invalid index" });
        }
        const dir = form.get("dir");
        if (dir !== "up" && dir !== "down") {
          return fail(400, { message: "Invalid direction" });
        }
        if (dir === "up") {
          if (index === 0) {
            return fail(400, { message: "Invalid direction" });
          }
          this.config.icons = [
            ...this.config.icons.slice(0, index - 1),
            this.config.icons[index],
            this.config.icons[index - 1],
            ...this.config.icons.slice(index + 1)
          ];
        } else if (dir === "down") {
          if (index === this.config.icons.length - 1) {
            return fail(400, { message: "Invalid direction" });
          }
          this.config.icons = [
            ...this.config.icons.slice(0, index),
            this.config.icons[index + 1],
            this.config.icons[index],
            ...this.config.icons.slice(index + 2)
          ];
        }
        break;
      }
      case "delete_icon": {
        const index = Number(form.get("index"));
        if (!isFinite(index)) {
          return fail(400, { message: `Invalid form index ${index}` });
        }
        this.config.icons.splice(index, 1);
        break;
      }
      case "other": {
        const country = form.get("country");
        if (typeof country !== "string") {
          return fail(400, { message: "Invalid country" });
        }
        const state = form.get("state");
        if (typeof state !== "string") {
          return fail(400, { message: "Invalid state" });
        }
        this.config.country = country;
        this.config.state = state;
        break;
      }
      default: {
        return fail(400, { message: `Unknown form action ${formAction}` });
      }
    }
  }
  async getData(action, { url, cookies }) {
    if (!ENABLED$c) {
      error(400, `Carousel is disabled`);
    }
    const screens = this.config.screens;
    if (!screens.length) {
      error(400, "No screens found");
    }
    let index = Number(url.searchParams.get("screen"));
    if (!isFinite(index)) {
      index = 0;
    }
    index = wrapIndex(screens.length, index);
    const dir = url.searchParams.get("dir") === "prev" ? "prev" : "next";
    const endIndex = wrapIndex(screens.length, dir === "next" ? index - 1 : index + 1);
    const screenOptions = { url, cookies, embedded: true };
    let screen = screens[index];
    let service = servicesService.getByName(screen.name);
    let screenData = await service.get(screen.action, screenOptions).catch(() => null);
    while (screenData === null) {
      index = wrapIndex(screens.length, dir === "next" ? index + 1 : index - 1);
      if (index === endIndex) {
        break;
      }
      screen = screens[index];
      service = servicesService.getByName(screen.name);
      screenData = await service.get(screen.action, screenOptions).catch(() => null);
    }
    if (!screenData) {
      error(400, "No screen has anything to show");
    }
    const getScreenUrl = (index2, dir2 = "next") => {
      const idx = wrapIndex(screens.length, index2);
      return `/services/${this.name}/${action}?screen=${idx}&dir=${dir2}`;
    };
    const nextScreen = getScreenUrl(index + 1, "next");
    const prevScreen = getScreenUrl(index - 1, "prev");
    const rawIcons = this.config.icons;
    const iconPromises = [];
    for (const icon of rawIcons) {
      const service2 = servicesService.getByName(icon.name);
      iconPromises.push(
        service2.get(icon.action, screenOptions).then((data) => {
          if (!data) {
            throw new Error();
          }
          return {
            ...icon,
            type: service2.type,
            data
          };
        }).catch(() => null)
      );
    }
    const icons = (await Promise.all(iconPromises)).filter((icon) => !!icon);
    const holidayKey = `${this.config.country}-${this.config.state}`;
    const cachedTs = this.holidaysCache.getTs(holidayKey);
    const forceUpdate = cachedTs !== null && !isSameDay(/* @__PURE__ */ new Date(), cachedTs);
    const holidayData = await this.holidaysCache.with(
      {
        key: holidayKey,
        force: forceUpdate,
        resultCacheTime: 24 * 60 * 60,
        // cache for 1 day - force updated when the day changes
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        const holidays = new Holidays(this.config.country, this.config.state);
        const holi = holidays.isHoliday(/* @__PURE__ */ new Date());
        const holiday = holi ? holi[0] : null;
        return {
          holiday
        };
      }
    );
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "data",
      index,
      screen,
      screenType: service.type,
      screenData,
      nextScreen,
      prevScreen,
      icons,
      holiday: holidayData.holiday,
      switchInterval: this.config.switchInterval * 1e3,
      updateInterval: this.config.updateInterval * 1e3
    };
  }
}
const ENABLED$b = private_env.DHT_SENSOR_ENABLED === "1";
class DhtSensorService extends BaseService {
  static actions = DHT_SENSOR_SERVICE_ACTIONS;
  type = DHT_SENSOR_SERVICE_TYPE;
  cache = new Cache(this.logger);
  getDefaultConfig() {
    return {
      devicePath: "/dev/gpiomem",
      dhtPin: 22,
      dhtType: 17
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      }
    };
  }
  async getConfig(_) {
    if (!ENABLED$b) {
      error(400, `DHT sensor is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config
    };
  }
  async setConfig({ form }) {
    const devicePath = form.get("devicePath");
    if (typeof devicePath !== "string") {
      return fail(400, { message: "Invalid device path" });
    }
    const dhtPin = Number(form.get("dhtPin"));
    if (!isFinite(dhtPin)) {
      return fail(400, { message: "Invalid DHT pin" });
    }
    const dhtType = Number(form.get("dhtType"));
    if (!isFinite(dhtType)) {
      return fail(400, { message: "Invalid DHT type" });
    }
    this.config.devicePath = devicePath;
    this.config.dhtPin = dhtPin;
    this.config.dhtType = dhtType;
  }
  async getData({ url }) {
    if (!ENABLED$b) {
      error(400, `DHT sensor is disabled`);
    }
    const forceUpdate = url.searchParams.has("force");
    const data = await this.cache.with(
      {
        key: `${this.config.dhtPin}-${this.config.dhtType}`,
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        if (!await stat(this.config.devicePath).catch(() => null)) {
          error(500, `Sensor not ready`);
        }
        const str = "node-dht";
        const dht = await import(
          /* @vite-ignore */
          `${str}-sensor`
        );
        const sensor = dht.promises;
        const { temperature, humidity } = await sensor.read(
          this.config.dhtType,
          this.config.dhtPin
        );
        return {
          ts: /* @__PURE__ */ new Date(),
          temp: temperature,
          rh: humidity
        };
      }
    );
    return {
      ts: data.ts,
      type: "data",
      measurement: data
    };
  }
}
const ENABLED$a = private_env.EPIC_GAMES_ENABLED === "1";
const BASE_URL$1 = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions";
const URL$1 = `${BASE_URL$1}?locale=en-US&country=CH&allowCountries=CH`;
class EpicGamesService extends BaseService {
  static actions = EPIC_GAMES_SERVICE_ACTIONS;
  type = EPIC_GAMES_SERVICE_TYPE;
  cache = new Cache(this.logger);
  lastPage = 0;
  getDefaultConfig() {
    return {
      itemsPerPage: 2
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      }
    };
  }
  async getConfig(_) {
    if (!ENABLED$a) {
      error(400, `Epic Games is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config
    };
  }
  async setConfig({ form }) {
    const itemsPerPage = Number(form.get("itemsPerPage"));
    if (!isFinite(itemsPerPage)) {
      return fail(400, { message: "Invalid number of items per page" });
    }
    this.config.itemsPerPage = itemsPerPage;
  }
  async getData({
    url,
    embedded
  }) {
    if (!ENABLED$a) {
      error(400, `Epic Games is disabled`);
    }
    const forceUpdate = url.searchParams.has("force");
    const data = await this.cache.with(
      {
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        const res = await fetch(URL$1);
        const body = await res.json();
        const rawGames = body.data.Catalog.searchStore.elements;
        const folderPath = `data/${this.name}`;
        await mkdir$1(folderPath, { recursive: true });
        const games2 = [];
        for (const game of rawGames) {
          if (!game.promotions) {
            continue;
          }
          const pos = game.promotions.promotionalOffers;
          const offers = pos.flatMap((po) => po.promotionalOffers).concat(game.promotions.upcomingPromotionalOffers.flatMap((po) => po.promotionalOffers)).filter((po) => po.discountSetting.discountType === "PERCENTAGE").map((po) => ({
            start: parseISO(po.startDate),
            end: po.endDate ? parseISO(po.endDate) : null,
            pct: po.discountSetting.discountPercentage
          }));
          const offer = offers[0];
          if (!offer) {
            continue;
          }
          let imgFilePath = null;
          const imgUrl = game.keyImages.find(
            (i) => i.type === "OfferImageWide" || i.type === "DieselStoreFrontWide"
          )?.url ?? game.keyImages[0]?.url ?? null;
          if (imgUrl) {
            imgFilePath = `${folderPath}/${basename(imgUrl)}`;
            if (!await stat$1(imgFilePath).catch(() => null)) {
              const res2 = await fetch(imgUrl);
              const stream = createWriteStream(imgFilePath);
              await finished(Readable.fromWeb(res2.body).pipe(stream));
            }
          }
          games2.push({
            title: game.title,
            pct: offer.pct,
            startsAt: offer.start,
            endsAt: offer.end,
            image: imgFilePath
          });
        }
        return {
          ts: /* @__PURE__ */ new Date(),
          games: games2.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
        };
      }
    );
    const pageStr = url.searchParams.get("page");
    let page = Number(pageStr);
    if (pageStr === null && embedded) {
      page = this.lastPage + 1;
    } else if (!isFinite(page)) {
      page = 0;
    }
    this.lastPage = page;
    const [games, prevPage, nextPage] = clamp(
      data.games.length,
      page,
      this.config.itemsPerPage,
      data.games
    );
    return {
      ts: data.ts,
      type: "data",
      prevPage,
      nextPage,
      games
    };
  }
}
const ENABLED$9 = private_env.GALLERY_ENABLED === "1";
class GalleryService extends BaseService {
  static actions = GALLERY_SERVICE_ACTIONS;
  type = GALLERY_SERVICE_TYPE;
  lastPage = 0;
  getDefaultConfig() {
    return {
      images: []
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      }
    };
  }
  async getConfig(_) {
    if (!ENABLED$9) {
      error(400, `Gallery is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      images: this.config.images
    };
  }
  async setConfig({ form }) {
    const formAction = form.get("action");
    switch (formAction) {
      case "add": {
        const newDateStr = form.get("newDate");
        if (typeof newDateStr !== "string") {
          return fail(400, { message: "Invalid date" });
        }
        const newDate = parseISO(newDateStr);
        const newTitle = form.get("newTitle");
        if (typeof newTitle !== "string") {
          return fail(400, { message: "Invalid title" });
        }
        const newImage = form.get("newImage");
        if (!newImage || typeof newImage === "string") {
          return fail(400, { message: "Invalid image" });
        }
        await this.saveUpload(newDate, newTitle, newImage);
        break;
      }
      case "delete": {
        const index = Number(form.get("index"));
        if (!isFinite(index)) {
          return fail(400, { message: "Invalid index" });
        }
        await this.deleteUpload(index);
        break;
      }
      case "save": {
        const index = Number(form.get("index"));
        if (!isFinite(index)) {
          return fail(400, { message: "Invalid index" });
        }
        const dateStr = form.get("date");
        if (typeof dateStr !== "string") {
          return fail(400, { message: "Invalid date" });
        }
        const date = parseISO(dateStr);
        const title = form.get("title");
        if (typeof title !== "string") {
          return fail(400, { message: "Invalid title" });
        }
        this.config.images[index].ts = date;
        this.config.images[index].title = title;
        break;
      }
      case "move": {
        const index = Number(form.get("index"));
        if (!isFinite(index)) {
          return fail(400, { message: "Invalid index" });
        }
        const dir = form.get("dir");
        if (dir !== "up" && dir !== "down") {
          return fail(400, { message: "Invalid direction" });
        }
        if (dir === "up") {
          if (index === 0) {
            return fail(400, { message: "Invalid direction" });
          }
          this.config.images = [
            ...this.config.images.slice(0, index - 1),
            this.config.images[index],
            this.config.images[index - 1],
            ...this.config.images.slice(index + 1)
          ];
        } else if (dir === "down") {
          if (index === this.config.images.length - 1) {
            return fail(400, { message: "Invalid direction" });
          }
          this.config.images = [
            ...this.config.images.slice(0, index),
            this.config.images[index + 1],
            this.config.images[index],
            ...this.config.images.slice(index + 2)
          ];
        }
        break;
      }
      default: {
        return fail(400, { message: `Unknown form action ${formAction}` });
      }
    }
  }
  async getData({
    url,
    embedded
  }) {
    if (!ENABLED$9) {
      error(400, `Gallery is disabled`);
    }
    const pageStr = url.searchParams.get("page");
    let page = Number(pageStr);
    if (pageStr === null && embedded) {
      page = this.lastPage + 1;
    } else if (!isFinite(page)) {
      page = 0;
    }
    this.lastPage = page;
    const [[image], prevPage, nextPage] = wrap(
      this.config.images.length,
      page,
      1,
      this.config.images
    );
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "data",
      prevPage,
      nextPage,
      image
    };
  }
  async saveUpload(ts, title, file) {
    const data = Buffer.from(await file.arrayBuffer());
    const hash = createHash("md5").update(ts.toISOString(), "utf-8").update(title, "utf-8").update(data).digest("hex");
    const ext = mime.extension(file.type);
    const folderPath = `data/${this.name}`;
    const img = `${folderPath}/${hash}.${ext}`;
    await mkdir$1(folderPath, { recursive: true });
    await writeFile$1(img, data);
    const ratio = await this.getRatio(img, data);
    this.config.images = this.config.images.concat({ ts, title, img, ratio });
  }
  async deleteUpload(index) {
    const item = this.config.images[index];
    await rm(`${item.img}`);
    this.config.images = this.config.images.filter((_, i) => i !== index);
  }
  async getRatio(fileName, data) {
    if (fileName.endsWith(".mp4")) {
      try {
        const dims = await getDimensions(fileName);
        return dims.width / dims.height;
      } catch (err) {
        this.logger.warn("Could not get video size", err);
      }
    } else {
      try {
        const size = imageSize(data ? data : await readFile$1(fileName));
        if (!size.height || !size.width) {
          error(500, `Missing size information: ${JSON.stringify(size)}`);
        }
        return size.orientation && size.orientation >= 5 ? size.height / size.width : size.width / size.height;
      } catch (err) {
        this.logger.warn("Could not get image size", err);
      }
    }
    return 1;
  }
}
function minutesToTz(total) {
  const tzSign = total > 0 ? "+" : "-";
  const tzHours = `${Math.floor(Math.abs(total) / 60)}`.padStart(2, "0");
  const tzMinutes = `${Math.abs(total) % 60}`.padStart(2, "0");
  return `${tzSign}${tzHours}:${tzMinutes}`;
}
const COPS_REGEX = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ_REGEX = /\+CSQ: (\d+),(\d+)/i;
const CCLK_REGEX = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS_REGEX = /\+CGPSINFO: ([\d.]+),(\w),([\d.]+),(\w),(\d+),([\d.]+),([\d.]+),([\d.]+),/i;
const CNSMOD_REGEX = /\+CNSMOD: (\d+),(\d+)/i;
const CPSI_REGEX = /\+CPSI: (.+),(.+),(\d+)-(\d+),([x\da-f]+),(\d+),/i;
class Device2 {
  config;
  logger;
  port;
  parser;
  constructor(config) {
    this.config = config;
    this.logger = new Logger(`MODEM/DEVICE`);
    this.port = new SerialPort({
      path: this.config.devicePath,
      baudRate: this.config.baudRate,
      autoOpen: false
    });
    this.parser = new InterByteTimeoutParser({
      interval: this.config.waitMs
    });
  }
  async open() {
    await new Promise(
      (resolve2, reject) => this.port.open((err) => err ? reject(err) : resolve2())
    );
    this.port.pipe(this.parser);
    await this.send("ATE0");
    await this.send("AT+CMEE=2");
  }
  async close() {
    if (!this.port.isOpen) {
      return;
    }
    this.port.unpipe(this.parser);
    await new Promise(
      (resolve2, reject) => this.port.close((err) => err ? reject(err) : resolve2())
    );
  }
  async checkAvailable() {
    return !!await stat$1(this.config.devicePath).catch(() => null);
  }
  async readAll() {
    const operator = await this.getCellularOperator();
    const signal = await this.getCellularSignal();
    const netType = await this.getNetworkType();
    const [mcc, mnc, lac, cid] = await this.getTower();
    const [time, timeTz] = await this.getCellularTimeAndTz();
    const [lat, lng] = await this.getGPS();
    return {
      operator,
      signal,
      netType,
      mcc,
      mnc,
      lac,
      cid,
      time,
      timeTz,
      lat,
      lng
    };
  }
  async getCellularOperator() {
    const copsResp = await this.send("AT+COPS?");
    const copsMatch = COPS_REGEX.exec(copsResp);
    return copsMatch?.[3] || null;
  }
  async getCellularSignal() {
    const csqResp = await this.send("AT+CSQ");
    const csqMatch = CSQ_REGEX.exec(csqResp);
    if (csqMatch) {
      const rssi = Number(csqMatch[1]);
      if (rssi === 99) {
        return 0;
      }
      return rssi * 827 + 127 >> 8;
    }
    return null;
  }
  async getNetworkType() {
    const resp = await this.send("AT+CNSMOD?");
    const match = CNSMOD_REGEX.exec(resp);
    if (match) {
      const stat2 = Number(match[2]);
      return ModemNetworkType[stat2];
    }
    return null;
  }
  async getTower() {
    const resp = await this.send("AT+CPSI?");
    const match = CPSI_REGEX.exec(resp);
    if (match) {
      const mcc = Number(match[3]);
      const mnc = Number(match[4]);
      const lac = Number(match[5]);
      const cid = Number(match[6]);
      return [mcc, mnc, lac, cid];
    }
    return [null, null, null, null];
  }
  async getCellularTimeAndTz() {
    const cclkResp = await this.send("AT+CCLK?");
    const cclkMatch = CCLK_REGEX.exec(cclkResp);
    if (cclkMatch) {
      const year = `${2e3 + Number(cclkMatch[1])}`;
      const month = `${Number(cclkMatch[2])}`.padStart(2, "0");
      const day = `${Number(cclkMatch[3])}`.padStart(2, "0");
      const hour = `${Number(cclkMatch[4])}`.padStart(2, "0");
      const minute = `${Number(cclkMatch[5])}`.padStart(2, "0");
      const second = `${Number(cclkMatch[6])}`.padStart(2, "0");
      const totalMinutes = Number(cclkMatch[7]) * 15;
      const tz = minutesToTz(totalMinutes);
      const time = parseISO(`${year}-${month}-${day}T${hour}:${minute}:${second}${tz}`);
      return [time, tz];
    }
    return [null, null];
  }
  async getGPS() {
    const gpsResp = await this.send("AT+CGPSINFO");
    const gpsMatch = GPS_REGEX.exec(gpsResp);
    if (gpsMatch) {
      const lat = Number(gpsMatch[1]) / (gpsMatch[2] === "S" ? -100 : 100);
      const lng = Number(gpsMatch[3]) / (gpsMatch[4] === "W" ? -100 : 100);
      return [lat, lng];
    }
    return [null, null];
  }
  async send(data) {
    if (this.config.pauseMs > 0) {
      await new Promise((resolve2) => setTimeout(resolve2, this.config.pauseMs));
    }
    return new Promise((resolve2, reject) => {
      this.logger.debug("::", data);
      let resolved = false;
      const timeoutError = new Error("modem.device.timeout");
      const onTimeout = () => {
        if (resolved) {
          return;
        }
        this.parser.off("data", onData);
        reject(timeoutError);
        resolved = true;
      };
      let timeout = setTimeout(onTimeout, this.config.timeoutMs);
      const onData = (buffer) => {
        const response = buffer.toString("utf-8").trim().replace(/\n\n/g, "\n");
        const lines = response.split("\n");
        for (const line of lines) {
          this.logger.debug("<<", line);
        }
        if (resolved) {
          this.logger.warn("<<", "Out-of-band data");
          return;
        }
        clearTimeout(timeout);
        if (lines.some((l) => l.trim() === "OK")) {
          this.parser.off("data", onData);
          resolved = true;
          resolve2(response);
        } else {
          timeout = setTimeout(onTimeout, this.config.timeoutMs);
        }
      };
      this.parser.on("data", onData);
      this.port.write(`${data}\r
`, (err) => {
        this.logger.debug(">>", data);
        if (err && !resolved) {
          this.parser.off("data", onData);
          clearTimeout(timeout);
          reject(err);
          resolved = true;
        }
      });
    });
  }
}
const ENABLED$8 = private_env.MODEM_ENABLED === "1";
const UNWIRED_URL = "https://eu1.unwiredlabs.com/v2/process";
class ModemService extends BaseService {
  static actions = MODEM_SERVICE_ACTIONS;
  type = MODEM_SERVICE_TYPE;
  cache = new Cache(this.logger);
  client = new Client({});
  getDefaultConfig() {
    return {
      devicePath: "/dev/ttyUSB2",
      baudRate: 115200,
      pauseTime: 0,
      waitTime: 100,
      cmdTimeout: 1e3,
      googleApiKey: "",
      unwiredToken: ""
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      },
      icon: {
        get: this.getData.bind(this)
      }
    };
  }
  async getConfig({ url }) {
    if (!ENABLED$8) {
      error(400, `Modem is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config
    };
  }
  async setConfig({ form }) {
    const devicePath = form.get("devicePath");
    if (typeof devicePath !== "string") {
      return fail(400, { message: "Invalid device path" });
    }
    const baudRate = Number(form.get("baudRate"));
    if (!isFinite(baudRate)) {
      return fail(400, { message: "Invalid baud rate" });
    }
    const waitTime = Number(form.get("waitTime"));
    if (!isFinite(waitTime)) {
      return fail(400, { message: "Invalid wait time" });
    }
    const pauseTime = Number(form.get("pauseTime"));
    if (!isFinite(pauseTime)) {
      return fail(400, { message: "Invalid pause time" });
    }
    const cmdTimeout = Number(form.get("cmdTimeout"));
    if (!isFinite(cmdTimeout)) {
      return fail(400, { message: "Invalid command timeout" });
    }
    const googleApiKey = form.get("googleApiKey");
    if (typeof googleApiKey !== "string") {
      return fail(400, { message: "Invalid google API key" });
    }
    const unwiredToken = form.get("unwiredToken");
    if (typeof unwiredToken !== "string") {
      return fail(400, { message: "Invalid unwired token" });
    }
    this.config.devicePath = devicePath;
    this.config.baudRate = baudRate;
    this.config.waitTime = waitTime;
    this.config.pauseTime = pauseTime;
    this.config.cmdTimeout = cmdTimeout;
    this.config.googleApiKey = googleApiKey;
    this.config.unwiredToken = unwiredToken;
  }
  async getData({ url }) {
    if (!ENABLED$8) {
      error(400, `Modem is disabled`);
    }
    let device = null;
    const forceUpdate = url.searchParams.has("force");
    const data = await this.cache.with(
      {
        key: this.config.devicePath,
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async (prev) => {
        device = new Device2({
          devicePath: this.config.devicePath,
          baudRate: this.config.baudRate,
          pauseMs: this.config.pauseTime,
          waitMs: this.config.waitTime,
          timeoutMs: this.config.cmdTimeout
        });
        if (!await device.checkAvailable()) {
          error(500, `Modem not available`);
        }
        await device.open();
        const data2 = await device.readAll();
        let gps = null;
        if (data2.lat && data2.lng) {
          gps = {
            lat: data2.lat,
            lng: data2.lng,
            tz: this.getTimezone(data2.lat, data2.lng)
          };
        }
        let prevGeo = prev?.geo ?? null;
        let prevTower = prev?.tower ?? null;
        let geo = null;
        if (data2.mcc && data2.mnc && data2.lac && data2.cid) {
          const tower = `${data2.mcc}-${data2.mnc}-${data2.lac}-${data2.cid}`;
          if (tower != prevTower) {
            try {
              const resp = await fetch(UNWIRED_URL, {
                method: "POST",
                body: JSON.stringify({
                  token: this.config.unwiredToken,
                  radio: data2.netType,
                  mcc: data2.mcc,
                  mnc: data2.mnc,
                  cells: [
                    {
                      lac: data2.lac,
                      cid: data2.cid
                    }
                  ]
                }),
                headers: { "Content-Type": "application/json" }
              });
              const unwiredData = await resp.json();
              this.logger.debug("Unwired geo response:", JSON.stringify(unwiredData));
              if (unwiredData.status === "ok") {
                geo = {
                  lat: unwiredData.lat,
                  lng: unwiredData.lon,
                  tz: this.getTimezone(unwiredData.lat, unwiredData.lon)
                };
              }
            } catch (err) {
              this.logger.error("Unwired error", err);
            }
            if (geo === null) {
              try {
                const { data: googleData } = await this.client.geolocate({
                  data: {
                    considerIp: true,
                    carrier: data2.operator ?? void 0,
                    radioType: data2.netType ?? void 0,
                    cellTowers: [
                      {
                        mobileCountryCode: data2.mcc,
                        mobileNetworkCode: data2.mnc,
                        signalStrength: data2.signal ?? void 0,
                        cellId: data2.cid,
                        locationAreaCode: data2.lac
                      }
                    ]
                  },
                  params: {
                    key: this.config.googleApiKey
                  }
                });
                this.logger.debug("Google geo response:", JSON.stringify(googleData));
                if ("location" in googleData) {
                  geo = {
                    lat: googleData.location.lat,
                    lng: googleData.location.lng,
                    tz: this.getTimezone(googleData.location.lat, googleData.location.lng)
                  };
                }
              } catch (err) {
                this.logger.error("Google geo error", err);
              }
            }
            prevTower = tower;
            prevGeo = JSON.parse(JSON.stringify(geo));
          } else {
            geo = JSON.parse(JSON.stringify(prevGeo));
            this.logger.debug("Using cached geo info", JSON.stringify(geo));
          }
        }
        return {
          ts: /* @__PURE__ */ new Date(),
          tower: prevTower,
          geo: prevGeo,
          info: {
            cellular: {
              operator: data2.operator,
              signal: data2.signal,
              netType: data2.netType,
              mcc: data2.mcc,
              mnc: data2.mnc,
              lac: data2.lac,
              cid: data2.cid,
              time: data2.time,
              tz: data2.timeTz
            },
            gps,
            geo
          }
        };
      },
      async () => {
        await device?.close();
      }
    );
    return {
      ts: data.ts,
      type: "data",
      info: data.info
    };
  }
  getTimezone(lat, lng) {
    const timeZone = find(lat, lng)[0];
    if (!timeZone) {
      return null;
    }
    const date = /* @__PURE__ */ new Date();
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
    const diff = (tzDate.getTime() - utcDate.getTime()) / 6e4;
    return minutesToTz(diff);
  }
}
const ENABLED$7 = private_env.NETWORK_ENABLED === "1";
class NetworkService extends BaseService {
  type = NETWORK_SERVICE_TYPE;
  static actions = NETWORK_SERVICE_ACTIONS;
  cache = new Cache(this.logger);
  async init() {
    wifi.init({
      debug: true,
      iface: null
    });
  }
  getDefaultConfig() {
    return {};
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      },
      icon: {
        get: this.getData.bind(this)
      }
    };
  }
  async getConfig({ url }) {
    if (!ENABLED$7) {
      error(400, `Network is disabled`);
    }
    const connections = await wifi.getCurrentConnections();
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      connections
    };
  }
  async setConfig({
    form
  }) {
    const formAction = form.get("action");
    switch (formAction) {
      case "scan": {
        await new Promise(
          (resolve2, reject) => exec("sudo nmcli device wifi rescan", (err) => err ? reject(err) : resolve2())
        ).catch(() => null);
        const connections = await wifi.getCurrentConnections();
        const networks = await wifi.scan();
        return {
          networks: networks.filter((n) => !connections.some((c) => c.ssid === n.ssid)).sort((a, b) => a.ssid.localeCompare(b.ssid))
        };
      }
      case "connect": {
        const ssid = form.get("ssid");
        if (typeof ssid !== "string") {
          return fail(400, { message: "Invalid SSID" });
        }
        const password = form.get("password");
        if (typeof password !== "string") {
          return fail(400, { message: "Invalid password" });
        }
        try {
          await wifi.connect({ ssid, password });
        } catch (err) {
          return fail(400, { message: err.message });
        }
        break;
      }
      case "disconnect": {
        const ssid = form.get("ssid");
        if (typeof ssid !== "string") {
          return fail(400, { message: "Invalid SSID" });
        }
        try {
          await wifi.deleteConnection({ ssid });
        } catch (err) {
          return fail(400, { message: err.message });
        }
        break;
      }
    }
  }
  async getData({ url }) {
    if (!ENABLED$7) {
      error(400, `Network is disabled`);
    }
    const forceUpdate = url.searchParams.has("force");
    const data = await this.cache.with(
      {
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        const interfaces = [];
        const networkInterfacesMap = networkInterfaces();
        for (const [name, infos] of Object.entries(networkInterfacesMap)) {
          if (!infos || !infos.length) {
            continue;
          }
          const addresses = infos.filter((info) => !info.internal).map(({ family, address, mac }) => ({
            family,
            address,
            mac
          }));
          if (addresses.length > 0) {
            interfaces.push({ name, addresses });
          }
        }
        const res = await resolve("google.com").catch(() => null);
        const connected = res !== null;
        return {
          ts: /* @__PURE__ */ new Date(),
          connected,
          interfaces
        };
      }
    );
    return {
      ts: data.ts,
      type: "data",
      connected: data.connected,
      interfaces: data.interfaces
    };
  }
}
const ENABLED$6 = private_env.PRUSA_ENABLED === "1";
class PrusaService extends BaseService {
  static actions = PRUSA_SERVICE_ACTIONS;
  type = PRUSA_SERVICE_TYPE;
  cache = new Cache(this.logger);
  getDefaultConfig() {
    return {
      apiKey: "",
      apiUrl: ""
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      }
    };
  }
  async getConfig(_) {
    if (!ENABLED$6) {
      error(400, `Prusa is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config
    };
  }
  async setConfig({ form }) {
    const apiUrl = form.get("apiUrl");
    if (typeof apiUrl !== "string") {
      return fail(400, { message: "Invalid API url" });
    }
    const apiKey = form.get("apiKey");
    if (typeof apiKey !== "string") {
      return fail(400, { message: "Invalid API key" });
    }
    const statusUrl = `${apiUrl}/api/v1/status`;
    const res = await fetch(statusUrl, { headers: { "X-API-Key": apiKey } });
    if (res.status !== 200) {
      return fail(400, { message: "Could not contact printer API" });
    }
    this.config.apiUrl = apiUrl;
    this.config.apiKey = apiKey;
  }
  async getData({ url }) {
    if (!ENABLED$6) {
      error(400, `Prusa is disabled`);
    }
    const forceUpdate = url.searchParams.has("force");
    const data = await this.cache.with(
      {
        key: this.config.apiUrl,
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        const statusUrl = `${this.config.apiUrl}/api/v1/status`;
        const res = await fetch(statusUrl, { headers: { "X-API-Key": this.config.apiKey } });
        const body = await res.json();
        return {
          ts: /* @__PURE__ */ new Date(),
          ...body
        };
      }
    );
    return {
      ts: data.ts,
      type: "data",
      job: data.job,
      printer: data.printer,
      storage: data.storage
    };
  }
}
const ENABLED$5 = private_env.SBB_ALERTS_ENABLED === "1";
const STATUS_URL = "https://api.opentransportdata.swiss/siri-sx";
class SbbAlertsService extends BaseService {
  type = SBB_ALERTS_SERVICE_TYPE;
  static actions = SBB_ALERTS_SERVICE_ACTIONS;
  cache = new Cache(this.logger);
  lastPage = 0;
  getDefaultConfig() {
    return {
      apiKey: "",
      words: []
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      }
    };
  }
  async getConfig(_) {
    if (!ENABLED$5) {
      error(400, `SBB alerts is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config
    };
  }
  async setConfig({ form }) {
    const apiKey = form.get("apiKey");
    if (typeof apiKey !== "string") {
      return fail(400, { message: "Invalid api key" });
    }
    const wordsStr = form.get("words");
    if (typeof wordsStr !== "string") {
      return fail(400, { message: "Invalid words" });
    }
    const words = wordsStr.split(/[\n\r,]/gi).filter((w) => !!w);
    this.config.apiKey = apiKey;
    this.config.words = words;
  }
  async getData({
    url,
    embedded
  }) {
    if (!ENABLED$5) {
      error(400, `SBB alerts is disabled`);
    }
    if (!this.config.apiKey || !this.config.words) {
      error(400, "Invalid SBB alerts config");
    }
    const forceUpdate = url.searchParams.has("force");
    const data = await this.cache.with(
      {
        key: this.config.words.join(","),
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        const parser = new Parser({ async: true });
        const res = await fetch(STATUS_URL, {
          headers: { Authorization: `Bearer ${this.config.apiKey}` }
        });
        const resEvents = await parser.parseStringPromise(await res.text());
        const sits = resEvents.Siri.ServiceDelivery[0].SituationExchangeDelivery[0].Situations[0].PtSituationElement;
        const alerts = [];
        for (const sit of sits) {
          const sitStr = JSON.stringify(sit);
          if (sit.Planned?.[0] === "true" || !this.config.words.some((w) => sitStr.includes(w))) {
            continue;
          }
          const actions = sit.PublishingActions[0].PublishingAction[0];
          const pubs = actions.PassengerInformationAction[0].TextualContent;
          const pub = pubs.find((c) => c.TextualContentSize[0] === "S");
          if (!pub) {
            continue;
          }
          alerts.push({
            start: parseISO(sit.ValidityPeriod[0].StartTime[0]),
            end: parseISO(sit.ValidityPeriod[0].EndTime[0]),
            summary: this.getTextDE(pub.SummaryContent[0].SummaryText),
            reason: this.getTextDE(pub.ReasonContent?.[0].ReasonText),
            description: this.getTextDE(pub.DescriptionContent?.[0].DescriptionText),
            consequence: this.getTextDE(pub.ConsequenceContent?.[0].ConsequenceText),
            duration: this.getTextDE(pub.DurationContent?.[0].DurationText),
            recommendation: this.getTextDE(pub.RecommendationContent?.[0].RecommendationText)
          });
        }
        return {
          ts: /* @__PURE__ */ new Date(),
          alerts
        };
      }
    );
    const pageStr = url.searchParams.get("page");
    let page = Number(pageStr);
    if (pageStr === null && embedded) {
      page = this.lastPage + 1;
    } else if (!isFinite(page)) {
      page = 0;
    }
    this.lastPage = page;
    const [[alert], prevPage, nextPage] = wrap(data.alerts.length, page, 1, data.alerts);
    return {
      ts: data.ts,
      type: "data",
      prevPage,
      nextPage,
      alert
    };
  }
  getTextDE(texts) {
    return texts?.find((s) => s["$"]["xml:lang"] === "DE")?.["_"];
  }
}
const ENABLED$4 = private_env.SBB_DEPARTURES_ENABLED === "1";
const STOP_URL = "https://api.opentransportdata.swiss/trias2020";
class SbbDeparturesService extends BaseService {
  type = SBB_DEPARTURES_SERVICE_TYPE;
  static actions = SBB_DEPARTURES_SERVICE_ACTIONS;
  cache = new Cache(this.logger);
  getDefaultConfig() {
    return {
      apiKey: "",
      stopPoint: "",
      itemsPerPage: 6
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      }
    };
  }
  async getConfig({ url }) {
    if (!ENABLED$4) {
      error(400, `SBB departures is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config
    };
  }
  async setConfig({ form }) {
    const apiKey = form.get("apiKey");
    if (typeof apiKey !== "string") {
      return fail(400, { message: "Invalid api key" });
    }
    const stopPoint = form.get("stopPoint");
    if (typeof stopPoint !== "string") {
      return fail(400, { message: "Invalid stop point" });
    }
    const itemsPerPage = Number(form.get("itemsPerPage"));
    if (!isFinite(itemsPerPage)) {
      return fail(400, { message: "Invalid number of items per page" });
    }
    this.config.apiKey = apiKey;
    this.config.stopPoint = stopPoint;
    this.config.itemsPerPage = itemsPerPage;
  }
  async getData({ url }) {
    if (!ENABLED$4) {
      error(400, `SBB departures is disabled`);
    }
    if (!this.config.apiKey || !this.config.stopPoint) {
      error(400, "Invalid SBB departures config");
    }
    const forceUpdate = url.searchParams.has("force");
    const data = await this.cache.with(
      {
        key: this.config.stopPoint,
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        const parser = new Parser({ async: true });
        const body = this.getRequestBody(this.config.stopPoint);
        const res = await fetch(STOP_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/xml",
            Authorization: this.config.apiKey
          },
          body
        });
        const resTrias = await parser.parseStringPromise(await res.text());
        const serviceDelivery = resTrias["trias:Trias"]["trias:ServiceDelivery"][0];
        const deliveryPayload = serviceDelivery["trias:DeliveryPayload"][0];
        const stopEventResponse = deliveryPayload["trias:StopEventResponse"][0];
        const departures2 = [];
        for (const d of stopEventResponse["trias:StopEventResult"]) {
          const stopEvent = d["trias:StopEvent"]?.[0];
          const stop = stopEvent?.["trias:ThisCall"]?.[0]?.["trias:CallAtStop"]?.[0];
          const serviceDeparture = stop?.["trias:ServiceDeparture"]?.[0];
          const scheduledStr = serviceDeparture?.["trias:TimetabledTime"]?.[0];
          if (!scheduledStr) {
            this.logger.warn("No scheduled time", JSON.stringify(stopEvent));
            continue;
          }
          const scheduled = parseISO(scheduledStr);
          const estimatedStr = serviceDeparture?.["trias:EstimatedTime"]?.[0];
          const estimated = estimatedStr ? parseISO(estimatedStr) : null;
          const service = stopEvent?.["trias:Service"]?.[0];
          const lineName = service["trias:PublishedLineName"]?.[0]?.["trias:Text"]?.[0] ?? "???";
          const destination = service["trias:DestinationText"]?.[0]?.["trias:Text"]?.[0] ?? "???";
          const type = service?.["trias:Mode"]?.[0]?.["trias:PtMode"]?.[0] ?? null;
          const delay = estimated ? differenceInMinutes(estimated, scheduled) : 0;
          departures2.push({
            scheduled,
            estimated,
            lineName,
            destination,
            delay,
            type
          });
        }
        return {
          ts: /* @__PURE__ */ new Date(),
          departures: departures2
        };
      }
    );
    let page = Number(url.searchParams.get("page"));
    if (!isFinite(page)) {
      page = 0;
    }
    const [departures, prevPage, nextPage] = clamp(
      data.departures.length,
      page,
      this.config.itemsPerPage,
      data.departures
    );
    return {
      ts: data.ts,
      type: "data",
      prevPage,
      nextPage,
      departures
    };
  }
  getRequestBody(stopPoint) {
    return `<?xml version="1.0" encoding="UTF-8"?>
	<Trias version="1.1" xmlns="http://www.vdv.de/trias" xmlns:siri="http://www.siri.org.uk/siri" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
			<ServiceRequest>
					<siri:RequestorRef>Weather-Station</siri:RequestorRef>
					<RequestPayload>
							<StopEventRequest>
									<Location>
											<LocationRef>
													<StopPointRef>${stopPoint}</StopPointRef>
											</LocationRef>
									</Location>
									<Params>
											<NumberOfResults>10</NumberOfResults>
											<StopEventType>departure</StopEventType>
											<IncludePreviousCalls>false</IncludePreviousCalls>
											<IncludeOnwardCalls>false</IncludeOnwardCalls>
											<IncludeRealtimeData>true</IncludeRealtimeData>
									</Params>
							</StopEventRequest>
					</RequestPayload>
			</ServiceRequest>
	</Trias>`;
  }
}
const ENABLED$3 = private_env.SRF_ENABLED === "1";
const BASE_URL = `https://www.srf.ch/news/bnf/rss/`;
const DESCR_REGEX = /<img src="(.*?)".*?>(.*)/;
class SrfService extends BaseService {
  type = SRF_SERVICE_TYPE;
  static actions = SRF_SERVICE_ACTIONS;
  cache = new Cache(this.logger);
  detailsCache = new Cache(this.logger);
  lastPage = 0;
  getDefaultConfig() {
    return {
      feedId: "",
      simpleDetails: false,
      itemsPerPage: 3
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      },
      details: {
        get: this.getDetails.bind(this)
      }
    };
  }
  async getConfig(_) {
    if (!ENABLED$3) {
      error(400, `SRF is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config
    };
  }
  async setConfig({ form }) {
    const feedId = form.get("feedId");
    if (typeof feedId !== "string") {
      return fail(400, { message: "Invalid feed ID" });
    }
    const simpleDetails = form.get("simpleDetails") === "on";
    const res = await fetch(`${BASE_URL}${feedId}`);
    if (res.status === 404) {
      return fail(400, { message: "Unknown feed ID" });
    } else if (res.status !== 200) {
      return fail(400, { message: "Invalid srf config" });
    }
    const itemsPerPage = Number(form.get("itemsPerPage"));
    if (!isFinite(itemsPerPage)) {
      return fail(400, { message: "Invalid number of items per page" });
    }
    this.config.feedId = feedId;
    this.config.simpleDetails = simpleDetails;
    this.config.itemsPerPage = itemsPerPage;
  }
  async getData({ url, embedded }) {
    if (!ENABLED$3) {
      error(400, `SRF is disabled`);
    }
    if (!this.config.feedId) {
      error(400, "Invalid srf config");
    }
    const forceUpdate = url.searchParams.has("force");
    const folderPath = `data/${this.name}/${this.config.feedId}`;
    await mkdir$1(folderPath, { recursive: true });
    const data = await this.cache.with(
      {
        key: this.config.feedId,
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        const res = await fetch(`${BASE_URL}${this.config.feedId}`);
        const text = await res.text();
        const parser = new Parser$1({ customFields: { item: ["description"] } });
        const xmlFeed = await parser.parseString(text);
        const articles2 = [];
        const rawItems = xmlFeed.items.filter((item) => !item.description.includes("Hier finden Sie")).slice(0, 10);
        for (const item of rawItems) {
          if (!item.guid || !item.title || !item.link) {
            continue;
          }
          const match = DESCR_REGEX.exec(item.description);
          if (!match) {
            continue;
          }
          const id = createHash("shake256", { outputLength: 8 }).update(item.guid).digest("hex");
          const [, imgUrl, content] = match;
          const date = item.pubDate ? parse(item.pubDate.substring(5), "dd MMM yyyy HH:mm:ss x", /* @__PURE__ */ new Date()) : /* @__PURE__ */ new Date();
          await mkdir$1(`${folderPath}/${id}`, { recursive: true });
          const imgFilePath = `${folderPath}/${id}/${basename(imgUrl)}`;
          if (!await stat$1(imgFilePath).catch(() => null)) {
            const res2 = await fetch(imgUrl);
            const stream = createWriteStream(imgFilePath);
            await finished(Readable.fromWeb(res2.body).pipe(stream));
          }
          articles2.push({
            id,
            ts: date,
            title: item.title,
            link: item.link,
            content: content || "",
            image: imgFilePath
          });
        }
        const fileNames = await readdir(folderPath);
        for (const fileName of fileNames) {
          if (!articles2.some((item) => item.id === fileName)) {
            await rm(`${folderPath}/${fileName}`, { recursive: true, force: true });
          }
        }
        return {
          ts: /* @__PURE__ */ new Date(),
          articles: articles2
        };
      }
    );
    const pageStr = url.searchParams.get("page");
    let page = Number(pageStr);
    if (pageStr === null && embedded) {
      page = this.lastPage + 1;
    } else if (!isFinite(page)) {
      page = 0;
    }
    this.lastPage = page;
    const [articles, prevPage, nextPage] = wrap(
      data.articles.length,
      page,
      this.config.itemsPerPage,
      data.articles
    );
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "data",
      prevPage,
      nextPage,
      articles
    };
  }
  async getDetails({ url }) {
    if (!ENABLED$3) {
      error(400, `SRF is disabled`);
    }
    if (!this.config.feedId) {
      error(400, "Invalid srf config");
    }
    const forceUpdate = url.searchParams.has("force");
    const folderPath = `data/${this.name}/${this.config.feedId}`;
    await mkdir$1(folderPath, { recursive: true });
    const articleId = url.searchParams.get("article");
    const data = await this.detailsCache.with(
      {
        key: `${this.config.feedId}-${articleId}`,
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        let feedData = this.cache.getData(this.config.feedId);
        if (!feedData) {
          error(400, "Cache does not contain aritcle");
        }
        let page = "";
        const article = feedData.articles.find((a) => a.id === articleId);
        if (!article) {
          error(400, `Article ${articleId} in feed ${this.config.feedId} not found`);
        }
        const filePath = `${folderPath}/${article.id}/article.html`;
        if (await stat$1(filePath).catch(() => null)) {
          this.logger.debug("Using cached article file", this.config.feedId, article.id);
          page = await readFile$1(filePath, "utf-8");
        } else {
          this.logger.debug("Downloading article file", this.config.feedId, article.id);
          const res = await fetch(article.link);
          const text = await res.text();
          await writeFile$1(filePath, text, "utf-8");
          page = text;
        }
        const html = parse$1(page);
        const head = html.getElementsByTagName("head")[0];
        for (const script of head.getElementsByTagName("script")) {
          script.remove();
        }
        const body = html.getElementsByTagName("body")[0];
        const main = body.getElementsByTagName("main")[0];
        const title = main.getElementsByTagName("header")[0];
        const section = main.getElementsByTagName("section")[0];
        if (this.config.simpleDetails) {
          for (const div of body.getElementsByTagName("div")) {
            div.replaceWith('<span class="badge bg-dark mb-3">Element entfernt</span>');
          }
          for (const figure of body.getElementsByTagName("figure")) {
            figure.replaceWith('<span class="badge bg-dark mb-3">Bild/Video entfernt</span>');
          }
          title.getElementById("skiplink__contentlink")?.remove();
          body.childNodes = [title, section];
        } else {
          const header = main.getElementsByTagName("div")[0];
          const section2 = main.getElementsByTagName("section")[0];
          const config = body.getElementById("config__js");
          const scripts = body.getElementsByTagName("script");
          body.childNodes = [header, title, section2, config, ...scripts];
        }
        return {
          ts: /* @__PURE__ */ new Date(),
          simple: this.config.simpleDetails,
          head: head.innerHTML,
          body: body.innerHTML.toString()
        };
      },
      void 0,
      async (err) => {
        err.body.embedded = true;
      }
    );
    return {
      ts: data.ts,
      type: "details",
      simple: data.simple,
      head: data.head,
      body: data.body
    };
  }
}
const ENABLED$2 = private_env.SWISS_POST_ENABLED === "1";
const URL_START = "https://account.post.ch/idp/?targetURL=https%3A%2F%2Fservice.post.ch%2Fekp-web%2Fsecure%2F%3Flang%3Den%26service%3Dekp%26app%3Dekp&lang=en&service=ekp&inIframe=&inMobileApp=";
const URL_INIT = "https://login.swissid.ch/api-login/authenticate/init";
const URL_LOGIN = "https://login.swissid.ch/api-login/authenticate/basic";
const URL_ANOMALY = "https://login.swissid.ch/api-login/anomaly-detection/device-print";
const FORM_REGEX = /<form .*?action="((?:.|\n)*?)"/i;
const INPUT_REGEX = /<input .*?name="(.*?)" .*?value="(.*?)".*?\/>/gi;
const URL_USER = "https://service.post.ch/ekp-web/api/user";
const URL_SHIPMENTS = "https://service.post.ch/ekp-web/secure/api/shipment/mine";
const URL_EVENTS = "https://service.post.ch/ekp-web/secure/api/shipment/id/$id/events/";
const URL_TEXTS = "https://service.post.ch/ekp-web/core/rest/translations/de/shipment-text-messages";
class SwissPostService extends BaseService {
  type = SWISS_POST_SERVICE_TYPE;
  static actions = SWISS_POST_SERVICE_ACTIONS;
  cache = new Cache(this.logger);
  hasTexts = false;
  shipmentTexts = /* @__PURE__ */ new Map();
  cookieJar = new CookieJar();
  fetchWithCookies = makeFetchCookie(fetch, this.cookieJar);
  cookieJarFileName = `data/swiss-post/${Buffer.from(this.config.username, "utf-8").toString("base64")}.json`;
  lastPage = 0;
  async init() {
    await this.updateTexts();
    const cookieJarStr = await readFile(this.cookieJarFileName, "utf-8").catch(() => null);
    if (cookieJarStr) {
      this.cookieJar = await CookieJar.deserialize(cookieJarStr);
      this.fetchWithCookies = makeFetchCookie(fetch, this.cookieJar);
      this.logger.debug("Loaded cookie jar from file");
    }
  }
  getDefaultConfig() {
    return {
      username: "",
      password: ""
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      }
    };
  }
  async getConfig({ url }) {
    if (!ENABLED$2) {
      error(400, `Swiss Post is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config
    };
  }
  async setConfig({ form }) {
    const username = form.get("username");
    if (typeof username !== "string") {
      return fail(400, { message: "Invalid username" });
    }
    const password = form.get("password");
    if (typeof password !== "string") {
      return fail(400, { message: "Invalid password" });
    }
    let url = URL_START;
    const resPre = await this.request("pre", url, {
      headers: { Accept: "text/html" }
    });
    const redir = resPre.url;
    if (!redir) {
      return fail(400, { message: "Missing redirect URL" });
    }
    const params = new URL(redir).searchParams.toString();
    url = `${URL_INIT}?${params}`;
    const resInit = await this.request("init", url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const bodyInit = await resInit.json();
    this.logger.debug("next_action", bodyInit.nextAction?.type);
    url = `${URL_LOGIN}?${params}`;
    let authId = bodyInit.tokens.authId;
    if (!authId) {
      return fail(400, { message: "Missing auth ID" });
    }
    const loginData = { username, password };
    const resBasic = await this.request("basic", url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authId
      },
      body: JSON.stringify(loginData)
    });
    const bodyBasic = await resBasic.json();
    authId = bodyBasic.tokens.authId;
    if (!authId) {
      return fail(400, { message: "Missing auth ID" });
    }
    this.config.username = username;
    this.config.password = password;
  }
  async getData({
    url,
    embedded
  }) {
    if (!ENABLED$2) {
      error(400, `Swiss Post is disabled`);
    }
    if (!this.config.username || !this.config.password) {
      error(400, "Invalid Swiss Post config");
    }
    const forceUpdate = url.searchParams.has("force");
    const data = await this.cache.with(
      {
        key: this.config.username,
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        let resUser = await this.request("user", URL_USER, {
          headers: { Accept: "application/json" }
        });
        let userBody = await resUser.json();
        let url2 = URL_START;
        if (userBody?.securityLevel !== "AUTHENTICATED") {
          this.logger.debug("Saved credentials are not valid, reauthenticating");
          await rm$1(this.cookieJarFileName, { force: true });
          const resPre = await this.request("pre", url2, {
            headers: { Accept: "text/html" }
          });
          const redir = resPre.url;
          if (!redir) {
            error(500, "Missing redirect URL");
          }
          const params = new URL(redir).searchParams.toString();
          url2 = `${URL_INIT}?${params}`;
          const resInit = await this.request("init", url2, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
          });
          const bodyInit = await resInit.json();
          this.logger.debug("next_action", bodyInit.nextAction?.type);
          url2 = `${URL_LOGIN}?${params}`;
          let authId = bodyInit.tokens.authId;
          const loginData = { username: this.config.username, password: this.config.password };
          const resBasic = await this.request("basic", url2, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              authId
            },
            body: JSON.stringify(loginData)
          });
          const bodyBasic = await resBasic.json();
          authId = bodyBasic.tokens.authId;
          url2 = `${URL_ANOMALY}?${params}`;
          const resAnomaly = await this.request("anomaly", url2, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authId
            },
            body: JSON.stringify({})
          });
          const anomalyBody = await resAnomaly.json();
          url2 = decodeURI(anomalyBody.nextAction.successUrl.trim());
          const resAuth = await this.request("auth", url2, {
            headers: { Accept: "text/html" }
          });
          const authBody = await resAuth.text();
          let rawUrl = FORM_REGEX.exec(authBody)?.[1]?.trim();
          if (!rawUrl) {
            error(500, "Could not find auth form");
          }
          url2 = decode(rawUrl);
          const resDone = await this.request("done", url2, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
          });
          const doneBody = await resDone.text();
          rawUrl = FORM_REGEX.exec(doneBody)?.[1]?.trim();
          if (!rawUrl) {
            error(500, "Could not find submit form");
          }
          url2 = decode(rawUrl);
          let matches = INPUT_REGEX.exec(doneBody);
          const data2 = new URLSearchParams();
          while (matches !== null) {
            const key = matches[1];
            const value = matches[2];
            data2.append(key, value);
            matches = INPUT_REGEX.exec(doneBody);
          }
          await this.request("post", url2, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data2
          });
          resUser = await this.request("user", URL_USER, {
            headers: {
              Accept: "application/json"
            }
          });
          userBody = await resUser.json();
        }
        url2 = `${URL_SHIPMENTS}/user/${userBody.userIdentifier}`;
        const resShipmentReq = await this.request("shipments-req", url2, {
          headers: { Accept: "application/json" }
        });
        const shipmentReqBody = await resShipmentReq.json();
        url2 = `${URL_SHIPMENTS}/result/${shipmentReqBody}`;
        const resShipments = await this.request("shipments", url2, {
          headers: { Accept: "application/json" }
        });
        let shipmentsBody = await resShipments.json();
        for (let i = 0; i < 5; i++) {
          if (shipmentsBody.status === "DONE") {
            break;
          }
          await new Promise((res) => setTimeout(res, 1e3));
          const resShipments2 = await this.request("shipments", url2, {
            headers: { Accept: "application/json" }
          });
          shipmentsBody = await resShipments2.json();
        }
        if (shipmentsBody.status !== "DONE") {
          error(500, {
            message: "Shipment query status did not change to DONE",
            params: { status: shipmentsBody.status }
          });
        }
        const shipments = [];
        const rawShipments = shipmentsBody.shipments;
        for (const rawShipment of rawShipments) {
          const inner = rawShipment.shipment;
          if (inner.globalStatus === "DELIVERED" && inner.formattedShipmentNumber !== "99.60.020753.92050439") {
            continue;
          }
          const phys = inner.physicalProperties;
          let type = this.getText(inner.product) || inner.product;
          if (inner.internationalProduct) {
            const newType = this.getText(inner.internationalProduct);
            if (newType) {
              type = newType;
            }
          }
          const shipment2 = {
            id: inner.identity,
            number: inner.formattedShipmentNumber ?? "-- unbekannt --",
            type,
            arrival: inner.calculatedDeliveryDate ?? null,
            status: GLOBAL_STATUS[inner.globalStatus],
            sender: inner.debitorDescription ?? null,
            dims: phys.dimension1 ? { x: phys.dimension1, y: phys.dimension2, z: phys.dimension3 } : null,
            weight: phys.weight ?? null,
            events: []
          };
          shipments.push(shipment2);
          const eventsRes = await this.request(
            `events-${shipment2.number}`,
            URL_EVENTS.replace("$id", shipment2.id),
            { headers: { Accept: "application/json" } }
          );
          const eventsBody = await eventsRes.json();
          const events = eventsBody.sort((a, b) => parseISO$1(b.timestamp).getTime() - parseISO$1(a.timestamp).getTime()).map((e) => ({
            ts: parseISO$1(e.timestamp),
            event: this.getText(e.eventCode) || e.eventCode
          }));
          shipment2.events = events;
        }
        const jar = await this.cookieJar.serialize();
        await mkdir(dirname(this.cookieJarFileName), { recursive: true });
        await writeFile(this.cookieJarFileName, JSON.stringify(jar), "utf-8");
        return {
          ts: /* @__PURE__ */ new Date(),
          shipments
        };
      }
    );
    const pageStr = url.searchParams.get("page");
    let page = Number(pageStr);
    if (pageStr === null && embedded) {
      page = this.lastPage + 1;
    } else if (!isFinite(page)) {
      page = 0;
    }
    this.lastPage = page;
    const [[shipment], prevPage, nextPage] = wrap(data.shipments.length, page, 1, data.shipments);
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "data",
      prevPage,
      nextPage,
      shipment
    };
  }
  async request(name, url, init) {
    this.logger.debug(name, init.method ?? "GET", url);
    try {
      const resp = await this.fetchWithCookies(url, {
        ...init,
        redirect: "follow",
        credentials: "include"
      });
      this.logger.debug(name, "status:", resp.status);
      if (resp.status < 200 || resp.status >= 400) {
        const body = await resp.json().catch(() => null);
        const text = body ? null : await resp.text().catch(() => null);
        error(400, `Invalid status: ${resp.status}: ${body?.title ?? text ?? resp.statusText}`);
      }
      return resp;
    } catch (err) {
      this.logger.error(name, err.cause ?? err);
      throw err.cause ?? err;
    }
  }
  async updateTexts() {
    if (this.hasTexts) {
      return;
    }
    const resTexts = await fetch(URL_TEXTS);
    const bodyTexts = await resTexts.json();
    const texts = bodyTexts["shipment-text--"];
    for (const [key, value] of Object.entries(texts)) {
      const splits = key.split(".");
      let entry = ["", this.shipmentTexts];
      let split;
      while (split = splits.shift()) {
        let subEntry = entry[1].get(split);
        if (typeof subEntry === "undefined") {
          subEntry = ["", /* @__PURE__ */ new Map()];
          entry[1].set(split, subEntry);
        }
        entry = subEntry;
      }
      entry[0] = value.trim();
    }
    this.hasTexts = true;
  }
  getText(code) {
    const splits = code.split(".");
    const entry = ["", this.shipmentTexts];
    const text = this.getRecursiveTexts(entry, splits, 0);
    return text;
  }
  getRecursiveTexts(entry, splits, index) {
    const split = splits[index];
    if (!split) {
      let subEntry = entry;
      while (!subEntry[0]) {
        const nextSubEntry = subEntry[1].get("*");
        if (!nextSubEntry) {
          break;
        }
        subEntry = nextSubEntry;
      }
      return subEntry[0];
    }
    const specific = entry[1].get(split);
    if (specific) {
      const res = this.getRecursiveTexts(specific, splits, index + 1);
      if (res) {
        return res;
      }
    }
    const generic = entry[1].get("*");
    if (generic) {
      const res = this.getRecursiveTexts(generic, splits, index + 1);
      if (res) {
        return res;
      }
    }
    return void 0;
  }
}
const ENABLED$1 = private_env.TUYA_ENABLED === "1";
class TuyaService extends BaseService {
  static actions = TUYA_SERVICE_ACTIONS;
  type = TUYA_SERVICE_TYPE;
  cache = new Cache(this.logger);
  getDefaultConfig() {
    return {
      clientId: "",
      clientSecret: "",
      deviceIp: "",
      protocolVersion: "3.3"
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      main: {
        get: this.getData.bind(this)
      }
    };
  }
  async getConfig(_) {
    if (!ENABLED$1) {
      error(400, `TUYA is disabled`);
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config
    };
  }
  async setConfig({ form }) {
    const clientId = form.get("clientId");
    if (typeof clientId !== "string") {
      return fail(400, { message: "Invalid client id" });
    }
    const clientSecret = form.get("clientSecret");
    if (typeof clientSecret !== "string") {
      return fail(400, { message: "Invalid client secret" });
    }
    const deviceIp = form.get("deviceIp");
    if (typeof deviceIp !== "string") {
      return fail(400, { message: "Invalid device IP" });
    }
    const protocolVersion = form.get("protocolVersion");
    if (typeof protocolVersion !== "string") {
      return fail(400, { message: "Invalid protocol version" });
    }
    this.config.clientId = clientId;
    this.config.clientSecret = clientSecret;
    this.config.deviceIp = deviceIp;
    this.config.protocolVersion = protocolVersion;
  }
  async getData({ url }) {
    if (!ENABLED$1) {
      error(400, `TUYA is disabled`);
    }
    const device = new TuyAPI({
      id: this.config.clientId,
      key: this.config.clientSecret,
      ip: this.config.deviceIp,
      version: this.config.protocolVersion,
      issueGetOnConnect: false
    });
    const forceUpdate = url.searchParams.has("force");
    const data = await this.cache.with(
      {
        key: this.config.clientId,
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async () => {
        await device.find();
        this.logger.debug("Device found");
        const status = await new Promise(
          (resolve2, reject) => {
            const onError = (err) => reject(err);
            device.on("error", onError);
            device.connect().then(() => {
              this.logger.debug("Device connected");
              device.get({ schema: true }).then(resolve2);
            }).catch(() => {
            });
          }
        );
        this.logger.debug(`Status ${JSON.stringify(status)}`);
        if (typeof status !== "object") {
          error(500, "Could not parse TUYA data");
        }
        const info = {};
        for (const [id, { key, map }] of PROP_MAP) {
          info[key] = map(status.dps[id]);
        }
        return {
          ts: /* @__PURE__ */ new Date(),
          info
        };
      },
      async () => {
        device.disconnect();
        this.logger.debug("Device disconnected");
      }
    );
    return {
      ts: data.ts,
      type: "data",
      info: data.info
    };
  }
}
const ENABLED = private_env.WEATHER_ENABLED === "1";
const GOOGLE_KEY = private_env.GOOGLE_KEY;
const FORECAST_URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;
const GEOCODE_URL = `https://api.openweathermap.org/geo/1.0/reverse?limit=3`;
const ICON_PREFIX = "/icons/";
const ICON_SUFFIX = ".png";
class WeatherService extends BaseService {
  static actions = WEATHER_SERVICE_ACTIONS;
  type = WEATHER_SERVICE_TYPE;
  client = new Client({});
  cache = new Cache(this.logger);
  lastPage = 0;
  getDefaultConfig() {
    return {
      modemService: "",
      useGeo: true,
      useGps: true,
      lat: 47.38,
      lng: 8.64,
      minDiff: 1e3,
      apiKey: "",
      itemsPerPage: 7
    };
  }
  getActions() {
    return {
      config: {
        get: this.getConfig.bind(this),
        set: this.setConfig.bind(this)
      },
      daily: {
        get: this.getDaily.bind(this)
      },
      hourly: {
        get: this.getHourly.bind(this)
      },
      alerts: {
        get: this.getAlerts.bind(this)
      }
    };
  }
  checkSetup(checkConfig = true) {
    if (!ENABLED) {
      error(400, `Weather is disabled`);
    }
    if (checkConfig && !this.config.apiKey) {
      error(400, "Invalid weather config");
    }
  }
  async getConfig(_) {
    this.checkSetup(false);
    return {
      ts: /* @__PURE__ */ new Date(),
      type: "config",
      config: this.config,
      modems: servicesService.getInstances(MODEM_SERVICE_TYPE)
    };
  }
  async setConfig({ form }) {
    const modemServiceName = form.get("modemService");
    if (typeof modemServiceName !== "string") {
      return fail(400, { message: "Invalid modem service" });
    }
    const modemService = modemServiceName ? servicesService.getByName(modemServiceName).name : "";
    const useGps = form.get("useGps") === "on";
    const useGeo = form.get("useGeo") === "on";
    const lat = Number(form.get("lat"));
    if (!isFinite(lat)) {
      return fail(400, { message: "Invalid latitude" });
    }
    const lng = Number(form.get("lng"));
    if (!isFinite(lng)) {
      return fail(400, { message: "Invalid longitude" });
    }
    const minDiff = Number(form.get("minDiff"));
    if (!isFinite(minDiff)) {
      return fail(400, { message: "Invalid min diff" });
    }
    const apiKey = form.get("apiKey");
    if (typeof apiKey !== "string") {
      return fail(400, { message: "Invalid api key" });
    }
    const itemsPerPage = Number(form.get("itemsPerPage"));
    if (!isFinite(itemsPerPage)) {
      return fail(400, { message: "Invalid number of items per page" });
    }
    this.config.modemService = modemService;
    this.config.useGeo = useGeo;
    this.config.useGps = useGps;
    this.config.lat = lat;
    this.config.lng = lng;
    this.config.minDiff = minDiff;
    this.config.apiKey = apiKey;
    this.config.itemsPerPage = itemsPerPage;
    const forecastUrl = `${FORECAST_URL}&appid=${apiKey}&lat=${lat}&lon=${lng}`;
    const res = await fetch(forecastUrl);
    if (res.status !== 200) {
      return fail(400, { message: "Could not access weather" });
    }
  }
  async getDaily(options) {
    this.checkSetup();
    const data = await this.getData(options);
    const [daily] = clamp(data.daily.length, 0, this.config.itemsPerPage, data.daily);
    return {
      ts: data.ts,
      type: "daily",
      location: data.location,
      daily
    };
  }
  async getHourly(options) {
    this.checkSetup();
    const data = await this.getData(options);
    const [hourly] = clamp(data.hourly.length, 0, this.config.itemsPerPage, data.hourly);
    return {
      ts: data.ts,
      type: "hourly",
      location: data.location,
      hourly
    };
  }
  async getAlerts(options) {
    this.checkSetup();
    const data = await this.getData(options);
    const pageStr = options.url.searchParams.get("page");
    let page = Number(pageStr);
    if (pageStr === null && options?.embedded) {
      page = this.lastPage + 1;
    } else if (!isFinite(page)) {
      page = 0;
    }
    this.lastPage = page;
    const [[alert], prevPage, nextPage] = wrap(data.alerts.length, page, 1, data.alerts);
    if (!alert) {
      error(404, "No weather alerts");
    }
    return {
      ts: data.ts,
      type: "alerts",
      location: data.location,
      prevPage,
      nextPage,
      alert
    };
  }
  async getData(options) {
    const forceUpdate = options.url.searchParams.has("force");
    return this.cache.with(
      {
        key: this.config.lat + "-" + this.config.lng,
        force: forceUpdate,
        resultCacheTime: this.config.resultCacheTime,
        errorCacheTime: this.config.errorCacheTime
      },
      async (prevData) => {
        let location = prevData?.location ?? { lat: this.config.lat, lng: this.config.lng };
        let lat = location.lat;
        let lng = location.lng;
        if (this.config.useGps || this.config.useGeo) {
          const modem = servicesService.getByName(this.config.modemService);
          const modemData = await modem.getData(options).catch(() => null);
          if (modemData) {
            const info = modemData.info;
            if (this.config.useGps && info.gps) {
              this.logger.debug("Using modem gps location", info.gps);
              lat = info.gps.lat;
              lng = info.gps.lng;
            } else if (this.config.useGeo && info.geo) {
              this.logger.debug("Using modem geo location", info.geo);
              lat = info.geo.lat;
              lng = info.geo.lng;
            }
          }
        }
        const forecastUrl = `${FORECAST_URL}&appid=${this.config.apiKey}&lat=${lat}&lon=${lng}`;
        const res = await fetch(forecastUrl);
        const body = await res.json();
        const newLat = body.lat;
        const newLng = body.lon;
        let place = prevData?.location.place;
        const dist = this.distance(newLat, newLng, lat, lng);
        if (!place || dist > this.config.minDiff) {
          place = void 0;
          this.logger.info("Moved", dist, "meters, recalculating location");
          const geocodeUrl = `${GEOCODE_URL}&appid=${this.config.apiKey}&lat=${newLat}&lon=${newLng}`;
          const res2 = await fetch(geocodeUrl).catch(() => null);
          const body2 = res2 ? await res2.json() : null;
          const entry = body2?.[0];
          if (entry) {
            place = `${entry.name}, ${entry.state}, ${entry.country}`;
          } else {
            this.logger.debug("Could not find place, trying google geocode...");
            const { data: geoData } = await this.client.reverseGeocode({
              params: {
                key: GOOGLE_KEY,
                latlng: { lat: newLat, lng: newLng }
              }
            });
            const addr = geoData.results?.find((r) => r.types.some((t) => t !== "plus_code"));
            if (addr) {
              place = addr?.formatted_address;
            } else {
              this.logger.debug("Unknown place");
            }
          }
          lat = newLat;
          lng = newLng;
          location = { lat, lng, place };
        } else {
          this.logger.debug("Weather location moved by", dist, "meters");
        }
        const alerts = [];
        if (body.alerts) {
          for (const alert of body.alerts) {
            alerts.push({
              sender: alert.sender_name,
              event: alert.event,
              start: new Date(alert.start * 1e3),
              end: new Date(alert.end * 1e3),
              content: alert.description,
              tags: alert.tags
            });
          }
        }
        const hourly = [];
        for (const forecast of body.hourly) {
          hourly.push({
            ts: new Date(forecast.dt * 1e3),
            img: this.getIcon(forecast.weather[0].id),
            feelsLike: forecast.feels_like
          });
        }
        const daily = [];
        for (const forecast of body.daily) {
          daily.push({
            ts: new Date(forecast.dt * 1e3),
            img: this.getIcon(forecast.weather[0].id),
            feelsLike: forecast.feels_like.day
          });
        }
        return {
          ts: /* @__PURE__ */ new Date(),
          location,
          alerts,
          hourly,
          daily
        };
      }
    );
  }
  distance(lat1, lng1, lat2, lng2) {
    const R = 6378.137;
    const dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    const dLon = lng2 * Math.PI / 180 - lng1 * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1e3;
  }
  getIcon(id) {
    return ICON_PREFIX + ICON_MAP[id] + ICON_SUFFIX;
  }
}
const PATH = "data/services.json";
const SERVICES = {
  [BATTERY_SERVICE_TYPE]: BatteryService,
  [CALENDAR_SERVICE_TYPE]: CalendarService,
  [CAROUSEL_SERVICE_TYPE]: CarouselService,
  [DHT_SENSOR_SERVICE_TYPE]: DhtSensorService,
  [EPIC_GAMES_SERVICE_TYPE]: EpicGamesService,
  [GALLERY_SERVICE_TYPE]: GalleryService,
  [MODEM_SERVICE_TYPE]: ModemService,
  [NETWORK_SERVICE_TYPE]: NetworkService,
  [PRUSA_SERVICE_TYPE]: PrusaService,
  [SBB_ALERTS_SERVICE_TYPE]: SbbAlertsService,
  [SBB_DEPARTURES_SERVICE_TYPE]: SbbDeparturesService,
  [SRF_SERVICE_TYPE]: SrfService,
  [SWISS_POST_SERVICE_TYPE]: SwissPostService,
  [TUYA_SERVICE_TYPE]: TuyaService,
  [WEATHER_SERVICE_TYPE]: WeatherService
};
class ServiceManager {
  loaded = false;
  logger = new Logger("SERVICES");
  main = null;
  services = /* @__PURE__ */ new Map();
  constructor() {
  }
  getMain() {
    return this.main;
  }
  async setMain(name, action) {
    this.main = { name, action };
    await this.save();
  }
  async load() {
    if (this.loaded) {
      return;
    }
    this.logger.debug("Loading...");
    const startTime = process.hrtime.bigint();
    await mkdir(dirname(PATH), { recursive: true });
    const json = JSON.parse(
      await readFile(PATH, "utf-8").catch(() => '{ "main": null, "services": []}')
    );
    this.main = json.main ?? null;
    const services = /* @__PURE__ */ new Map();
    for (const rawService of json.services) {
      const constr = SERVICES[rawService.type];
      if (!constr) {
        this.logger.warn("Skipping unknown service", rawService.name, "of type", rawService.type);
        continue;
      }
      const service = new constr(rawService.name, rawService.config);
      await service.init();
      services.set(rawService.name, service);
    }
    this.services = services;
    this.loaded = true;
    const diffTime = Number((process.hrtime.bigint() - startTime) / 1000000n);
    this.logger.info("Loaded", this.services.size, "services", diffTime, "ms");
  }
  async add(name, type) {
    if (this.services.has(name)) {
      throw fail(400, { message: "Duplicate service name" });
    }
    const constr = SERVICES[type];
    const service = new constr(name);
    this.services.set(name, service);
    await this.save();
  }
  async remove(name) {
    this.services.delete(name);
    await this.save();
  }
  async save() {
    this.logger.debug("Saving...");
    const startTime = process.hrtime.bigint();
    const services = [...this.services.values()].map((s) => s.serialize());
    await writeFile(PATH, JSON.stringify({ main: this.main, services }), "utf-8");
    const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
    this.logger.info("Saved", this.services.size, "services", diffTime, "ms");
  }
  getType(type) {
    return SERVICES[type];
  }
  getTypes() {
    return Object.entries(SERVICES).map(([type, clazz]) => ({
      name: type,
      actions: clazz.actions
    }));
  }
  getInstances(type) {
    return [...this.services.values()].filter((i) => !type || i.type === type).map((s) => ({ name: s.name, type: { name: s.type, actions: SERVICES[s.type].actions } }));
  }
  getByName(name) {
    const service = this.services.get(name);
    if (!service) {
      error(404, `Service ${name} not found`);
    }
    return service;
  }
}
const servicesService = new ServiceManager();

export { BATTERY_SERVICE_TYPE as B, CALENDAR_SERVICE_TYPE as C, EPIC_GAMES_SERVICE_TYPE as E, GALLERY_SERVICE_TYPE as G, Logger as L, MODEM_SERVICE_TYPE as M, NETWORK_SERVICE_TYPE as N, PRUSA_SERVICE_TYPE as P, SBB_ALERTS_SERVICE_TYPE as S, TUYA_SERVICE_TYPE as T, WEATHER_SERVICE_TYPE as W, CAROUSEL_SERVICE_TYPE as a, SBB_DEPARTURES_SERVICE_TYPE as b, SRF_SERVICE_TYPE as c, SWISS_POST_SERVICE_TYPE as d, servicesService as s };
//# sourceMappingURL=services-BvoVABcM.js.map
