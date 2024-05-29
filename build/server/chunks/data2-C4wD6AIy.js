import { e as error } from './index-C-arhqvZ.js';
import { find } from 'geo-tz/now';
import { Client } from '@googlemaps/google-maps-services-js';
import { d as private_env } from './shared-server-BfUoNEXY.js';
import { B as BaseCache } from './BaseCache-BtPY9_DY.js';
import { B as BaseLogger } from './BaseLogger-B58-fQ4u.js';
import { parseISO } from 'date-fns';
import { SerialPort, InterByteTimeoutParser } from 'serialport';
import { stat } from 'node:fs/promises';

function minutesToTz(total) {
  const tzSign = total > 0 ? "+" : "-";
  const tzHours = `${Math.floor(Math.abs(total) / 60)}`.padStart(2, "0");
  const tzMinutes = `${Math.abs(total) % 60}`.padStart(2, "0");
  return `${tzSign}${tzHours}:${tzMinutes}`;
}
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
const COPS_REGEX = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ_REGEX = /\+CSQ: (\d+),(\d+)/i;
const CCLK_REGEX = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS_REGEX = /\+CGPSINFO: ([\d.]+),(\w),([\d.]+),(\w),(\d+),([\d.]+),([\d.]+),([\d.]+),/i;
const CNSMOD_REGEX = /\+CNSMOD: (\d+),(\d+)/i;
const CPSI_REGEX = /\+CPSI: (.+),(.+),(\d+)-(\d+),([x\da-f]+),(\d+),/i;
class Device {
  config;
  logger;
  port;
  parser;
  constructor(config) {
    this.config = config;
    this.logger = new BaseLogger(`MODEM/DEVICE`);
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
      (resolve, reject) => this.port.open((err) => err ? reject(err) : resolve())
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
      (resolve, reject) => this.port.close((err) => err ? reject(err) : resolve())
    );
  }
  async checkAvailable() {
    return !!await stat(this.config.devicePath).catch(() => null);
  }
  async checkReady() {
    const res = await this.send("AT");
    return res === "OK";
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
      await new Promise((resolve) => setTimeout(resolve, this.config.pauseMs));
    }
    return new Promise((resolve, reject) => {
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
          resolve(response);
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
const UNWIRED_URL = "https://eu1.unwiredlabs.com/v2/process";
const ENABLED = private_env.MODEM_ENABLED === "1";
const CACHE_TIME = Number(private_env.MODEM_CACHE_TIME);
const DEVICE_PATH = private_env.MODEM_DEVICE_PATH;
const BAUD_RATE = Number(private_env.MODEM_BAUD_RATE);
const PAUSE_TIME = Number(private_env.MODEM_PAUSE_TIME);
const WAIT_TIME = Number(private_env.MODEM_WAIT_TIME);
const CMD_TIMEOUT = Number(private_env.MODEM_CMD_TIMEOUT);
const GOOGLE_KEY = private_env.GOOGLE_KEY;
const UNWIRED_TOKEN = private_env.MODEM_UNWIRED_TOKEN;
const logger = new BaseLogger("MODEM");
const cache = new BaseCache(logger, CACHE_TIME);
const client = new Client({});
let prevTower = "";
let prevGeo = null;
async function getData(forceUpdate = false) {
  let device = null;
  if (!ENABLED) {
    throw error(400, {
      message: `Modem is disabled`,
      key: "modem.disabled"
    });
  }
  return cache.withDefault(
    forceUpdate,
    async () => {
      device = new Device({
        devicePath: DEVICE_PATH,
        baudRate: BAUD_RATE,
        pauseMs: PAUSE_TIME,
        waitMs: WAIT_TIME,
        timeoutMs: CMD_TIMEOUT
      });
      if (!await device.checkAvailable()) {
        throw error(500, {
          message: `Modem not available`,
          key: "modem.notAvailable"
        });
      }
      await device.open();
      if (!await device.checkReady()) {
        throw error(500, {
          message: `Modem not ready`,
          key: "modem.notReady"
        });
      }
      const data = await device.readAll();
      let gps = null;
      if (data.lat && data.lng) {
        gps = {
          lat: data.lat,
          lng: data.lng,
          tz: getTimezone(data.lat, data.lng)
        };
      }
      let geo = null;
      if (data.mcc && data.mnc && data.lac && data.cid) {
        const tower = `${data.mcc}-${data.mnc}-${data.lac}-${data.cid}`;
        if (tower != prevTower) {
          try {
            const resp = await fetch(UNWIRED_URL, {
              method: "POST",
              body: JSON.stringify({
                token: UNWIRED_TOKEN,
                radio: data.netType,
                mcc: data.mcc,
                mnc: data.mnc,
                cells: [
                  {
                    lac: data.lac,
                    cid: data.cid
                  }
                ]
              }),
              headers: { "Content-Type": "application/json" }
            });
            const unwiredData = await resp.json();
            logger.debug("Unwired geo response:", JSON.stringify(unwiredData));
            if (unwiredData.status === "ok") {
              geo = {
                lat: unwiredData.lat,
                lng: unwiredData.lon,
                tz: getTimezone(unwiredData.lat, unwiredData.lon)
              };
            }
          } catch (err) {
            logger.error("Unwired error", err);
          }
          if (geo === null) {
            try {
              const { data: googleData } = await client.geolocate({
                data: {
                  considerIp: true,
                  carrier: data.operator ?? void 0,
                  radioType: data.netType ?? void 0,
                  cellTowers: [
                    {
                      mobileCountryCode: data.mcc,
                      mobileNetworkCode: data.mnc,
                      signalStrength: data.signal ?? void 0,
                      cellId: data.cid,
                      locationAreaCode: data.lac
                    }
                  ]
                },
                params: {
                  key: GOOGLE_KEY
                }
              });
              logger.debug("Google geo response:", JSON.stringify(googleData));
              if ("location" in googleData) {
                geo = {
                  lat: googleData.location.lat,
                  lng: googleData.location.lng,
                  tz: getTimezone(googleData.location.lat, googleData.location.lng)
                };
              }
            } catch (err) {
              logger.error("Google geo error", err);
            }
          }
          prevTower = tower;
          prevGeo = JSON.parse(JSON.stringify(geo));
        } else {
          geo = JSON.parse(JSON.stringify(prevGeo));
          logger.debug("Using cached geo info", JSON.stringify(geo));
        }
      }
      return {
        ts: /* @__PURE__ */ new Date(),
        cellular: {
          operator: data.operator,
          signal: data.signal,
          netType: data.netType,
          mcc: data.mcc,
          mnc: data.mnc,
          lac: data.lac,
          cid: data.cid,
          time: data.time,
          tz: data.timeTz
        },
        gps,
        geo
      };
    },
    async () => {
      await device?.close();
    }
  );
}
function getTimezone(lat, lng) {
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

export { getData as g };
//# sourceMappingURL=data2-C4wD6AIy.js.map
