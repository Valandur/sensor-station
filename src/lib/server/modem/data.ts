import { error } from '@sveltejs/kit';
import { find } from 'geo-tz';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { ModemData } from '$lib/models/ModemData';

import { Device } from './Device';

const ENABLED = env.MODEM_ENABLED === '1';
const CACHE_TIME = Number(env.MODEM_CACHE_TIME);
const DEVICE_PATH = env.MODEM_DEVICE_PATH;
const BAUD_RATE = Number(env.MODEM_BAUD_RATE);
const PAUSE_TIME = Number(env.MODEM_PAUSE_TIME);
const WAIT_TIME = Number(env.MODEM_WAIT_TIME);
const CMD_TIMEOUT = Number(env.MODEM_CMD_TIMEOUT);

const logger = new BaseLogger('MODEM');
const cache = new BaseCache<ModemData>(logger, CACHE_TIME);

export async function getData(forceUpdate = false): Promise<ModemData> {
	let device: Device | null = null;

	return cache.withDefault(
		forceUpdate,
		async () => {
			if (!ENABLED) {
				throw error(400, {
					message: `Modem is disabled`,
					key: 'modem.disabled'
				});
			}

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
			const gpsTz = (data.lat && data.lng ? find(data.lat, data.lng) : [])[0] || null;

			return {
				ts: new Date(),
				...data,
				gpsTz
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
		time: new Date(),
		timeTz: '+01:00',
		operator: 'Swisscom 1nce.net',
		signal: Math.round(Math.random() * 4),
		lat: lat,
		lng: lng,
		gpsTz: find(lat, lng)[0] || null
	};
}
