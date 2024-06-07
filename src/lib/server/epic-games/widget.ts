import { error } from '@sveltejs/kit';

import { clamp } from '$lib/counter';
import {
	EPIC_GAMES_WIDGET_TYPE,
	type EpicGamesWidgetConfig,
	type EpicGamesWidgetInstance,
	type EpicGamesWidgetProps
} from '$lib/models/epic-games';

import { BaseWidget, type WidgetValidateFailure } from '../BaseWidget';
import service from './service';

const ITEMS_PER_PAGE = 2;

class EpicGamesWidget extends BaseWidget<EpicGamesWidgetConfig, EpicGamesWidgetProps> {
	public override readonly type = EPIC_GAMES_WIDGET_TYPE;

	public constructor() {
		super('EPIC_GAMES');
	}

	public async props(
		{ name, config }: EpicGamesWidgetInstance,
		page: number
	): Promise<EpicGamesWidgetProps> {
		if (!config.serviceName) {
			error(400, { key: 'epic_games.widget.config', message: 'Invalid epic games widget config' });
		}

		const data = await service.getByName(config.serviceName);
		const [games, prevPage, nextPage] = clamp(data.games.length, page, ITEMS_PER_PAGE, data.games);
		return {
			name,
			prevPage,
			nextPage,
			games
		};
	}

	public async validate(
		instance: EpicGamesWidgetInstance,
		config: FormData
	): Promise<EpicGamesWidgetConfig | WidgetValidateFailure> {
		const serviceName = config.get('serviceName');
		if (typeof serviceName !== 'string') {
			throw new Error('Invalid service name');
		}
		const serviceInstance = this.services.byName(serviceName, true);
		if (serviceInstance.type !== service.type) {
			throw new Error('Invalid service type');
		}

		return {
			serviceName
		};
	}
}

export default new EpicGamesWidget();
