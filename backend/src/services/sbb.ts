import axios from 'axios';
import { Parser } from 'xml2js';

import { Service } from './service';

const KEY = process.env['SBB_API_KEY'] || '';
const URL = 'https://api.opentransportdata.swiss/siri-sx';
const WORDS = ['ZH', 'Zürich', 'Zurich', 'Schwerzenbach', 'Hinwil'];

export interface Alert {
	start: string;
	end: string;
	planned: boolean;
	summary: string;
	reason: string;
	description: string;
	consequence: string;
	duration: string;
	recommendation: string;
	affects: any;
}

export class SBB extends Service {
	private timer: NodeJS.Timer | null = null;
	private parser = new Parser({ async: true });

	public updatedAt: Date | null = null;
	public alerts: Alert[] | null = null;

	protected override async doInit(): Promise<void> {}

	protected override async doStart(): Promise<void> {
		await this.update();

		if (process.env['SBB_UPDATE_INTERVAL']) {
			const interval = 1000 * Number(process.env['SBB_UPDATE_INTERVAL']);
			this.timer = setInterval(this.update, interval);
			this.log('UPDATE STARTED', interval);
		} else {
			this.log('UPDATE DISABLED');
		}
	}

	protected override async doStop(): Promise<void> {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}

		this.updatedAt = null;
		this.alerts = null;
	}

	protected override async doDispose(): Promise<void> {}

	private update = async () => {
		try {
			const { data } = await axios.request({
				method: 'GET',
				url: URL,
				headers: {
					Authorization: `Bearer ${KEY}`
				}
			});

			const res = await this.parser.parseStringPromise(data);
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
						description: pub.DescriptionContent?.[0].DescriptionText.find((s: any) => s['$']['xml:lang'] === 'DE')?.[
							'_'
						],
						consequence: pub.ConsequenceContent?.[0].ConsequenceText.find((s: any) => s['$']['xml:lang'] === 'DE')?.[
							'_'
						],
						duration: pub.DurationContent?.[0].DurationText.find((s: any) => s['$']['xml:lang'] === 'DE')?.['_'],
						recommendation: pub.RecommendationContent?.[0].RecommendationText.find(
							(s: any) => s['$']['xml:lang'] === 'DE'
						)?.['_'],
						affects: i.Affects
					};
				});

			this.alerts = alerts.filter((a) => !a.planned);
		} catch (err) {
			this.error(err);
		}
	};

	private alertIsRelevant(text: string) {
		return WORDS.some((w) => text.includes(w));
	}
}
