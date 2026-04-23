import { form, query } from '$app/server';
import * as v from 'valibot';

import manager from './server/manager';
import type { SrfService } from './server/srf';

export const getNews = query(
	v.object({
		srv: v.string(),
		page: v.optional(v.nullable(v.number()))
	}),
	async ({ srv, page }) => {
		return manager.getByName<SrfService>(srv).getNews({ page });
	}
);

export const getDetails = query(
	v.object({
		srv: v.string(),
		articleId: v.string()
	}),
	async ({ srv, articleId }) => {
		return manager.getByName<SrfService>(srv).getDetails({ articleId });
	}
);

export const getConfig = query(v.string(), (srv) => {
	return manager.getByName<SrfService>(srv).getConfig();
});

export const configForm = form(
	v.object({
		srv: v.string(),
		feedId: v.string(),
		itemsPerPage: v.number(),
		simpleDetails: v.optional(v.boolean(), false)
	}),
	async ({ srv, feedId, itemsPerPage, simpleDetails }) => {
		await manager.getByName<SrfService>(srv).setConfig({ feedId, itemsPerPage, simpleDetails });
		await manager.save();
		void getConfig(srv).refresh();
	}
);
