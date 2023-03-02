import { gql } from '@urql/svelte';

export interface NewsItem {
	date: string;
	title: string;
	description: string;
	img: string;
	link: string;
}

export interface GetNewsData {
	news: NewsItem[];
}
export const GET_NEWS = gql`
	query GetNews($feed: String!) {
		news(feed: $feed) {
			ts
			title
			link
			origLink
			description
			img
		}
	}
`;
