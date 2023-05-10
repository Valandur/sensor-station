import { appendFile, mkdir, readFile, stat } from 'node:fs/promises';
import { dirname } from 'node:path';
import { error } from '@sveltejs/kit';
import { format, isSameMinute, isValid, parseISO } from 'date-fns';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { SensorData } from '$lib/models/SensorData';

import type { DhtSensor } from './types';

const ENABLED = env.SENSOR_ENABLED === '1';
const CACHE_TIME = Number(env.SENSOR_CACHE_TIME);
const DEVICE_PATH = env.SENSOR_DEVICE_PATH;
const DHT_TYPE = Number(env.SENSOR_DHT_TYPE);
const DHT_PIN = Number(env.SENSOR_DHT_PIN);
const RECORDING_INTERVAL = Number(env.SENSOR_RECORDING_INTERVAL);
const RECORDING_FORMAT = env.SENSOR_RECORDING_FORMAT;
const RECORDINGS_PATH = 'data/sensor/recording';

const logger = new BaseLogger('SENSOR');
const cache = new BaseCache<SensorData>(logger, CACHE_TIME);

let recordTimer: ReturnType<typeof setInterval> | null = null;
let lastRecordedTs: Date = new Date(0);

export async function getData(forceUpdate = false) {
	return cache.withDefault(forceUpdate, async () => {
		if (!ENABLED) {
			throw error(400, {
				message: `SBB is disabled`,
				key: 'sbb.disabled'
			});
		}

		if (!(await stat(DEVICE_PATH).catch(() => null))) {
			if (dev) {
				return getMockData();
			}

			throw error(500, {
				message: `Sensor not ready`,
				key: 'sensor.notReady'
			});
		}

		const str = 'node-dht';
		const dht = await import(/* @vite-ignore */ `${str}-sensor`);
		const sensor: DhtSensor = dht.promises;

		const { temperature, humidity } = await sensor.read(DHT_TYPE, DHT_PIN);

		return {
			ts: new Date(),
			temp: temperature,
			rh: humidity
		};
	});
}

export async function getRecordings(): Promise<SensorData[]> {
	const lines = await readFile(RECORDINGS_PATH, 'utf-8');
	return lines
		.split('\n')
		.map((line) => line.split(','))
		.map(([ts, temp, rh]) => ({ ts: parseISO(ts), temp: Number(temp), rh: Number(rh) }))
		.filter((rec) => isValid(rec.ts) && isFinite(rec.temp) && isFinite(rec.rh));
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
		const recordedData = JSON.parse(JSON.stringify(data));

		await appendFile(RECORDINGS_PATH, dataToCsv(recordedData), 'utf-8');
		lastRecordedTs = recordedData.ts;

		logger.debug(`Recorded`, recordedData.ts, recordedData.temp, recordedData.rh);
	} catch (err) {
		logger.error(err);
	}
}

function csvHeader(): string {
	return `Timestamp,Temperature,RH`;
}

function dataToCsv(d: SensorData): string {
	return `${d.ts},${d.temp},${d.rh}\n`;
}

function getMockData(): SensorData {
	return {
		ts: new Date(),
		temp: Math.random() * 50 - 20,
		rh: Math.random() * 60 + 20
	};
}
