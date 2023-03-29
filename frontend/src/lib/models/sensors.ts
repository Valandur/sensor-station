import { gql } from '@urql/svelte';

export interface Sensors {
	newest: SensorRecording | null;
	recordings: SensorRecording[] | null;
}

export interface SensorRecording {
	ts: string;
	temp: number;
	rh: number;
}

export interface GetNewestData {
	sensors: Pick<Sensors, 'newest'>;
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
	sensors: Pick<Sensors, 'recordings'>;
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
