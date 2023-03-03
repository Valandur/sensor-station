import { gql } from '@urql/svelte';

export interface Uploads {
	items: UploadItem[];
}

export interface UploadItem {
	ts: string;
	title: string;
	img: string;
	ratio: number;
}

export type GetUploadsData = {
	uploads: Uploads;
};

export const GET_UPLOADS = gql`
	query GetUploads {
		uploads {
			items {
				ts
				title
				img
				ratio
			}
		}
	}
`;
