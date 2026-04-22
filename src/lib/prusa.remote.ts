import { form, query } from '$app/server';
import * as v from 'valibot';

import manager from './server/manager';
import { PrusaService } from './server/prusa';

export const getStatus = query(
	v.object({
		srv: v.string(),
		forceUpdate: v.optional(v.boolean())
	}),
	async ({ srv, forceUpdate }) => {
		return manager.getByName<PrusaService>(srv).getStatus({ forceUpdate });
	}
);

export const getConfig = query(v.string(), (srv) => {
	return manager.getByName<PrusaService>(srv).getConfig();
});

export const configForm = form(
	v.object({
		srv: v.string(),
		apiUrl: v.string(),
		apiKey: v.string()
	}),
	async ({ srv, apiUrl, apiKey }) => {
		await manager.getByName<PrusaService>(srv).setConfig({ apiUrl, apiKey });
		await manager.save();
		void getConfig(srv).refresh();
	}
);
