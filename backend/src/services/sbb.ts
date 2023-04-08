import superagent from 'superagent';
import { Parser } from 'xml2js';

import { Service } from './service';

const URL = 'https://api.opentransportdata.swiss/siri-sx';
const WORDS = ['ZH', 'Zürich', 'Zurich', 'Schwerzenbach', 'Hinwil'];

export interface Alert {
	start: string;
	end: string;
	planned: boolean;
	summary: string;
	reason: string | null;
	description: string | null;
	consequence: string | null;
	duration: string | null;
	recommendation: string | null;
	affects: any;
}

export class SBB extends Service {
	private readonly apiKey = process.env['SBB_API_KEY'] || '';

	public alerts: Alert[] | null = null;

	protected override async doInit(): Promise<void> {}

	protected override async doStart(): Promise<void> {
		this.alerts = null;
	}

	protected override async doUpdate(): Promise<void> {
		const { text } = await superagent.get(URL).set('Authorization', `Bearer ${this.apiKey}`);

		const parser = new Parser({ async: true });
		const res = await parser.parseStringPromise(text);
		const sits: any[] = res.Siri.ServiceDelivery[0].SituationExchangeDelivery[0].Situations[0].PtSituationElement;
		const alerts: Alert[] = sits
			.filter((i) => this.alertIsRelevant(JSON.stringify(i)))
			.map((i: any) => {
				const pubAct = i.PublishingActions[0].PublishingAction[0];
				const textCont = pubAct.PassengerInformationAction[0].TextualContent;
				const pub = textCont.find((c: any) => c.TextualContentSize[0] === 'S');

				return {
					start: i.ValidityPeriod[0].StartTime[0],
					end: i.ValidityPeriod[0].EndTime[0],
					planned: i.Planned?.[0] === 'true',
					summary: pub.SummaryContent?.[0].SummaryText.find((s: any) => s['$']['xml:lang'] === 'DE')?.['_'],
					reason: pub.ReasonContent?.[0].ReasonText.find((s: any) => s['$']['xml:lang'] === 'DE')?.['_'],
					description: pub.DescriptionContent?.[0].DescriptionText.find((s: any) => s['$']['xml:lang'] === 'DE')?.['_'],
					consequence: pub.ConsequenceContent?.[0].ConsequenceText.find((s: any) => s['$']['xml:lang'] === 'DE')?.['_'],
					duration: pub.DurationContent?.[0].DurationText.find((s: any) => s['$']['xml:lang'] === 'DE')?.['_'],
					recommendation: pub.RecommendationContent?.[0].RecommendationText.find(
						(s: any) => s['$']['xml:lang'] === 'DE'
					)?.['_'],
					affects: i.Affects
				};
			});

		this.alerts = alerts.filter((a) => !a.planned);

		if (this.isDebug && this.alerts.length === 0) {
			this.warn('Updating in DEBUG mode');
			this.alerts = [
				{
					start: '2023-03-27T18:32:00+02:00',
					end: '2023-03-27T19:30:00+02:00',
					planned: false,
					summary: 'Einschränkung Zürich HB SZU - Zürich Selnau',
					reason: 'Grund: Streckenblockierung',
					description: 'Linien S4, S10',
					consequence: 'Es ist mit Verspätungen und Ausfällen zu rechnen',
					duration: 'Dauer: unbestimmt',
					recommendation: null,
					affects: {}
				}
			];
		}
	}

	protected override async doStop(): Promise<void> {
		this.alerts = null;
	}

	protected override async doDispose(): Promise<void> {}

	private alertIsRelevant(text: string) {
		return WORDS.some((w) => text.includes(w));
	}
}
