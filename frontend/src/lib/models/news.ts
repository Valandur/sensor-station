import { gql } from '@urql/svelte';

export interface News {
	items: NewsItem[] | null;
}

export interface NewsItem {
	id: string;
	ts: string;
	title: string;
	content: string;
	img: string;
}

export interface GetNewsData {
	news: News;
}
export const GET_NEWS = gql`
	query GetNews($feed: String!) {
		news {
			items(feed: $feed) {
				id
				ts
				title
				content
				img
			}
		}
	}
`;
