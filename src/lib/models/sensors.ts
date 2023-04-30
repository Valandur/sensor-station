import { gql } from '@urql/svelte';

export interface SensorRecording {
	ts: string;
	temp: number;
	rh: number;
}

export interface SensorsNewest {
	sensors: {
		newest: SensorRecording | null;
	};
}
export const SENSORS_NEWEST = gql`
	fragment SensorsNewest on Query {
		sensors {
			newest {
				ts
				temp
				rh
			}
		}
	}
`;

export interface SensorsRecordings {
	sensors: {
		recordings: SensorRecording[] | null;
	};
}
export const SENSORS_RECORDINGS = gql`
	fragment SensorsRecordings on Query {
		sensors {
			recordings {
				ts
				temp
				rh
			}
		}
	}
`;
