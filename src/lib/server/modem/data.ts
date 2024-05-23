import { error } from '@sveltejs/kit';
import { find } from 'geo-tz/now';
import { Client } from '@googlemaps/google-maps-services-js';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { ModemData } from '$lib/models/ModemData';

import { Device } from './Device';
import { minutesToTz } from './utils';

const ENABLED = env.MODEM_ENABLED === '1';
const CACHE_TIME = Number(env.MODEM_CACHE_TIME);
const DEVICE_PATH = env.MODEM_DEVICE_PATH;
const BAUD_RATE = Number(env.MODEM_BAUD_RATE);
const PAUSE_TIME = Number(env.MODEM_PAUSE_TIME);
const WAIT_TIME = Number(env.MODEM_WAIT_TIME);
const CMD_TIMEOUT = Number(env.MODEM_CMD_TIMEOUT);
const GOOGLE_KEY = env.GOOGLE_KEY;

const logger = new BaseLogger('MODEM');
const cache = new BaseCache<ModemData>(logger, CACHE_TIME);
const client = new Client({});

export async function getData(forceUpdate = false): Promise<ModemData> {
	let device: Device | null = null;

	if (!ENABLED) {
		throw error(400, {
			message: `Modem is disabled`,
			key: 'modem.disabled'
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

			if (!(await device.checkAvailable())) {
				if (dev) {
					logger.warn('Using dev mock data');
					return getMockData();
				}

				throw error(500, {
					message: `Modem not available`,
					key: 'modem.notAvailable'
				});
			}

			await device.open();

			if (!(await device.checkReady())) {
				throw error(500, {
					message: `Modem not ready`,
					key: 'modem.notReady'
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
			logger.debug('Geo response:', JSON.stringify(geoData));

			let geo = null;
			if ('location' in geoData) {
				geo = {
					lat: geoData.location.lat,
					lng: geoData.location.lng,
					tz: getTimezone(geoData.location.lat, geoData.location.lng)
				};
			}

			return {
				ts: new Date(),
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

function getMockData(): ModemData {
	const lat = Math.random() * 180 - 90;
	const lng = Math.random() * 360 - 180;

	return {
		ts: new Date(),
		cellular: {
			operator: 'Swisscom 1nce.net',
			signal: Math.round(Math.random() * 4),
			time: new Date(),
			tz: '+01:00'
		},
		gps: Math.random() > 0.5 ? { lat, lng, tz: getTimezone(lat, lng) } : null,
		geo: Math.random() > 0.5 ? { lat, lng, tz: getTimezone(lat, lng) } : null
	};
}

function getTimezone(lat: number, lng: number) {
	const timeZone = find(lat, lng)[0];
	if (!timeZone) {
		return null;
	}

	const date = new Date();
	const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
	const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
	const diff = (tzDate.getTime() - utcDate.getTime()) / 6e4;
	return minutesToTz(diff);
}
