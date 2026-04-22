import type { ServiceConfig } from './service';

// ---------
// Service
// ---------

export const SRF_SERVICE_TYPE = 'srf';
export const SRF_SERVICE_ACTIONS = ['main', 'details', 'config'] as const;

export type SrfServiceAction = (typeof SRF_SERVICE_ACTIONS)[number];

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
