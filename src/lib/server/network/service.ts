import { error, fail } from '@sveltejs/kit';
import { networkInterfaces } from 'node:os';
import { resolve } from 'node:dns/promises';
import { env } from '$env/dynamic/private';
import { exec } from 'node:child_process';
import wifi from 'node-wifi';

import type { ServiceActionFailure } from '$lib/models/service';
import {
	NETWORK_SERVICE_TYPE,
	NETWORK_SERVICE_ACTIONS,
	type NetworkAddress,
	type NetworkInterface,
	type NetworkServiceAction,
	type NetworkServiceConfig,
	type NetworkServiceMainData,
	type NetworkServiceConfigData
} from '$lib/models/network';

import { Cache } from '../Cache';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

interface CacheData {
	ts: Date;
	connected: boolean;
	interfaces: NetworkInterface[];
}

const ENABLED = env.NETWORK_ENABLED === '1';

export class NetworkService extends BaseService<NetworkServiceAction, NetworkServiceConfig> {
	public override readonly type = NETWORK_SERVICE_TYPE;
	public static readonly actions = NETWORK_SERVICE_ACTIONS;

	protected readonly cache: Cache<CacheData> = new Cache(this.logger);

	public override async init(): Promise<void> {
		wifi.init({
			debug: true,
			iface: null
		});
	}

	protected getDefaultConfig(): NetworkServiceConfig {
		return {};
	}

	protected getActions(): ServiceActions<NetworkServiceAction> {
		return {
			config: {
				get: this.getConfig.bind(this),
				set: this.setConfig.bind(this)
			},
			main: {
				get: this.getData.bind(this)
			},
			icon: {
				get: this.getData.bind(this)
			}
		};
	}

	public async getConfig({ url }: ServiceGetDataOptions): Promise<NetworkServiceConfigData> {
		if (!ENABLED) {
			error(400, `Network is disabled`);
		}

		const connections = await wifi.getCurrentConnections();

		return {
			ts: new Date(),
			type: 'config',
			connections
		};
	}

	public async setConfig({
		form
	}: ServiceSetDataOptions): Promise<void | Record<string, unknown> | ServiceActionFailure> {
		const formAction = form.get('action');
		switch (formAction) {
			case 'scan': {
				await new Promise<void>((resolve, reject) =>
					exec('sudo nmcli device wifi rescan', (err) => (err ? reject(err) : resolve()))
				).catch(() => null);
				const connections = await wifi.getCurrentConnections();
				const networks = await wifi.scan();
				return {
					networks: networks
						.filter((n) => !connections.some((c) => c.ssid === n.ssid))
						.sort((a, b) => a.ssid.localeCompare(b.ssid))
				};
			}

			case 'connect': {
				const ssid = form.get('ssid');
				if (typeof ssid !== 'string') {
					return fail(400, { message: 'Invalid SSID' });
				}

				const password = form.get('password');
				if (typeof password !== 'string') {
					return fail(400, { message: 'Invalid password' });
				}

				await wifi.connect({ ssid, password });
				break;
			}

			case 'disconnect': {
				const ssid = form.get('ssid');
				if (typeof ssid !== 'string') {
					return fail(400, { message: 'Invalid SSID' });
				}

				await wifi.deleteConnection({ ssid });
				break;
			}
		}
	}

	public async getData({ url }: ServiceGetDataOptions): Promise<NetworkServiceMainData> {
		if (!ENABLED) {
			error(400, `Network is disabled`);
		}

		const forceUpdate = url.searchParams.has('force');

		const data = await this.cache.with(
			{
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				const interfaces: NetworkInterface[] = [];

				const networkInterfacesMap = networkInterfaces();
				for (const [name, infos] of Object.entries(networkInterfacesMap)) {
					if (!infos || !infos.length) {
						continue;
					}

					const addresses: NetworkAddress[] = infos
						.filter((info) => !info.internal)
						.map(({ family, address, mac }) => ({
							family,
							address,
							mac
						}));

					if (addresses.length > 0) {
						interfaces.push({ name, addresses });
					}
				}

				const res = await resolve('google.com').catch(() => null);
				const connected = res !== null;

				return {
					ts: new Date(),
					connected,
					interfaces
				};
			}
		);

		return {
			ts: data.ts,
			type: 'data',
			connected: data.connected,
			interfaces: data.interfaces
		};
	}
}
