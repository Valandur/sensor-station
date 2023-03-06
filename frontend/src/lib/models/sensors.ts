import { gql } from '@urql/svelte';

export interface Sensors {
	newest: SensorRecording;
	recordings: SensorRecording[];
}

export interface SensorRecording {
	ts: string;
	temp: number;
	rh: number;
}

export interface GetNewestData {
	sensors: Omit<Sensors, 'recordings'>;
}
export const GET_NEWEST = gql`
	query GetNewest {
		sensors {
			newest {
				ts
				temp
				rh
			}
		}
	}
`;

export interface GetRecordingsData {
	sensors: Omit<Sensors, 'newest'>;
}
export const GET_RECORDINGS = gql`
	query GetRecordings {
		sensors {
			recordings {
				ts
				temp
				rh
			}
		}
	}
`;
