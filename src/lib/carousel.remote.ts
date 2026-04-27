import { command, form, query } from '$app/server';
import * as v from 'valibot';

import { CarouselService } from './server/carousel';
import manager from './server/manager';

export const getScreen = query(
	v.object({
		srv: v.string(),
		index: v.number()
	}),
	async ({ srv, index }) => {
		return manager.getByName<CarouselService>(srv).getScreen({ index });
	}
);

export const getConfig = query(v.string(), (srv) => {
	return manager.getByName<CarouselService>(srv).getConfig();
});

export const moveScreen = command(
	v.object({
		srv: v.string(),
		index: v.number(),
		dir: v.picklist(['up', 'down'])
	}),
	async ({ srv, index, dir }) => {
		await manager.getByName<CarouselService>(srv).moveScreen({ index, dir });
		await manager.save();
		void getConfig(srv).refresh();
	}
);

export const deleteScreen = command(
	v.object({
		srv: v.string(),
		index: v.number()
	}),
	async ({ srv, index }) => {
		await manager.getByName<CarouselService>(srv).deleteScreen({ index });
		await manager.save();
		void getConfig(srv).refresh();
	}
);

export const newScreenForm = form(
	v.object({
		srv: v.string(),
		service: v.string(),
		action: v.string()
	}),
	async ({ srv, service, action }) => {
		await manager.getByName<CarouselService>(srv).addScreen({ service, action });
		await manager.save();
		void getConfig(srv).refresh();
	}
);

export const holidaysForm = form(
	v.object({
		srv: v.string(),
		country: v.pipe(v.string(), v.length(2)),
		state: v.pipe(v.string(), v.length(2))
	}),
	async ({ srv, country, state }) => {
		await manager.getByName<CarouselService>(srv).setHolidays({ country, state });
		await manager.save();
		void getConfig(srv).refresh();
	}
);
