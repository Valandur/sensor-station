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

export interface GetUploadsData {
	uploads: Uploads;
}
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

export const SAVE_UPLOAD = gql`
	mutation SaveUpload($img: String!, $ts: String!, $title: String!) {
		saveUpload(img: $img, ts: $ts, title: $title) {
			ts
			title
			img
			ratio
		}
	}
`;

export const DELETE_UPLOAD = gql`
	mutation DeleteUpload($img: String!) {
		deleteUpload(img: $img) {
			ts
			title
			img
			ratio
		}
	}
`;
