import { error } from '@sveltejs/kit';
import { networkInterfaces } from 'node:os';
import { env } from '$env/dynamic/private';

import {
	NETWORK_SERVICE_TYPE,
	type NetworkAddress,
	type NetworkInterface,
	type NetworkServiceConfig,
	type NetworkServiceData
} from '$lib/models/network';

import { BaseService } from '../BaseService';

const ENABLED = env.NETWORK_ENABLED === '1';

class NetworkService extends BaseService<NetworkServiceConfig, NetworkServiceData> {
	public override readonly type = NETWORK_SERVICE_TYPE;

	public constructor() {
		super('NETWORK');
	}

	public get(
		config: NetworkServiceConfig,
		forceUpdate?: boolean | undefined
	): Promise<NetworkServiceData> {
		return this.cache.with(
			{
				force: forceUpdate,
				resultCacheTime: config.resultCacheTime,
				errorCacheTime: config.errorCacheTime
			},
			async () => {
				if (!ENABLED) {
					throw error(400, {
						message: `Network is disabled`,
						key: 'network.disabled'
					});
				}

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
					interfaces: interfaces
				};
			}
		);
	}

	public validate(config: FormData): Promise<NetworkServiceConfig> {
		throw new Error('Method not implemented.');
	}
}

export default new NetworkService();
