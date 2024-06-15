import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { find } from 'geo-tz/now';
import { Client } from '@googlemaps/google-maps-services-js';

import {
	MODEM_SERVICE_TYPE,
	MODEM_SERVICE_ACTIONS,
	type ModemInfo,
	type ModemLocation,
	type ModemServiceAction,
	type ModemServiceConfig,
	type ModemServiceMainData
} from '$lib/models/modem';

import { BaseService, type ServiceActions, type ServiceGetDataOptions } from '../BaseService';
import { Cache } from '../Cache';
import { Device } from './Device';
import { minutesToTz } from './utils';

interface CacheData {
	ts: Date;
	tower: string | null;
	geo: ModemLocation | null;
	info: ModemInfo;
}

const ENABLED = env.MODEM_ENABLED === '1';
const UNWIRED_URL = 'https://eu1.unwiredlabs.com/v2/process';

export class ModemService extends BaseService<ModemServiceAction, ModemServiceConfig> {
	public static readonly actions = MODEM_SERVICE_ACTIONS;
	public override readonly type = MODEM_SERVICE_TYPE;

	private readonly cache: Cache<CacheData> = new Cache(this.logger);
	private readonly client = new Client({});

	protected getDefaultConfig(): ModemServiceConfig {
		return {
			devicePath: '/dev/ttyUSB2',
			baudRate: 115200,
			pauseTime: 0,
			waitTime: 100,
			cmdTimeout: 1000,
			googleKey: '',
			unwiredToken: ''
		};
	}

	protected getActions(): ServiceActions<ModemServiceAction> {
		throw new Error('Method not implemented.');
	}

	public async getData({ url }: ServiceGetDataOptions): Promise<ModemServiceMainData> {
		if (!ENABLED) {
			error(400, {
				message: `Modem is disabled`,
				key: 'modem.disabled'
			});
		}

		let device: Device | null = null;

		const forceUpdate = url.searchParams.has('force');

		const data = await this.cache.with(
			{
				key: this.config.devicePath,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async (prev) => {
				device = new Device({
					devicePath: this.config.devicePath,
					baudRate: this.config.baudRate,
					pauseMs: this.config.pauseTime,
					waitMs: this.config.waitTime,
					timeoutMs: this.config.cmdTimeout
				});

				if (!(await device.checkAvailable())) {
					error(500, {
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
						tz: this.getTimezone(data.lat, data.lng)
					};
				}

				let prevGeo = prev?.geo ?? null;
				let prevTower = prev?.tower ?? null;
				let geo: ModemLocation | null = null;
				if (data.mcc && data.mnc && data.lac && data.cid) {
					const tower = `${data.mcc}-${data.mnc}-${data.lac}-${data.cid}`;

					if (tower != prevTower) {
						try {
							const resp = await fetch(UNWIRED_URL, {
								method: 'POST',
								body: JSON.stringify({
									token: this.config.unwiredToken,
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
							this.logger.debug('Unwired geo response:', JSON.stringify(unwiredData));

							if (unwiredData.status === 'ok') {
								geo = {
									lat: unwiredData.lat,
									lng: unwiredData.lon,
									tz: this.getTimezone(unwiredData.lat, unwiredData.lon)
								};
							}
						} catch (err) {
							this.logger.error('Unwired error', err);
						}

						if (geo === null) {
							try {
								const { data: googleData } = await this.client.geolocate({
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
										key: this.config.googleKey
									}
								});
								this.logger.debug('Google geo response:', JSON.stringify(googleData));

								if ('location' in googleData) {
									geo = {
										lat: googleData.location.lat,
										lng: googleData.location.lng,
										tz: this.getTimezone(googleData.location.lat, googleData.location.lng)
									};
								}
							} catch (err) {
								this.logger.error('Google geo error', err);
							}
						}

						prevTower = tower;
						prevGeo = JSON.parse(JSON.stringify(geo));
					} else {
						geo = JSON.parse(JSON.stringify(prevGeo));
						this.logger.debug('Using cached geo info', JSON.stringify(geo));
					}
				}

				return {
					ts: new Date(),
					tower: prevTower,
					geo: prevGeo,
					info: {
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
					}
				};
			},
			async () => {
				await device?.close();
			}
		);

		return {
			ts: data.ts,
			type: 'data',
			info: data.info
		};
	}

	private getTimezone(lat: number, lng: number) {
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
}
