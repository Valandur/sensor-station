import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const SRF_SERVICE_TYPE = 'srf';
export const SRF_SERVICE_ACTIONS = ['main', 'details', 'preview', 'config'] as const;

export type SrfServiceAction = (typeof SRF_SERVICE_ACTIONS)[number];

export interface SrfServiceMainData extends ServiceData {
	type: 'data';
	articles: NewsArticle[];
}
export interface SrfServiceConfigData extends ServiceData {
	type: 'config';
	config: SrfServiceConfig;
}
export interface SrfServiceDetailsData extends ServiceData {
	type: 'details';
	simple: boolean;
	head: string;
	body: string;
}
export type SrfServiceData = SrfServiceMainData | SrfServiceConfigData | SrfServiceDetailsData;

export interface SrfServiceConfig extends ServiceConfig {
	feedId: string;
	itemsPerPage: number;
	simpleDetails: boolean;
}

// ---------
// Others
// ---------

export interface NewsArticle {
	id: string;
	ts: Date;
	title: string;
	content: string;
	link: string;
	image: string;
}
