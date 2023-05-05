import { differenceInSeconds } from 'date-fns';
import { error } from '@sveltejs/kit';
import { networkInterfaces } from 'node:os';

import { env } from '$env/dynamic/private';

import { Logger } from '$lib/logger';
import type { NetworkInterface, NetworkInterfaceAddress } from '$lib/models/NetworkInterface';

export const ENABLED = env.NETWORK_ENABLED === '1';
const CACHE_TIME = Number(env.NETWORK_CACHE_TIME);

const logger = new Logger('NETWORK');

let status: NetworkStatus | null = null;
let cachedAt = new Date(0);

export async function getStatus(): Promise<NetworkStatus> {
	if (!ENABLED) {
		throw error(400, { message: 'Network module is disabled', key: 'network.disabled' });
	}

	if (status && differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		logger.debug('Using cached interfaces');
		return status;
	}

	logger.debug('Updating...');
	const startTime = process.hrtime.bigint();

	try {
		const newInterfaces: NetworkInterface[] = [];

		const networkInterfacesMap = networkInterfaces();
		for (const [name, infos] of Object.entries(networkInterfacesMap)) {
			if (!infos || !infos.length) {
				continue;
			}

			const addresses: NetworkInterfaceAddress[] = infos
				.filter((info) => !info.internal)
				.map(({ family, address, mac }) => ({
					family,
					address,
					mac
				}));

			if (addresses.length > 0) {
				newInterfaces.push({ name, addresses });
			}
		}

		status = { ts: new Date(), interfaces: newInterfaces };
		cachedAt = new Date();

		return status;
	} finally {
		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		logger.info('Updated', diffTime, 'ms');
	}
}

interface NetworkStatus {
	ts: Date;
	interfaces: NetworkInterface[];
}
