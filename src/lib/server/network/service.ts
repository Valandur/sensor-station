import { error } from '@sveltejs/kit';
import { networkInterfaces } from 'node:os';
import { env } from '$env/dynamic/private';

import {
	NETWORK_SERVICE_TYPE,
	NETWORK_SERVICE_ACTIONS,
	type NetworkAddress,
	type NetworkInterface,
	type NetworkServiceAction,
	type NetworkServiceConfig,
	type NetworkServiceData
} from '$lib/models/network';

import { Cache } from '../Cache';
import { BaseService, type ServiceActions, type ServiceGetDataOptions } from '../BaseService';

interface CacheData {
	ts: Date;
	interfaces: NetworkInterface[];
}

const ENABLED = env.NETWORK_ENABLED === '1';

export class NetworkService extends BaseService<NetworkServiceAction, NetworkServiceConfig> {
	public override readonly type = NETWORK_SERVICE_TYPE;
	public static readonly actions = NETWORK_SERVICE_ACTIONS;

	private readonly cache: Cache<CacheData> = new Cache(this.logger);

	protected getDefaultConfig(): NetworkServiceConfig {
		return {};
	}

	protected getActions(): ServiceActions<NetworkServiceAction> {
		return {
			preview: {
				get: this.getData.bind(this)
			}
		};
	}

	public async getData({ url }: ServiceGetDataOptions): Promise<NetworkServiceData> {
		if (!ENABLED) {
			error(400, {
				message: `Network is disabled`,
				key: 'network.disabled'
			});
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

				return {
					ts: new Date(),
					interfaces
				};
			}
		);

		return {
			ts: data.ts,
			type: 'data',
			interfaces: data.interfaces
		};
	}
}
