import superagent from 'superagent';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { PrinterInfo } from '$lib/models/PrinterInfo';

const ENABLED = env.PRINTER_ENABLED === '1';
const CACHE_TIME = Number(env.PRINTER_CACHE_TIME);
const API_URL = env.PRINTER_API_URL;
const API_KEY = env.PRINTER_API_KEY;

const logger = new BaseLogger('PRINTER');
const cache = new BaseCache<PrinterInfo>(logger, CACHE_TIME);

export async function getData(forceUpdate = false) {
	return cache.withDefault(forceUpdate, async () => {
		if (!ENABLED) {
			throw error(400, {
				message: `Printer is disabled`,
				key: 'printer.disabled'
			});
		}

		const statusUrl = `${API_URL}/api/v1/status`;
		const { body } = await superagent.get(statusUrl).set('X-API-Key', API_KEY);

		return {
			ts: new Date(),
			...body
		};
	});
}
