import {
	MODEM_SERVICE_ACTIONS,
	MODEM_SERVICE_TYPE,
	type ModemServiceAction,
	type ModemServiceConfig
} from '$lib/models/modem';

import { BaseService, type ServiceActions } from '../BaseService';

export class ModemService extends BaseService<ModemServiceAction, ModemServiceConfig> {
	public static readonly actions = MODEM_SERVICE_ACTIONS;
	public override readonly type = MODEM_SERVICE_TYPE;

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

	protected getActions(): ServiceActions<'main' | 'preview' | 'config'> {
		throw new Error('Method not implemented.');
	}
}
