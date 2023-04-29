import { appendFile, stat } from 'fs/promises';
import { DEBUG } from '$env/static/private';
import { differenceInSeconds, isSameSecond } from 'date-fns';
import { env } from '$env/dynamic/private';
import { log } from 'console';
import type { PromisifiedBus } from 'i2c-bus';

import {
	type BatteryInfo,
	BatteryState,
	BatteryPowerState,
	BatteryChargingTemperature
} from '$lib/models/BatteryInfo';

export const ENABLED = env.BATTERY_ENABLED === '1';
const CACHE_TIME = Number(env.CALENDAR_CACHE_TIME);
const BUS_NUMBER = Number(env.BATTERY_BUS_NUMBER);
const I2C_ADDRESS = Number(env.BATTERY_I2C_ADDRESS);
const RECORDING_INTERVAL = Number(env.BATTERY_RECORDING_INTERVAL);
const RECORDINGS_PATH = 'data/battery_recordings.csv';

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

let status: BatteryInfo | null = null;
let cachedAt = new Date(0);

let lastRecordedTs = new Date(0);
let recordTimer: NodeJS.Timer | null = null;

export function startRecording() {
	if (!RECORDING_INTERVAL) {
		return;
	}

	console.log('RECORDING BATTERY');
	recordTimer = setInterval(() => record(), RECORDING_INTERVAL * 1000);
}

export function stopRecording() {
	if (recordTimer) {
		clearInterval(recordTimer);
		recordTimer = null;
	}
}

export async function getStatus(): Promise<BatteryInfo | null> {
	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		return status;
	}

	const bus = await openBus();
	if (!bus) {
		if (DEBUG) {
			return getMockStatus();
		} else {
			return null;
		}
	}

	const data = await read(bus, CMD_STATUS, 1);

	const rawStatus = data.readUint8(0);
	const isFault = (rawStatus & 0x01) !== 0;
	const isButton = (rawStatus & 0x02) !== 0;
	const state = BatteryState[(rawStatus >>> 2) & 0x03] || 'UNKNOWN';
	const powerIn = BatteryPowerState[(rawStatus >>> 4) & 0x03] || 'UNKNOWN';
	const powerIn5vIo = BatteryPowerState[(rawStatus >>> 6) & 0x03] || 'UNKNOWN';

	const charge = await getChargeLevel(bus);
	const temperature = await getBatteryTemperature(bus);
	const fault = await getFaultStatus(bus);
	const voltage = await getBatteryVoltage(bus);
	const current = await getBatteryCurrent(bus);
	const ioVoltage = await getIOVoltage(bus);
	const ioCurrent = await getIOCurrent(bus);

	await bus.close();

	const newStatus: BatteryInfo = {
		ts: new Date(),
		isFault,
		isButton,
		state,
		charge,
		temperature,
		powerIn: {
			state: powerIn,
			voltage: voltage,
			current: current
		},
		powerIn5vIo: {
			state: powerIn5vIo,
			voltage: ioVoltage,
			current: ioCurrent
		},
		fault
	};

	status = newStatus;
	cachedAt = new Date();

	return newStatus;
}

async function openBus(): Promise<PromisifiedBus | null> {
	if (!(await checkDevice())) {
		return null;
	}

	try {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const i2c = require('i2c-bus');
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

async function getChargeLevel(bus: PromisifiedBus) {
	const data = await read(bus, CMD_CHARGE_LEVEL, 1);
	return data.readUint8(0);
}

async function getBatteryTemperature(bus: PromisifiedBus) {
	const data = await read(bus, CMD_BATTERY_TEMPERATURE, 2);
	let temp = data.readUint8(0);
	if (temp & (1 << 7)) {
		temp = temp - (1 << 8);
	}
	return temp;
}

async function getBatteryVoltage(bus: PromisifiedBus) {
	const data = await read(bus, CMD_BATTERY_VOLTAGE, 2);
	return data.readUInt16LE(0) / 1000;
}

async function getBatteryCurrent(bus: PromisifiedBus) {
	const data = await read(bus, CMD_BATTERY_CURRENT, 2);
	let curr = data.readUInt16LE(0);
	if (curr & (1 << 15)) {
		curr = curr - (1 << 16);
	}
	return curr / 1000;
}

async function getIOVoltage(bus: PromisifiedBus) {
	const data = await read(bus, CMD_IO_VOLTAGE, 2);
	return data.readUInt16LE(0) / 1000;
}

async function getIOCurrent(bus: PromisifiedBus) {
	const data = await read(bus, CMD_IO_CURRENT, 2);
	let curr = data.readUInt16LE(0);
	if (curr & (1 << 15)) {
		curr = curr - (1 << 16);
	}
	return curr / 1000;
}

async function getFaultStatus(bus: PromisifiedBus) {
	const data = await read(bus, CMD_FAULT_EVENT, 1);

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

async function read(
	bus: PromisifiedBus,
	cmd: number,
	len: number,
	retry?: boolean
): Promise<Buffer> {
	const { buffer, bytesRead } = await bus.readI2cBlock(
		I2C_ADDRESS,
		cmd,
		len + 1,
		Buffer.alloc(len + 1)
	);
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

function getMockStatus(): BatteryInfo {
	return {
		ts: new Date(),
		isFault: Math.random() > 0.5,
		isButton: Math.random() > 0.5,
		state: BatteryState[Math.round(Math.random() * 3)],
		charge: Math.round(Math.random() * 100),
		temperature: Math.round(Math.random() * 100) / 10,
		powerIn: {
			state: BatteryPowerState[Math.round(Math.random() * 3)],
			current: Math.round(Math.random() * 1000) / 100 - 5,
			voltage: Math.round(Math.random() * 1000) / 100 - 5
		},
		powerIn5vIo: {
			state: BatteryPowerState[Math.round(Math.random() * 3)],
			voltage: Math.round(Math.round(Math.random() * 1000) / 100 - 5),
			current: Math.round(Math.round(Math.random() * 1000) / 100 - 5)
		},
		fault: {
			batteryProfileInvalid: Math.random() > 0.5,
			buttonPowerOff: Math.random() > 0.5,
			forcedPowerOff: Math.random() > 0.5,
			forcedSysPowerOff: Math.random() > 0.5,
			watchdogReset: Math.random() > 0.5,
			chargingTemperatureFault: BatteryChargingTemperature[Math.round(Math.random() * 3)]
		}
	};
}

async function record() {
	try {
		if (!status) {
			console.error('Could not record status, no status present!');
			return;
		}

		if (isSameSecond(lastRecordedTs, status.ts)) {
			console.error('Skipping recording because no new status is available');
			return;
		}

		// Copy our status so it doesn't get changed by an update while saving it
		const recordStatus = { ...status };

		await appendFile(RECORDINGS_PATH, statusToCsv(recordStatus), 'utf-8');

		lastRecordedTs = recordStatus.ts;

		log(`Recorded status`, recordStatus.ts, recordStatus.state, recordStatus.charge);
	} catch (err) {
		console.error(err);
	}
}

function statusToCsv(s: BatteryInfo): string {
	const p = s.powerIn;
	const p5 = s.powerIn5vIo;
	const f = s.fault;
	return (
		`${s.ts},${s.isFault},${s.isButton},${s.state},${s.charge},${s.temperature},${p.state},${p.voltage},${p.current},` +
		`${p5.state},${p5.voltage},${p5.current},${f.buttonPowerOff}.${f.forcedPowerOff},${f.forcedSysPowerOff},${f.watchdogReset},${f.batteryProfileInvalid},${f.chargingTemperatureFault}\n`
	);
}
