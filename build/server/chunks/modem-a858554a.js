import { d as dev } from './environment-19782cc3.js';
import { differenceInSeconds, parseISO } from 'date-fns';
import { b as private_env } from './shared-server-b7e48788.js';
import { find } from 'geo-tz';
import { ReadlineParser } from '@serialport/parser-readline';
import { SerialPort } from 'serialport';
import { stat } from 'fs/promises';

const ENABLED = private_env.MODEM_ENABLED === "1";
const CACHE_TIME = Number(private_env.MODEM_CACHE_TIME);
const DEVICE_PATH = private_env.MODEM_DEVICE_PATH || "/dev/ttyUSB2";
const BASE_LAT = Number(private_env.MODEM_BASE_LAT);
const BASE_LNG = Number(private_env.MODEM_BASE_LNG);
const COPS = /\+COPS: (\d+),(\d+),"(.+)",(\d+)/i;
const CSQ = /\+CSQ: (\d+),(\d+)/i;
const CCLK = /\+CCLK: "(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)([-+]\d+)"/i;
const GPS = /\+CGPSINFO: ([\d.]+),(\w),([\d.]+),(\w),(\d+),([\d.]+),([\d.]+),([\d.]+),/i;
const RESPONSE_CODES = ["OK", "ERROR"];
let status = null;
let cachedAt = /* @__PURE__ */ new Date(0);
async function getStatus() {
  if (differenceInSeconds(/* @__PURE__ */ new Date(), cachedAt) <= CACHE_TIME) {
    return status;
  }
  const commander = ENABLED ? await openConnection() : null;
  if (!commander) {
    return ENABLED && dev ? getMockStatus() : null;
  }
  try {
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
      tzName,
      cached: false
    };
    status = newStatus;
    cachedAt = /* @__PURE__ */ new Date();
    return newStatus;
  } finally {
    await commander.close();
  }
}
async function openConnection() {
  if (!await checkDevice()) {
    return null;
  }
  try {
    const commander = new Commander(DEVICE_PATH, 115200);
    await commander.open();
    const res = await commander.send("AT");
    if (res !== "OK") {
      throw new Error(`Modem is reporting status ${res}`);
    }
    return commander;
  } catch (err) {
    console.error(err);
    return null;
  }
}
async function checkDevice() {
  try {
    await stat(DEVICE_PATH);
    return true;
  } catch {
    console.warn(`Modem not available @ ${DEVICE_PATH}`);
    return false;
  }
}
function getMockStatus() {
  return {
    ts: /* @__PURE__ */ new Date(),
    isConnected: Math.random() > 0.5,
    time: /* @__PURE__ */ new Date(),
    tzOffset: "+01:00",
    operator: "DR",
    signal: Math.round(Math.random() * 4),
    lat: BASE_LAT,
    lng: BASE_LNG,
    tzName: find(BASE_LAT, BASE_LNG)[0] || "Unknown",
    cached: Math.random() > 0.5
  };
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
    this.parser = this.port.pipe(new ReadlineParser({ delimiter: "\n" }));
  }
  async send(data) {
    return new Promise((resolve, reject) => {
      let response = "";
      const onData = (line) => {
        response += line;
        if (RESPONSE_CODES.some((code) => line.includes(code))) {
          this.parser.off("data", onData);
          resolve(response.trim());
        }
      };
      this.parser.on("data", onData);
      this.port.write(`${data}\r
`, (err) => {
        if (err) {
          this.parser.off("data", onData);
          reject(err);
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
    return new Promise(
      (resolve) => this.port.close((err) => {
        if (err) {
          console.error("Error while closing", err);
        }
        resolve();
      })
    );
  }
}

export { ENABLED as E, getStatus as g };
//# sourceMappingURL=modem-a858554a.js.map
