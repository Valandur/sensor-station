import TuyAPI from 'tuyapi';
import { error } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { TuyaInfo } from '$lib/models/TuyaInfo';

import { PROP_MAP } from './props';

const ENABLED = env.TUYA_ENABLED === '1';
const CACHE_TIME = Number(env.TUYA_CACHE_TIME);
const CLIENT_ID = env.TUYA_CLIENT_ID;
const CLIENT_SECRET = env.TUYA_CLIENT_SECRET;
const PROTOCOL_VERSION = env.TUYA_PROTCOL_VERSION;
const DEVICE_IP = env.TUYA_DEVICE_IP;

const logger = new BaseLogger('TUYA');
const cache = new BaseCache<TuyaInfo>(logger, CACHE_TIME);

export async function getData(forceUpdate = false) {
	const device = new TuyAPI({
		id: CLIENT_ID,
		key: CLIENT_SECRET,
		ip: DEVICE_IP,
		version: PROTOCOL_VERSION,
		issueGetOnConnect: false
	});

	return cache.withDefault(forceUpdate, async () => {
		if (!ENABLED) {
			throw error(400, {
				message: `TUYA is disabled`,
				key: 'tuya.disabled'
			});
		}

		await device.find();
		logger.debug('Device found');

		await device.connect();
		logger.debug('Device connected');

		const status = await device.get({ schema: true });
		if (typeof status !== 'object') {
			throw error(500, {
				message: 'Could not parse TUYA data',
				key: 'tuya.status.invalid'
			});
		}

		device.disconnect();
		logger.debug('Device disconnected');

		const info: any = {};
		for (const [id, { key, map }] of PROP_MAP) {
			info[key] = map(status.dps[id]);
		}

		return {
			ts: new Date(),
			...info
		};
	});
}
