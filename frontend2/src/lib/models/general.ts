import { gql } from '@urql/svelte';

import type { BatteryStatusInfo } from './battery';
import type { ModemStatusInfo } from './modem';
import type { Screen } from './screen';

export type GetData = {
	screens: Screen[];
	battery: BatteryStatusInfo;
	modem: ModemStatusInfo;
};

export const GET_DATA = gql`
	query GetData {
		screens {
			id
			name
			params
		}
		battery {
			isFault
			isButton
			batteryStatus
			powerIn
			powerIn5vIo
			charge
			voltage
			current
		}
		modem {
			isConnected
			time
			tzOffset
			operator
			signal
			lat
			lng
			tzName
			cached
		}
	}
`;
