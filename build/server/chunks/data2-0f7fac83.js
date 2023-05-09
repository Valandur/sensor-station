import { e as error } from './index-39e97e00.js';
import { find } from 'geo-tz';
import { b as private_env } from './shared-server-b7e48788.js';
import { B as BaseCache } from './BaseCache-8b1d2e36.js';
import { B as BaseLogger } from './BaseLogger-d23f9d0c.js';
import { parseISO } from 'date-fns';
import { SerialPort, InterByteTimeoutParser } from 'serialport';
import { stat } from 'node:fs/promises';

const COPS = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ = /\+CSQ: (\d+),(\d+)/i;
const CCLK = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS = /\+CGPSINFO: ([\d.]+),(\w),([\d.]+),(\w),(\d+),([\d.]+),([\d.]+),([\d.]+),/i;
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
  }
  async close() {
    if (!this.port.isOpen) {
      return;
    }
    return new Promise(
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
    const copsMatch = COPS.exec(copsResp);
    return copsMatch?.[3] || null;
  }
  async getCellularSignal() {
    const csqResp = await this.send("AT+CSQ");
    const csqMatch = CSQ.exec(csqResp);
    if (csqMatch) {
      const rawSig = Number(csqMatch[1]);
      return rawSig < 10 ? 1 : rawSig < 15 ? 2 : rawSig < 20 ? 3 : 4;
    }
    return null;
  }
  async getCellularTimeAndTz() {
    const cclkResp = await this.send("AT+CCLK?");
    const cclkMatch = CCLK.exec(cclkResp);
    if (cclkMatch) {
      const year = `${2e3 + Number(cclkMatch[1])}`;
      const month = `${Number(cclkMatch[2])}`.padStart(2, "0");
      const day = `${Number(cclkMatch[3])}`.padStart(2, "0");
      const hour = `${Number(cclkMatch[4])}`.padStart(2, "0");
      const minute = `${Number(cclkMatch[5])}`.padStart(2, "0");
      const second = `${Number(cclkMatch[6])}`.padStart(2, "0");
      const rawTz = Number(cclkMatch[7]) * 15;
      const tzSign = rawTz > 0 ? "+" : "-";
      const tzHours = `${Math.floor(Math.abs(rawTz) / 60)}`.padStart(2, "0");
      const tzMinutes = `${Math.abs(rawTz) % 60}`.padStart(2, "0");
      const tz = `${tzSign}${tzHours}:${tzMinutes}`;
      const time = parseISO(`${year}-${month}-${day}T${hour}:${minute}:${second}${tz}`);
      return [time, tz];
    }
    return [null, null];
  }
  async getGPS() {
    const gpsResp = await this.send("AT+CGPSINFO");
    const gpsMatch = GPS.exec(gpsResp);
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
        const response = buffer.toString("utf-8").trim();
        this.logger.debug("<<", response);
        if (resolved) {
          this.logger.warn("Out-of-band data", response);
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
const logger = new BaseLogger("MODEM");
const cache = new BaseCache(logger, CACHE_TIME);
async function getData(forceUpdate = false) {
  let device = null;
  return cache.withDefault(
    forceUpdate,
    async () => {
      if (!ENABLED) {
        throw error(400, {
          message: `Modem is disabled`,
          key: "modem.disabled"
        });
      }
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
      const gpsTz = (data.lat && data.lng ? find(data.lat, data.lng) : [])[0] || null;
      return {
        ts: /* @__PURE__ */ new Date(),
        ...data,
        gpsTz
      };
    },
    async () => {
      await device?.close();
    }
  );
}

export { getData as g };
//# sourceMappingURL=data2-0f7fac83.js.map
