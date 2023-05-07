import { parseISO, differenceInSeconds } from 'date-fns';
import { e as error } from './index-39e97e00.js';
import { find } from 'geo-tz';
import { InterByteTimeoutParser } from '@serialport/parser-inter-byte-timeout';
import { SerialPort } from 'serialport';
import { stat } from 'node:fs/promises';
import { d as dev } from './environment-19782cc3.js';
import { b as private_env } from './shared-server-b7e48788.js';
import { L as Logger } from './logger-515117da.js';

const ENABLED = private_env.MODEM_ENABLED === "1";
const CACHE_TIME = Number(private_env.MODEM_CACHE_TIME);
const DEVICE_PATH = private_env.MODEM_DEVICE_PATH;
const PAUSE_TIME = Number(private_env.MODEM_PAUSE_TIME);
const WAIT_TIME = Number(private_env.MODEM_WAIT_TIME);
const CMD_TIMEOUT = Number(private_env.MODEM_CMD_TIMEOUT);
const COPS = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ = /\+CSQ: (\d+),(\d+)/i;
const CCLK = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS = /\+CGPSINFO: ([\d.]+),(\w),([\d.]+),(\w),(\d+),([\d.]+),([\d.]+),([\d.]+),/i;
const logger = new Logger("MODEM");
let status = null;
let cachedAt = /* @__PURE__ */ new Date(0);
async function getStatus() {
  if (!ENABLED) {
    throw error(400, { message: "Modem module is disabled", key: "modem.disabled" });
  }
  if (status && differenceInSeconds(/* @__PURE__ */ new Date(), cachedAt) <= CACHE_TIME) {
    logger.debug("Using cached status");
    return status;
  }
  logger.debug("Updating...");
  const startTime = process.hrtime.bigint();
  let commander = null;
  try {
    if (!await stat(DEVICE_PATH).catch(() => null)) {
      if (dev)
        ;
      else {
        throw new Error("Modem device path not available");
      }
    }
    commander = new Commander(DEVICE_PATH, 115200);
    await commander.open();
    const res = await commander.send("AT");
    if (res !== "OK") {
      throw error(500, {
        message: `Modem is not ready`,
        key: "modem.notReady",
        params: { status: res }
      });
    }
    let operator = null;
    const copsResp = await commander.send("AT+COPS?");
    const copsMatch = COPS.exec(copsResp);
    if (copsMatch) {
      operator = copsMatch[3] || null;
    }
    let signal = null;
    const csqResp = await commander.send("AT+CSQ");
    const csqMatch = CSQ.exec(csqResp);
    if (csqMatch) {
      const rawSig = Number(csqMatch[1]);
      signal = rawSig < 10 ? 1 : rawSig < 15 ? 2 : rawSig < 20 ? 3 : 4;
    }
    let time = null;
    let tzOffset = null;
    const cclkResp = await commander.send("AT+CCLK?");
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
      tzOffset = `${tzSign}${tzHours}:${tzMinutes}`;
      time = parseISO(`${year}-${month}-${day}T${hour}:${minute}:${second}${tzOffset}`);
    }
    let lat = null;
    let lng = null;
    let tzName = null;
    const gpsResp = await commander.send("AT+CGPSINFO");
    const gpsMatch = GPS.exec(gpsResp);
    if (gpsMatch) {
      lat = Number(gpsMatch[1]) / (gpsMatch[2] === "S" ? -100 : 100);
      lng = Number(gpsMatch[3]) / (gpsMatch[4] === "W" ? -100 : 100);
      tzName = find(lat, lng)[0] || null;
    }
    const newStatus = {
      ts: /* @__PURE__ */ new Date(),
      isConnected: true,
      operator,
      signal,
      time,
      tzOffset,
      lat,
      lng,
      tzName
    };
    status = newStatus;
    cachedAt = /* @__PURE__ */ new Date();
    return newStatus;
  } finally {
    await commander?.close().catch((err) => logger.warn("Closing error", err));
    const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
    logger.info("Updated", diffTime, "ms");
  }
}
class Commander {
  port;
  parser;
  constructor(devicePath, baudRate) {
    this.port = new SerialPort({
      path: devicePath,
      baudRate,
      autoOpen: false
    });
    this.parser = this.port.pipe(new InterByteTimeoutParser({ interval: WAIT_TIME }));
  }
  async send(data) {
    if (PAUSE_TIME > 0) {
      await new Promise((resolve) => setTimeout(resolve, PAUSE_TIME));
    }
    return new Promise((resolve, reject) => {
      logger.debug("::", data);
      let resolved = false;
      const onTimeout = () => {
        if (resolved) {
          return;
        }
        logger.warn("Timed out");
        this.parser.off("data", onData);
        reject(new Error("Timed out"));
        resolved = true;
      };
      const timeout = setTimeout(onTimeout, CMD_TIMEOUT);
      const onData = (buffer) => {
        const response = buffer.toString("utf-8").trim();
        logger.debug("<<", response);
        if (resolved) {
          logger.warn("Rceived out of band");
          return;
        }
        clearTimeout(timeout);
        resolve(response);
        resolved = true;
      };
      this.parser.once("data", onData);
      this.port.write(`${data}\r
`, (err) => {
        logger.debug(">>", data);
        if (err && !resolved) {
          this.parser.off("data", onData);
          clearTimeout(timeout);
          reject(err);
          resolved = true;
        }
      });
    });
  }
  async open() {
    return new Promise(
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
}

export { getStatus as g };
//# sourceMappingURL=modem-574a12e0.js.map
