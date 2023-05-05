import { appendFile, readFile, stat } from 'node:fs/promises';
import { differenceInSeconds, isSameSecond, isValid, parseISO } from 'date-fns';
import { error } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import { Logger } from '$lib/logger';
import type { SensorMeasurement } from '$lib/models/SensorMeasurement';

export const ENABLED = env.SENSOR_ENABLED === '1';
const CACHE_TIME = Number(env.SENSOR_CACHE_TIME);
const DEVICE_PATH = env.SENSOR_DEVICE_PATH;
const DHT_TYPE = Number(env.SENSOR_DHT_TYPE);
const DHT_PIN = Number(env.SENSOR_DHT_PIN);
const RECORDING_INTERVAL = Number(env.SENSOR_RECORDING_INTERVAL);
const RECORDINGS_PATH = 'data/sensor_recordings.csv';

const logger = new Logger('SENSOR');

let newest: SensorMeasurement | null = null;
let cachedAt: Date = new Date(0);
let lastRecordedTs: Date = new Date(0);
let recordTimer: NodeJS.Timer | null = null;

export function startRecording() {
	if (!RECORDING_INTERVAL) {
		return;
	}

	logger.info('Recording started', RECORDING_INTERVAL);
	recordTimer = setInterval(() => record(), RECORDING_INTERVAL * 1000);
}

export function stopRecording() {
	if (recordTimer) {
		logger.info('Recording stopped');
		clearInterval(recordTimer);
		recordTimer = null;
	}
}

export async function getNewest(): Promise<SensorMeasurement | null> {
	if (!ENABLED) {
		throw error(400, { message: 'Sensor module is disabled', key: 'sensor.disabled' });
	}

	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		logger.debug('Using cached measurement');
		return newest;
	}

	logger.debug('Updating...');
	const startTime = process.hrtime.bigint();

	try {
		if (!(await stat(DEVICE_PATH).catch(() => null))) {
			if (dev) {
				newest = getMockMeasurement();
				cachedAt = new Date();
				return newest;
			} else {
				throw new Error('Sensor device path not available');
			}
		}

		const str = 'node-dht';
		const dht = await import(`${str}-sensor`);
		const sensor: DhtSensor = dht.promises;

		const { temperature, humidity } = await sensor.read(DHT_TYPE, DHT_PIN);

		newest = {
			ts: new Date(),
			temp: temperature,
			rh: humidity
		};
		cachedAt = new Date();

		return newest;
	} catch (err) {
		throw logger.toSvelteError(err);
	} finally {
		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		logger.info('Updated', diffTime, 'ms');
	}
}

async function record() {
	try {
		if (!newest) {
			logger.error('Could not record sensors, no recording present!');
			return;
		}

		if (isSameSecond(lastRecordedTs, newest.ts)) {
			logger.warn('Skipping recording because no new values are available');
			return;
		}

		await appendFile(RECORDINGS_PATH, `${newest.ts},${newest.temp},${newest.rh}\n`, 'utf-8');
		lastRecordedTs = newest.ts;

		logger.debug(`Recorded measurement`, newest.ts, newest.temp, newest.rh);
	} catch (err) {
		logger.error(err);
	}
}

export async function getRecordings(): Promise<SensorMeasurement[]> {
	const lines = await readFile(RECORDINGS_PATH, 'utf-8');
	return lines
		.split('\n')
		.map((line) => line.split(','))
		.map(([ts, temp, rh]) => ({ ts: parseISO(ts), temp: Number(temp), rh: Number(rh) }))
		.filter((rec) => isValid(rec.ts) && isFinite(rec.temp) && isFinite(rec.rh));
}

function getMockMeasurement(): SensorMeasurement {
	return {
		ts: new Date(),
		temp: Math.random() * 50 - 20,
		rh: Math.random() * 60 + 20
	};
}

interface DhtSensor {
	read(type: number, pin: number): Promise<{ temperature: number; humidity: number }>;
}
