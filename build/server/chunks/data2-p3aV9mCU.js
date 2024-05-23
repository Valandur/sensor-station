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
const COPS_REGEX = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ_REGEX = /\+CSQ: (\d+),(\d+)/i;
const CCLK_REGEX = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS_REGEX = /\+CGPSINFO: ([\d.]+),(\w),([\d.]+),(\w),(\d+),([\d.]+),([\d.]+),([\d.]+),/i;
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
    const [time, timeTz] = await this.getCellularTimeAndTz();
    const [lat, lng] = await this.getGPS();
    return {
      operator,
      signal,
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
      const rawSig = Number(csqMatch[1]);
      if (rawSig === 99) {
        return 0;
      } else if (rawSig < 10) {
        return 1;
      } else if (rawSig < 15) {
        return 2;
      } else if (rawSig < 20) {
        return 3;
      } else {
        return 4;
      }
    }
    return null;
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
      const timeout = setTimeout(onTimeout, this.config.timeoutMs);
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
        resolve(response);
        resolved = true;
      };
      this.parser.once("data", onData);
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
const ENABLED = private_env.MODEM_ENABLED === "1";
const CACHE_TIME = Number(private_env.MODEM_CACHE_TIME);
const DEVICE_PATH = private_env.MODEM_DEVICE_PATH;
const BAUD_RATE = Number(private_env.MODEM_BAUD_RATE);
const PAUSE_TIME = Number(private_env.MODEM_PAUSE_TIME);
const WAIT_TIME = Number(private_env.MODEM_WAIT_TIME);
const CMD_TIMEOUT = Number(private_env.MODEM_CMD_TIMEOUT);
const GOOGLE_KEY = private_env.GOOGLE_KEY;
const logger = new BaseLogger("MODEM");
const cache = new BaseCache(logger, CACHE_TIME);
const client = new Client({});
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
      const { data: geoData } = await client.geolocate({
        data: {
          considerIp: true
        },
        params: {
          key: GOOGLE_KEY
        }
      });
      logger.debug("Geo response:", JSON.stringify(geoData));
      let geo = null;
      if ("location" in geoData) {
        geo = {
          lat: geoData.location.lat,
          lng: geoData.location.lng,
          tz: getTimezone(geoData.location.lat, geoData.location.lng)
        };
      }
      return {
        ts: /* @__PURE__ */ new Date(),
        cellular: {
          operator: data.operator,
          signal: data.signal,
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
//# sourceMappingURL=data2-p3aV9mCU.js.map
