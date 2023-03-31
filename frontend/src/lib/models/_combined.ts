import { gql } from '@urql/svelte';

import type { GetBatteryData } from './battery';
import type { GetModemData } from './modem';
import type { GetScreensData } from './screen';
import type { GetNewestData } from './sensors';
import type { GetWeatherData } from './weather';

export type GetGeneralData = GetScreensData & GetBatteryData & GetModemData;
export const GET_GENERAL_DATA = gql`
	query GetData {
		screens {
			name
			params
		}
		battery {
			status {
				isFault
				isButton
				status
				charge
				temperature
				powerIn {
					state
					voltage
					current
				}
				powerIn5vIo {
					state
					voltage
					current
				}
				fault {
					buttonPowerOff
					forcedPowerOff
					forcedSysPowerOff
					watchdogReset
					batteryProfileInvalid
					chargingTemperatureFault
				}
			}
		}
		modem {
			status {
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
	}
`;

export type GetWeatherAndSensorsData = GetWeatherData & GetNewestData;
export const GET_WEATHER_AND_SENSORS = gql`
	query GetData {
		weather {
			hourly {
				ts
				img
				feelsLike
			}
			daily {
				ts
				img
				feelsLike
			}
			alerts {
				sender
				event
				start
				end
				content
				tags
			}
		}
		sensors {
			newest {
				ts
				temp
				rh
			}
		}
	}
`;

export const RESTART = gql`
	mutation Restart {
		restart
	}
`;
