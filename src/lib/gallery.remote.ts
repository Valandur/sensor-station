import { query } from '$app/server';
import * as v from 'valibot';

import { GalleryService } from './server/gallery';
import manager from './server/manager';

export const getImage = query(
	v.object({
		srv: v.string(),
		page: v.optional(v.nullable(v.number()))
	}),
	async ({ srv, page }) => {
		return manager.getByName<GalleryService>(srv).getImage({ page });
	}
);
