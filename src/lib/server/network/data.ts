import { error } from '@sveltejs/kit';
import { networkInterfaces } from 'node:os';

import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { NetworkAddress } from '$lib/models/NetworkAddress';
import type { NetworkData } from '$lib/models/NetworkData';
import type { NetworkInterface } from '$lib/models/NetworkInterface';

const ENABLED = env.NETWORK_ENABLED === '1';
const CACHE_TIME = Number(env.NETWORK_CACHE_TIME);

const logger = new BaseLogger('NETWORK');
const cache = new BaseCache<NetworkData>(logger, CACHE_TIME);

export async function getData(forceUpdate = false): Promise<NetworkData> {
	if (!ENABLED) {
		throw error(400, {
			message: `Network is disabled`,
			key: 'network.disabled'
		});
	}

	return cache.withDefault(forceUpdate, async () => {
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
	});
}
