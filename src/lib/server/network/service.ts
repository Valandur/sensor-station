import { error } from '@sveltejs/kit';
import { networkInterfaces } from 'node:os';
import { env } from '$env/dynamic/private';

import {
	NETWORK_SERVICE_ACTIONS,
	type NetworkAddress,
	type NetworkInterface,
	type NetworkServiceAction,
	type NetworkServiceConfig,
	type NetworkServiceData
} from '$lib/models/network';

import {
	BaseService,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

const ENABLED = env.NETWORK_ENABLED === '1';

export class NetworkService extends BaseService<
	NetworkServiceAction,
	NetworkServiceConfig,
	NetworkServiceData
> {
	public static readonly actions = NETWORK_SERVICE_ACTIONS;

	protected generateDefaultConfig(): NetworkServiceConfig {
		return {};
	}

	public getData(
		action: NetworkServiceAction,
		{ url }: ServiceGetDataOptions
	): Promise<NetworkServiceData> {
		if (!ENABLED) {
			error(400, {
				message: `Network is disabled`,
				key: 'network.disabled'
			});
		}

		const forceUpdate = url.searchParams.has('force');

		return this.cache.with(
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
					name: this.name,
					type: this.type,
					action,
					interfaces
				};
			}
		);
	}

	public setData(action: NetworkServiceAction, options: ServiceSetDataOptions): Promise<void> {
		throw new Error('Not supported');
	}
}
