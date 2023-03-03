import { gql } from '@urql/svelte';

export interface Sensors {
	newest: SensorRecording;
}

export interface SensorRecording {
	ts: string;
	temp: number;
	rh: number;
}

export interface GetSensorsData {
	sensors: Sensors;
}
export const GET_SENSORS = gql`
	query GetSensors {
		sensors {
			newest {
				ts
				temp
				rh
			}
		}
	}
`;
