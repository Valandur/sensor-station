import { error, fail } from '@sveltejs/kit';

import { clamp } from '$lib/counter';
import type { WidgetActionFailure } from '$lib/models/widget';
import {
	EPIC_GAMES_SERVICE_TYPE,
	EPIC_GAMES_WIDGET_ACTIONS,
	type EpicGamesWidgetConfig,
	type EpicGamesWidgetData,
	type EpicGamesWidgetAction
} from '$lib/models/epic-games';

import { BaseWidget, type WidgetGetDataOptions, type WidgetSetDataOpations } from '../BaseWidget';
import serviceManager from '../services';
import type { EpicGamesService } from './service';

export class EpicGamesWidget extends BaseWidget<
	EpicGamesWidgetAction,
	EpicGamesWidgetConfig,
	EpicGamesWidgetData
> {
	public static readonly actions = EPIC_GAMES_WIDGET_ACTIONS;

	protected generateDefaultConfig(): EpicGamesWidgetConfig {
		return {
			itemsPerPage: 2,
			service: serviceManager.getInstances(EPIC_GAMES_SERVICE_TYPE)[0]?.name ?? ''
		};
	}

	public async getData(
		action: EpicGamesWidgetAction,
		options: WidgetGetDataOptions
	): Promise<EpicGamesWidgetData> {
		if (action === 'config') {
			return {
				ts: new Date(),
				name: this.name,
				type: this.type,
				action,
				config: this.config,
				services: serviceManager.getInstances(EPIC_GAMES_SERVICE_TYPE)
			};
		}

		const service = serviceManager.getByName<EpicGamesService>(this.config.service);

		const data = await service.getData('', options);
		if (!data || data.action !== '') {
			error(400, { key: 'epicGames.noData', message: 'No epic games data available' });
		}

		let page = Number(options.url.searchParams.get('page'));
		if (!isFinite(page)) {
			page = 0;
		}
		const [games, prevPage, nextPage] = clamp(
			data.games.length,
			page,
			this.config.itemsPerPage,
			data.games
		);
		return {
			ts: new Date(),
			name: this.name,
			type: this.type,
			action,
			games
		};
	}

	public async setData(
		action: EpicGamesWidgetAction,
		{ form }: WidgetSetDataOpations
	): Promise<void | WidgetActionFailure> {
		if (action !== 'config') {
			error(400, { key: 'epicGames.action.invalid', message: 'Invalid epic games action' });
		}

		const service = form.get('service');
		if (typeof service !== 'string') {
			return fail(400, {
				key: 'calendar.service.invalid',
				message: 'Invalid calendar widget service'
			});
		}

		// Try to get the service to validate it exists
		serviceManager.getByName(service);

		const itemsPerPage = Number(form.get('itemsPerPage'));
		if (!isFinite(itemsPerPage)) {
			return fail(400, {
				key: 'calendar.itemsPerPage.invalid',
				message: 'Invalid number of items per page'
			});
		}

		this.config = {
			service,
			itemsPerPage
		};
	}
}
