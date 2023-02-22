export type RawNewsData = {
	date: string;
	title: string;
	description: string;
	img: string;
	link: string;
}[];

export interface NewsItem {
	date: Date;
	title: string;
	description: string;
	img: string;
	link: string;
}
