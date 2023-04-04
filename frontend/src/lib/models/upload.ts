import { gql } from '@urql/svelte';

export interface UploadItem {
	ts: string;
	title: string;
	img: string;
	ratio: number;
}

export interface UploadItems {
	uploads: {
		items: UploadItem[] | null;
	};
}
export const UPLOAD_ITEMS = gql`
	fragment UploadItems on Query {
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
