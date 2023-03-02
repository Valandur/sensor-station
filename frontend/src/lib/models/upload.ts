import { gql } from '@urql/svelte';

export interface UploadItem {
	ts: string;
	title: string;
	img: string;
	ratio: number;
}

export type GetUploadsData = {
	uploads: UploadItem[];
};

export const GET_UPLOADS = gql`
	query GetUploads {
		uploads {
			ts
			title
			img
			ratio
		}
	}
`;
