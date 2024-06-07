import { error } from '@sveltejs/kit';

import { CounterType, fit, slice } from '$lib/counter';
import {
	EPIC_GAMES_WIDGET_TYPE,
	type EpicGamesWidgetConfig,
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

	public async props(config: EpicGamesWidgetConfig, page: number): Promise<EpicGamesWidgetProps> {
		if (!config.serviceName) {
			error(400, { key: 'epic_games.widget.config', message: 'Invalid epic games widget config' });
		}

		const data = await service.getByName(config.serviceName);
		const games = slice(CounterType.Clamp, data.games.length, page, ITEMS_PER_PAGE, data.games);
		const prevPage = page > 0 ? page - 1 : 0;
		const nextPage = fit(CounterType.Clamp, data.games.length, page + 1, ITEMS_PER_PAGE);
		return {
			prevPage,
			nextPage,
			games
		};
	}

	public async validate(config: FormData): Promise<EpicGamesWidgetConfig | WidgetValidateFailure> {
		const serviceName = config.get('serviceName');
		if (typeof serviceName !== 'string') {
			throw new Error('Invalid service name');
		}
		const instance = this.services.byName(serviceName, true);
		if (instance.type !== service.type) {
			throw new Error('Invalid service type');
		}

		return {
			serviceName
		};
	}
}

export default new EpicGamesWidget();
