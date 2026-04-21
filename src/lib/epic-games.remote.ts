import { query } from '$app/server';
import * as v from 'valibot';

import manager from './server/manager';
import { EpicGamesService } from './server/epic-games';

export const getGames = query(
	v.object({
		srv: v.string(),
		page: v.number()
	}),
	({ srv, page }) => {
		return manager.getByName<EpicGamesService>(srv).getGames({ page });
	}
);
