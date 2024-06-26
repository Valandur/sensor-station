import { parseISO } from 'date-fns';
import { Parser } from 'xml2js';
import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import type { ServiceActionFailure } from '$lib/models/service';
import { wrap } from '$lib/counter';
import {
	SBB_ALERTS_SERVICE_TYPE,
	SBB_ALERTS_SERVICE_ACTIONS,
	type SbbAlert,
	type SbbAlertsServiceAction,
	type SbbAlertsServiceConfig,
	type SbbAlertsServiceMainData,
	type SituationElement,
	type SbbAlertsServiceConfigData,
	type Text
} from '$lib/models/sbb-alerts';

import { Cache } from '../Cache';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

interface CacheData {
	ts: Date;
	alerts: SbbAlert[];
}

const ENABLED = env.SBB_ALERTS_ENABLED === '1';
const STATUS_URL = 'https://api.opentransportdata.swiss/siri-sx';

export class SbbAlertsService extends BaseService<SbbAlertsServiceAction, SbbAlertsServiceConfig> {
	public override readonly type = SBB_ALERTS_SERVICE_TYPE;
	public static readonly actions = SBB_ALERTS_SERVICE_ACTIONS;

	protected readonly cache: Cache<CacheData> = new Cache(this.logger);
	protected lastPage: number = 0;

	protected getDefaultConfig(): SbbAlertsServiceConfig {
		return {
			apiKey: '',
			words: []
		};
	}

	protected getActions(): ServiceActions<SbbAlertsServiceAction> {
		return {
			config: {
				get: this.getConfig.bind(this),
				set: this.setConfig.bind(this)
			},
			main: {
				get: this.getData.bind(this)
			}
		};
	}

	public async getConfig(_: ServiceGetDataOptions): Promise<SbbAlertsServiceConfigData> {
		if (!ENABLED) {
			error(400, `SBB alerts is disabled`);
		}

		return {
			ts: new Date(),
			type: 'config',
			config: this.config
		};
	}

	public async setConfig({ form }: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const apiKey = form.get('apiKey');
		if (typeof apiKey !== 'string') {
			return fail(400, { message: 'Invalid api key' });
		}

		const wordsStr = form.get('words');
		if (typeof wordsStr !== 'string') {
			return fail(400, { message: 'Invalid words' });
		}
		const words = wordsStr.split(/[\n\r,]/gi).filter((w) => !!w);

		this.config.apiKey = apiKey;
		this.config.words = words;
	}

	public async getData({
		url,
		embedded
	}: ServiceGetDataOptions): Promise<SbbAlertsServiceMainData | null> {
		if (!ENABLED) {
			error(400, `SBB alerts is disabled`);
		}

		if (!this.config.apiKey || !this.config.words) {
			error(400, 'Invalid SBB alerts config');
		}

		const forceUpdate = url.searchParams.has('force');

		const data = await this.cache.with(
			{
				key: this.config.words.join(','),
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				const parser = new Parser({ async: true });

				const res = await fetch(STATUS_URL, {
					headers: { Authorization: `Bearer ${this.config.apiKey}` }
				});
				const resEvents = await parser.parseStringPromise(await res.text());
				const sits: SituationElement[] =
					resEvents.Siri.ServiceDelivery[0].SituationExchangeDelivery[0].Situations[0]
						.PtSituationElement;

				const alerts: SbbAlert[] = [];
				for (const sit of sits) {
					const sitStr = JSON.stringify(sit);
					if (sit.Planned?.[0] === 'true' || !this.config.words.some((w) => sitStr.includes(w))) {
						continue;
					}

					const actions = sit.PublishingActions[0].PublishingAction[0];
					const pubs = actions.PassengerInformationAction[0].TextualContent;
					const pub = pubs.find((c) => c.TextualContentSize[0] === 'S');
					if (!pub) {
						continue;
					}

					alerts.push({
						start: parseISO(sit.ValidityPeriod[0].StartTime[0]),
						end: parseISO(sit.ValidityPeriod[0].EndTime[0]),
						summary: this.getTextDE(pub.SummaryContent[0].SummaryText),
						reason: this.getTextDE(pub.ReasonContent?.[0].ReasonText),
						description: this.getTextDE(pub.DescriptionContent?.[0].DescriptionText),
						consequence: this.getTextDE(pub.ConsequenceContent?.[0].ConsequenceText),
						duration: this.getTextDE(pub.DurationContent?.[0].DurationText),
						recommendation: this.getTextDE(pub.RecommendationContent?.[0].RecommendationText)
					});
				}

				return {
					ts: new Date(),
					alerts
				};
			}
		);

		const pageStr = url.searchParams.get('page');
		let page = Number(pageStr);
		if (pageStr === null && embedded) {
			page = this.lastPage + 1;
		} else if (!isFinite(page)) {
			page = 0;
		}
		this.lastPage = page;

		const [[alert], prevPage, nextPage] = wrap(data.alerts.length, page, 1, data.alerts);

		return {
			ts: data.ts,
			type: 'data',
			prevPage,
			nextPage,
			alert
		};
	}

	private getTextDE(texts: Text[]): string;
	private getTextDE(texts: Text[] | undefined): string | undefined;
	private getTextDE(texts: Text[] | undefined): string | undefined {
		return texts?.find((s) => s['$']['xml:lang'] === 'DE')?.['_'];
	}
}
