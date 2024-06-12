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
	type NetworkServiceData,
	type NetworkServiceInstance
} from '$lib/models/network';

import { BaseService } from '../BaseService';

const ENABLED = env.NETWORK_ENABLED === '1';

class NetworkService extends BaseService<
	NetworkServiceConfig,
	NetworkServiceData,
	NetworkServiceAction
> {
	public override readonly type = NETWORK_SERVICE_TYPE;
	public override readonly actions = NETWORK_SERVICE_ACTIONS;

	public constructor() {
		super('NETWORK');
	}

	public getData(
		instance: NetworkServiceInstance,
		action: NetworkServiceAction,
		forceRefresh: boolean = false
	): Promise<NetworkServiceData> {
		return this.cache.with(
			{
				force: forceRefresh,
				resultCacheTime: instance.config.resultCacheTime,
				errorCacheTime: instance.config.errorCacheTime
			},
			async () => {
				if (!ENABLED) {
					error(400, {
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
					instance,
					interfaces
				};
			}
		);
	}

	public setData(
		instance: NetworkServiceInstance,
		action: NetworkServiceAction,
		newData: FormData
	): Promise<void> {
		throw new Error('Not supported');
	}
}

export default new NetworkService();
