import { parseISO } from 'date-fns';
import { Parser } from 'xml2js';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import {
	SBB_ALERTS_SERVICE_TYPE,
	type SbbAlert,
	type SbbAlertsServiceConfig,
	type SbbAlertsServiceData,
	type SbbAlertsServiceInstance,
	type SituationElement,
	type Text
} from '$lib/models/sbb-alerts';

import { BaseService } from '../BaseService';

const ENABLED = env.SBB_ALERTS_ENABLED === '1';
const STATUS_URL = 'https://api.opentransportdata.swiss/siri-sx';

class SbbAlertsService extends BaseService<SbbAlertsServiceConfig, SbbAlertsServiceData> {
	public override readonly type = SBB_ALERTS_SERVICE_TYPE;

	public constructor() {
		super('SBB_ALERTS');
	}

	public get(
		{ name, config }: SbbAlertsServiceInstance,
		forceUpdate?: boolean | undefined
	): Promise<SbbAlertsServiceData> {
		return this.cache.with(
			{
				key: config.words.join(','),
				force: forceUpdate,
				resultCacheTime: config.resultCacheTime,
				errorCacheTime: config.errorCacheTime
			},
			async () => {
				if (!ENABLED) {
					error(400, {
						message: `SBB alerts is disabled`,
						key: 'sbb_alerts.disabled'
					});
				}

				const parser = new Parser({ async: true });

				const res = await fetch(STATUS_URL, {
					headers: { Authorization: `Bearer ${config.apiKey}` }
				});
				const resEvents = await parser.parseStringPromise(await res.text());
				const sits: SituationElement[] =
					resEvents.Siri.ServiceDelivery[0].SituationExchangeDelivery[0].Situations[0]
						.PtSituationElement;

				const alerts: SbbAlert[] = [];
				for (const sit of sits) {
					const sitStr = JSON.stringify(sit);
					if (sit.Planned?.[0] === 'true' || !config.words.some((w) => sitStr.includes(w))) {
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
					name,
					alerts
				};
			}
		);
	}

	public async validate(
		instance: SbbAlertsServiceInstance,
		config: FormData
	): Promise<SbbAlertsServiceConfig> {
		const apiKey = config.get('apiKey');
		if (typeof apiKey !== 'string') {
			throw new Error('Invalid api key');
		}

		const wordsStr = config.get('words');
		if (typeof wordsStr !== 'string') {
			throw new Error('Invalid words');
		}

		const words = wordsStr.split(/[\n\r,]/gi).filter((w) => !!w);

		return {
			apiKey,
			words
		};
	}

	private getTextDE(texts: Text[]): string;
	private getTextDE(texts: Text[] | undefined): string | undefined;
	private getTextDE(texts: Text[] | undefined): string | undefined {
		return texts?.find((s) => s['$']['xml:lang'] === 'DE')?.['_'];
	}
}

export default new SbbAlertsService();
