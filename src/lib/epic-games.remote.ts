import { form, query } from '$app/server';
import * as v from 'valibot';

import manager from './server/manager';
import { EpicGamesService } from './server/epic-games';

export const getGames = query(
	v.object({
		srv: v.string(),
		page: v.optional(v.nullable(v.number()))
	}),
	({ srv, page }) => {
		return manager.getByName<EpicGamesService>(srv).getGames({ page });
	}
);

export const getConfig = query(v.string(), (srv) => {
	return manager.getByName<EpicGamesService>(srv).getConfig();
});

export const configForm = form(
	v.object({
		srv: v.string(),
		itemsPerPage: v.number()
	}),
	async ({ srv, itemsPerPage }) => {
		await manager.getByName<EpicGamesService>(srv).setConfig({ itemsPerPage });
		await manager.save();
		void getConfig(srv).refresh();
	}
);
