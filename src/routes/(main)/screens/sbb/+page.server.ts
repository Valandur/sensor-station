import { differenceInSeconds, parseISO } from 'date-fns';
import { env } from '$env/dynamic/private';
import { Parser } from 'xml2js';
import { redirect } from '@sveltejs/kit';
import superagent from 'superagent';

import { Counter } from '$lib/counter';
import type { SBBAlert } from '$lib/models/SBBAlert';

import type { PageServerLoad } from './$types';

const ENABLED = env.SBB_ENABLED === '1';
const CACHE_TIME = Number(env.SBB_CACHE_TIME);
const WORDS = (env.SBB_KEYWORDS || 'ZH,Zürich,Zurich').split(',');
const API_KEY = env.SBB_API_KEY;
const URL = 'https://api.opentransportdata.swiss/siri-sx';

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	let page = Number(url.searchParams.get('page') || '-');

	const alerts = await getAlerts();
	counter.max = alerts.length;

	if (!isFinite(page)) {
		page = counter.increment();
	}

	const alert = alerts[page];
	const dataParent = await parent();

	if (!alert && dataParent.skipScreen) {
		throw redirect(302, dataParent.skipScreen);
	}

	return {
		alert,
		nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
	};
};

let alerts: SBBAlert[] = [];
let cachedAt = new Date(0);

async function getAlerts(): Promise<SBBAlert[]> {
	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		return alerts;
	}

	const { text } = await superagent.get(URL).set('Authorization', `Bearer ${API_KEY}`);

	const parser = new Parser({ async: true });
	const res = await parser.parseStringPromise(text);
	const sits: SituationElement[] =
		res.Siri.ServiceDelivery[0].SituationExchangeDelivery[0].Situations[0].PtSituationElement;

	const newAlerts: SBBAlert[] = [];
	for (const sit of sits) {
		if (!alertIsRelevant(JSON.stringify(sit))) {
			continue;
		}

		const actions = sit.PublishingActions[0].PublishingAction[0];
		const pubs = actions.PassengerInformationAction[0].TextualContent;
		const pub = pubs.find((c) => c.TextualContentSize[0] === 'S');
		if (!pub) {
			continue;
		}

		newAlerts.push({
			start: parseISO(sit.ValidityPeriod[0].StartTime[0]),
			end: parseISO(sit.ValidityPeriod[0].EndTime[0]),
			planned: sit.Planned?.[0] === 'true',
			summary: getTextDE(pub.SummaryContent[0].SummaryText),
			reason: getTextDE(pub.ReasonContent?.[0].ReasonText),
			description: getTextDE(pub.DescriptionContent?.[0].DescriptionText),
			consequence: getTextDE(pub.ConsequenceContent?.[0].ConsequenceText),
			duration: getTextDE(pub.DurationContent?.[0].DurationText),
			recommendation: getTextDE(pub.RecommendationContent?.[0].RecommendationText)
		});
	}

	alerts = newAlerts.filter((a) => !a.planned);
	cachedAt = new Date();

	return alerts;
}

function alertIsRelevant(text: string) {
	return WORDS.some((w) => text.includes(w));
}

function getTextDE(texts: Text[]): string;
function getTextDE(texts: Text[] | undefined): string | undefined;
function getTextDE(texts: Text[] | undefined): string | undefined {
	return texts?.find((s) => s['$']['xml:lang'] === 'DE')?.['_'];
}

interface SituationElement {
	ValidityPeriod: {
		StartTime: string[];
		EndTime: string[];
	}[];
	Planned?: string[];
	PublishingActions: {
		PublishingAction: {
			PassengerInformationAction: {
				TextualContent: {
					TextualContentSize: string[];
					SummaryContent: {
						SummaryText: Text[];
					}[];
					ReasonContent?: {
						ReasonText: Text[];
					}[];
					DescriptionContent?: {
						DescriptionText: Text[];
					}[];
					ConsequenceContent?: {
						ConsequenceText: Text[];
					}[];
					DurationContent?: {
						DurationText: Text[];
					}[];
					RecommendationContent?: {
						RecommendationText: Text[];
					}[];
				}[];
			}[];
		}[];
	}[];
}

interface Text {
	$: {
		'xml:lang': string;
	};
	_: string;
}
