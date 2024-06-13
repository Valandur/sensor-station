import { parseISO } from 'date-fns';
import { Parser } from 'xml2js';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import type { ServiceActionFailure } from '$lib/models/service';
import {
	SBB_ALERTS_SERVICE_ACTIONS,
	type SbbAlert,
	type SbbAlertsServiceAction,
	type SbbAlertsServiceConfig,
	type SbbAlertsServiceData,
	type SituationElement,
	type Text
} from '$lib/models/sbb-alerts';

import {
	BaseService,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

const ENABLED = env.SBB_ALERTS_ENABLED === '1';
const STATUS_URL = 'https://api.opentransportdata.swiss/siri-sx';

export class SbbAlertsService extends BaseService<
	SbbAlertsServiceAction,
	SbbAlertsServiceConfig,
	SbbAlertsServiceData
> {
	public static readonly actions = SBB_ALERTS_SERVICE_ACTIONS;

	protected generateDefaultConfig(): SbbAlertsServiceConfig {
		return {
			apiKey: '',
			words: []
		};
	}

	public async getData(
		action: SbbAlertsServiceAction,
		{ url }: ServiceGetDataOptions
	): Promise<SbbAlertsServiceData | null> {
		if (!ENABLED) {
			error(400, {
				message: `SBB alerts is disabled`,
				key: 'sbbAlerts.disabled'
			});
		}

		if (action === 'config') {
			return {
				ts: new Date(),
				name: this.name,
				type: this.type,
				action: 'config',
				config: this.config
			};
		}

		if (!this.config.apiKey || !this.config.words) {
			error(400, {
				key: 'sbbAlerts.config.invalid',
				message: 'Invalid SBB alerts config'
			});
		}

		const forceUpdate = url.searchParams.has('force');

		return this.cache.with(
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
					name: this.name,
					type: this.type,
					action,
					alerts
				};
			}
		);
	}

	public async setData(
		action: SbbAlertsServiceAction,
		{ form }: ServiceSetDataOptions
	): Promise<void | ServiceActionFailure> {
		if (action !== 'config') {
			error(400, { key: 'sbbAlerts.action.invalid', message: 'Invalid SBB alerts action' });
		}

		const apiKey = form.get('apiKey');
		if (typeof apiKey !== 'string') {
			error(400, { key: 'sbbAlerts.apiKey.invalid', message: 'Invalid api key' });
		}

		const wordsStr = form.get('words');
		if (typeof wordsStr !== 'string') {
			error(400, { key: 'sbbAlerts.words.invalid', message: 'Invalid words' });
		}
		const words = wordsStr.split(/[\n\r,]/gi).filter((w) => !!w);

		this.config.apiKey = apiKey;
		this.config.words = words;
	}

	private getTextDE(texts: Text[]): string;
	private getTextDE(texts: Text[] | undefined): string | undefined;
	private getTextDE(texts: Text[] | undefined): string | undefined {
		return texts?.find((s) => s['$']['xml:lang'] === 'DE')?.['_'];
	}
}
