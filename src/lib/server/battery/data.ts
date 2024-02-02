import { appendFile, mkdir, stat } from 'node:fs/promises';
import { dirname } from 'node:path';
import { error } from '@sveltejs/kit';
import { format, isSameMinute } from 'date-fns';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import { BatteryChargingTemperature } from '$lib/models/BatteryChargingTemperature';
import { BatteryPowerState } from '$lib/models/BatteryPowerState';
import { BatteryState } from '$lib/models/BatteryState';
import type { BatteryData } from '$lib/models/BatteryData';

import { Device } from './Device';

const ENABLED = env.BATTERY_ENABLED === '1';
const CACHE_TIME = Number(env.BATTERY_CACHE_TIME);
const BUS_NUMBER = Number(env.BATTERY_BUS_NUMBER);
const I2C_ADDRESS = Number(env.BATTERY_I2C_ADDRESS);
const RECORDING_INTERVAL = Number(env.BATTERY_RECORDING_INTERVAL);
const RECORDING_FORMAT = env.BATTERY_RECORDING_FORMAT;
const RECORDINGS_PATH = 'data/battery/recording';

const logger = new BaseLogger('BATTERY');
const cache = new BaseCache<BatteryData>(logger, CACHE_TIME);

let recordTimer: ReturnType<typeof setInterval> | null = null;
let lastRecordedTs: Date = new Date(0);

export async function getData(forceUpdate = false): Promise<BatteryData> {
	let device: Device | null = null;

	if (!ENABLED) {
		throw error(400, {
			message: `Battery is disabled`,
			key: 'battery.disabled'
		});
	}

	return cache.withDefault(
		forceUpdate,
		async () => {
			device = new Device(BUS_NUMBER, I2C_ADDRESS);

			if (!(await device.checkReady())) {
				if (dev) {
					logger.warn('Using dev mock data');
					return getMockData();
				}

				throw error(500, {
					message: `Modem not ready`,
					key: 'modem.notReady'
				});
			}

			await device.open();

			const data = await device.readAll();

			return {
				ts: new Date(),
				...data
			};
		},
		async () => {
			await device?.close();
		}
	);
}

export function setup() {
	if (recordTimer) {
		logger.info('Recording stopped');

		clearInterval(recordTimer);
		recordTimer = null;
	}

	if (!RECORDING_INTERVAL) {
		return;
	}

	logger.info('Recording started', RECORDING_INTERVAL);
	recordTimer = setInterval(() => record(), RECORDING_INTERVAL * 1000);
}

async function record() {
	try {
		const data = cache.getDefaultData();
		if (!data) {
			logger.warn('No data to record');
			return;
		}

		if (isSameMinute(lastRecordedTs, data.ts)) {
			logger.debug('Skipping recording because no new data is available');
			return;
		}

		const fileName = `${RECORDINGS_PATH}_${format(new Date(), RECORDING_FORMAT)}.csv`;

		await mkdir(dirname(fileName), { recursive: true });

		// Add csv header if the file is new
		if (!(await stat(fileName).catch(() => null))) {
			await appendFile(fileName, csvHeader(), 'utf-8');
		}

		// Deep clone our data so it doesn't get changed by an update while saving it
		const recordedTs = new Date(data.ts);
		const recordedData = JSON.parse(JSON.stringify(data));

		await appendFile(fileName, dataToCsv(recordedData), 'utf-8');
		lastRecordedTs = recordedTs;

		logger.debug(`Recorded`, recordedTs, recordedData.state, recordedData.charge);
	} catch (err) {
		logger.error(err);
	}
}

function csvHeader(): string {
	return (
		`Timestamp,IsFault,IsButton,State,Charge,Temperature,PowerIn_State,PowerIn_Voltage,PowerIn_Current,` +
		`PowerIn5vIO_State,PowerIn5vIO_Voltage,PowerIn5vIO_Current,ButtonPowerOff,ForcedPowerOff,ForcedSysPowerOff,` +
		`WatchdogReset,BatteryProfileInvalid,ChargingTemperatureFault\n`
	);
}

function dataToCsv(s: BatteryData): string {
	const p = s.powerIn;
	const p5 = s.powerIn5vIo;
	const f = s.fault;
	return (
		`${s.ts},${s.isFault},${s.isButton},${s.state},${s.charge},${s.temperature},${p.state},${p.voltage},${p.current},` +
		`${p5.state},${p5.voltage},${p5.current},${f.buttonPowerOff},${f.forcedPowerOff},${f.forcedSysPowerOff},` +
		`${f.watchdogReset},${f.batteryProfileInvalid},${f.chargingTemperatureFault}\n`
	);
}

function getMockData(): BatteryData {
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
