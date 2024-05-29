import { error } from '@sveltejs/kit';
import { find } from 'geo-tz/now';
import { Client } from '@googlemaps/google-maps-services-js';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { ModemData, ModemLocation } from '$lib/models/ModemData';

import { Device } from './Device';
import { minutesToTz } from './utils';

const UNWIRED_URL = 'https://eu1.unwiredlabs.com/v2/process';

const ENABLED = env.MODEM_ENABLED === '1';
const CACHE_TIME = Number(env.MODEM_CACHE_TIME);
const DEVICE_PATH = env.MODEM_DEVICE_PATH;
const BAUD_RATE = Number(env.MODEM_BAUD_RATE);
const PAUSE_TIME = Number(env.MODEM_PAUSE_TIME);
const WAIT_TIME = Number(env.MODEM_WAIT_TIME);
const CMD_TIMEOUT = Number(env.MODEM_CMD_TIMEOUT);
const GOOGLE_KEY = env.GOOGLE_KEY;
const UNWIRED_TOKEN = env.MODEM_UNWIRED_TOKEN;

const logger = new BaseLogger('MODEM');
const cache = new BaseCache<ModemData>(logger, CACHE_TIME);
const client = new Client({});

let prevTower = '';
let prevGeo: ModemLocation | null = null;

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
			const data = await device.readAll();

			let gps = null;
			if (data.lat && data.lng) {
				gps = {
					lat: data.lat,
					lng: data.lng,
					tz: getTimezone(data.lat, data.lng)
				};
			}

			let geo = null;
			if (data.mcc && data.mnc && data.lac && data.cid) {
				const tower = `${data.mcc}-${data.mnc}-${data.lac}-${data.cid}`;

				if (tower != prevTower) {
					try {
						const resp = await fetch(UNWIRED_URL, {
							method: 'POST',
							body: JSON.stringify({
								token: UNWIRED_TOKEN,
								radio: data.netType,
								mcc: data.mcc,
								mnc: data.mnc,
								cells: [
									{
										lac: data.lac,
										cid: data.cid
									}
								]
							}),
							headers: { 'Content-Type': 'application/json' }
						});

						const unwiredData = await resp.json();
						logger.debug('Unwired geo response:', JSON.stringify(unwiredData));

						if (unwiredData.status === 'ok') {
							geo = {
								lat: unwiredData.lat,
								lng: unwiredData.lon,
								tz: getTimezone(unwiredData.lat, unwiredData.lon)
							};
						}
					} catch (err) {
						logger.error('Unwired error', err);
					}

					if (geo === null) {
						try {
							const { data: googleData } = await client.geolocate({
								data: {
									considerIp: true,
									carrier: data.operator ?? undefined,
									radioType: (data.netType as any) ?? undefined,
									cellTowers: [
										{
											mobileCountryCode: data.mcc,
											mobileNetworkCode: data.mnc,
											signalStrength: data.signal ?? undefined,
											cellId: data.cid,
											locationAreaCode: data.lac
										}
									]
								},
								params: {
									key: GOOGLE_KEY
								}
							});
							logger.debug('Google geo response:', JSON.stringify(googleData));

							if ('location' in googleData) {
								geo = {
									lat: googleData.location.lat,
									lng: googleData.location.lng,
									tz: getTimezone(googleData.location.lat, googleData.location.lng)
								};
							}
						} catch (err) {
							logger.error('Google geo error', err);
						}
					}

					prevTower = tower;
					prevGeo = JSON.parse(JSON.stringify(geo));
				} else {
					geo = JSON.parse(JSON.stringify(prevGeo));
					logger.debug('Using cached geo info', JSON.stringify(geo));
				}
			}

			return {
				ts: new Date(),
				cellular: {
					operator: data.operator,
					signal: data.signal,
					netType: data.netType,
					mcc: data.mcc,
					mnc: data.mnc,
					lac: data.lac,
					cid: data.cid,
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
			netType: 'LTE',
			mcc: 228,
			mnc: 1,
			lac: 65534,
			cid: 19444485,
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
