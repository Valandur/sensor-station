import { command, form, query } from '$app/server';
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

export const getConfig = query(v.string(), (srv) => {
	return manager.getByName<GalleryService>(srv).getConfig();
});

export const addImageForm = form(
	v.object({
		srv: v.string(),
		date: v.pipe(v.string(), v.toDate()),
		title: v.string(),
		image: v.file()
	}),
	async ({ srv, date, title, image }) => {
		await manager.getByName<GalleryService>(srv).addImage({ date, title, image });
		await manager.save();
		void getConfig(srv).refresh();
	}
);

export const saveImageForm = form(
	v.object({
		srv: v.string(),
		index: v.pipe(v.string(), v.toNumber()),
		date: v.pipe(v.string(), v.toDate()),
		title: v.string()
	}),
	async ({ srv, index, date, title }) => {
		await manager.getByName<GalleryService>(srv).editImage(index, { date, title });
		await manager.save();
		void getConfig(srv).refresh();
	}
);

export const moveImage = command(
	v.object({
		srv: v.string(),
		index: v.number(),
		dir: v.picklist(['up', 'down'])
	}),
	async ({ srv, index, dir }) => {
		await manager.getByName<GalleryService>(srv).moveImage(index, dir);
		await manager.save();
		void getConfig(srv).refresh();
	}
);

export const removeImage = command(
	v.object({
		srv: v.string(),
		index: v.number()
	}),
	async ({ srv, index }) => {
		await manager.getByName<GalleryService>(srv).removeImage(index);
		await manager.save();
		void getConfig(srv).refresh();
	}
);
