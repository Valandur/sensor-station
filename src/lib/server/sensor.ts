import { appendFile, readFile, stat } from 'fs/promises';
import { dev } from '$app/environment';
import { differenceInSeconds, isSameSecond, isValid, parseISO } from 'date-fns';
import { env } from '$env/dynamic/private';

import type { Recording } from '$lib/models/Recording';

interface DhtSensor {
	read(type: number, pin: number): Promise<{ temperature: number; humidity: number }>;
}

export const ENABLED = env.SENSOR_ENABLED === '1';
const CACHE_TIME = Number(env.SENSOR_CACHE_TIME);
const DEVICE_PATH = env.SENSOR_DEVICE_PATH || '/dev/gpiomem';
const DHT_TYPE = Number(env.SENSOR_DHT_TYPE);
const DHT_PIN = Number(env.SENSOR_DHT_PIN);
const RECORDING_INTERVAL = Number(env.SENSOR_RECORDING_INTERVAL);
const RECORDINGS_PATH = 'data/sensor_recordings.csv';

let newest: Recording | null = null;
let cachedAt: Date = new Date(0);
let lastRecordedTs: Date = new Date(0);
let recordTimer: NodeJS.Timer | null = null;

export function startRecording() {
	if (!RECORDING_INTERVAL) {
		return;
	}

	console.log('RECORDING SENSOR');
	recordTimer = setInterval(() => record(), RECORDING_INTERVAL * 1000);
}

export function stopRecording() {
	if (recordTimer) {
		clearInterval(recordTimer);
		recordTimer = null;
	}
}

export async function getNewest(): Promise<Recording | null> {
	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		return newest;
	}

	const sensor = ENABLED ? await getSensor() : null;
	if (!sensor) {
		return ENABLED && dev ? getMockRecording() : null;
	}

	const { temperature, humidity } = await sensor.read(DHT_TYPE, DHT_PIN);

	newest = {
		ts: new Date(),
		temp: temperature,
		rh: humidity
	};
	cachedAt = new Date();

	return newest;
}

async function getSensor(): Promise<DhtSensor | null> {
	if (!(await checkDevice())) {
		return null;
	}

	try {
		const str = 'node-dht';
		const dht = await import(`${str}-sensor`);
		console.log(`SENSOR: TYPE: ${DHT_TYPE}, PIN: ${DHT_PIN}`);
		return dht.promises;
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
		console.warn(`GPIO not available @ ${DEVICE_PATH}`);
		return false;
	}
}

async function record() {
	try {
		if (!newest) {
			console.error('Could not record sensors, no recording present!');
			return;
		}

		if (isSameSecond(lastRecordedTs, newest.ts)) {
			console.error('Skipping recording because no new values are available');
			return;
		}

		await appendFile(RECORDINGS_PATH, `${newest.ts},${newest.temp},${newest.rh}\n`, 'utf-8');
		lastRecordedTs = newest.ts;

		console.log(`Recorded temp & rh`, newest.ts, newest.temp, newest.rh);
	} catch (err) {
		console.error(err);
	}
}

export async function getRecordings(): Promise<Recording[]> {
	const lines = await readFile(RECORDINGS_PATH, 'utf-8');
	return lines
		.split('\n')
		.map((line) => line.split(','))
		.map(([ts, temp, rh]) => ({ ts: parseISO(ts), temp: Number(temp), rh: Number(rh) }))
		.filter((rec) => isValid(rec.ts) && isFinite(rec.temp) && isFinite(rec.rh));
}

function getMockRecording(): Recording {
	return {
		ts: new Date(),
		temp: Math.random() * 50 - 20,
		rh: Math.random() * 60 + 20
	};
}
