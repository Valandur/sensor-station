import { gql } from '@urql/svelte';

export interface NewsItem {
	id: string;
	ts: string;
	title: string;
	content: string;
	img: string;
}

export interface NewsItems {
	news: {
		items: NewsItem[] | null;
	};
}
export const NEWS_ITEMS = gql`
	fragment NewsItems on Query {
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
