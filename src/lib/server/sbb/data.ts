import { differenceInMinutes, parseISO } from 'date-fns';
import { Parser } from 'xml2js';
import superagent from 'superagent';
import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { SbbAlert } from '$lib/models/SbbAlert';
import type { SbbData } from '$lib/models/SbbData';
import type { SbbDeparture } from '$lib/models/SbbDeparture';

import type { SituationElement, Text } from './types';

const ENABLED = env.SBB_ENABLED === '1';
const CACHE_TIME = Number(env.SBB_CACHE_TIME);
const WORDS = env.SBB_KEYWORDS?.split(',') ?? [];
const API_KEY = env.SBB_API_KEY;
const API_SIRI_KEY = env.SBB_API_SIRI_KEY;
const STOP_POINT = env.SBB_STOP_POINT_REF;
const STOP_URL = 'https://api.opentransportdata.swiss/trias2020';
const STATUS_URL = 'https://api.opentransportdata.swiss/siri-sx';

const logger = new BaseLogger('SBB');
const cache = new BaseCache<SbbData>(logger, CACHE_TIME);

export async function getData(forceUpdate = false) {
	return cache.withDefault(forceUpdate, async () => {
		if (!ENABLED) {
			throw error(400, {
				message: `SBB is disabled`,
				key: 'sbb.disabled'
			});
		}

		const parser = new Parser({ async: true });

		const body = getRequestBody();
		const { text: textDepartures } = await superagent
			.post(STOP_URL)
			.set('Content-Type', 'application/XML')
			.set('Authorization', API_KEY)
			.send(body);

		const resTrias = await parser.parseStringPromise(textDepartures);

		const serviceDelivery = resTrias['trias:Trias']['trias:ServiceDelivery'][0];
		const deliveryPayload = serviceDelivery['trias:DeliveryPayload'][0];
		const stopEventResult = deliveryPayload['trias:StopEventResponse'][0]['trias:StopEventResult'];
		const departures: SbbDeparture[] = stopEventResult
			.map((d: any) => d['trias:StopEvent'][0])
			.map((d: any) => ({
				stop: d['trias:ThisCall'][0]['trias:CallAtStop'][0],
				service: d['trias:Service'][0]
			}))
			.map((d: any) => ({
				scheduled: parseISO(d.stop['trias:ServiceDeparture'][0]['trias:TimetabledTime'][0]),
				estimated: parseISO(d.stop['trias:ServiceDeparture'][0]['trias:EstimatedTime'][0]),
				lineName: d.service['trias:PublishedLineName'][0]['trias:Text'][0],
				destination: d.service['trias:DestinationText'][0]['trias:Text'][0]
			}))
			.map((d: any) => ({
				...d,
				delay: differenceInMinutes(d.estimated, d.scheduled)
			}));

		const { text: textEvents } = await superagent
			.get(STATUS_URL)
			.set('Authorization', `Bearer ${API_SIRI_KEY}`);

		const resEvents = await parser.parseStringPromise(textEvents);
		const sits: SituationElement[] =
			resEvents.Siri.ServiceDelivery[0].SituationExchangeDelivery[0].Situations[0]
				.PtSituationElement;

		const alerts: SbbAlert[] = [];
		for (const sit of sits) {
			if (sit.Planned?.[0] === 'true' || !alertIsRelevant(JSON.stringify(sit))) {
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
				summary: getTextDE(pub.SummaryContent[0].SummaryText),
				reason: getTextDE(pub.ReasonContent?.[0].ReasonText),
				description: getTextDE(pub.DescriptionContent?.[0].DescriptionText),
				consequence: getTextDE(pub.ConsequenceContent?.[0].ConsequenceText),
				duration: getTextDE(pub.DurationContent?.[0].DurationText),
				recommendation: getTextDE(pub.RecommendationContent?.[0].RecommendationText)
			});
		}

		if (dev && alerts.length === 0) {
			logger.warn('Using dev mock data');
			alerts.push(...getMockAlerts());
		}

		return {
			ts: new Date(),
			alerts,
			departures
		};
	});
}

function alertIsRelevant(text: string) {
	return WORDS.some((w) => text.includes(w));
}

function getTextDE(texts: Text[]): string;
function getTextDE(texts: Text[] | undefined): string | undefined;
function getTextDE(texts: Text[] | undefined): string | undefined {
	return texts?.find((s) => s['$']['xml:lang'] === 'DE')?.['_'];
}

function getMockAlerts(): SbbAlert[] {
	return [
		{
			start: parseISO('2023-03-27T18:32:00+02:00'),
			end: parseISO('2023-03-27T19:30:00+02:00'),
			summary: 'Einschränkung Zürich HB SZU - Zürich Selnau',
			reason: 'Grund: Streckenblockierung',
			description: 'Linien S4, S10',
			consequence: 'Es ist mit Verspätungen und Ausfällen zu rechnen',
			duration: 'Dauer: unbestimmt',
			recommendation: undefined
		}
	];
}

function getRequestBody() {
	return `<?xml version="1.0" encoding="UTF-8"?>
	<Trias version="1.1" xmlns="http://www.vdv.de/trias" xmlns:siri="http://www.siri.org.uk/siri" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
			<ServiceRequest>
					<siri:RequestorRef>Weather-Station</siri:RequestorRef>
					<RequestPayload>
							<StopEventRequest>
									<Location>
											<LocationRef>
													<StopPointRef>${STOP_POINT}</StopPointRef>
											</LocationRef>
									</Location>
									<Params>
											<NumberOfResults>10</NumberOfResults>
											<StopEventType>departure</StopEventType>
											<IncludePreviousCalls>false</IncludePreviousCalls>
											<IncludeOnwardCalls>false</IncludeOnwardCalls>
											<IncludeRealtimeData>true</IncludeRealtimeData>
									</Params>
							</StopEventRequest>
					</RequestPayload>
			</ServiceRequest>
	</Trias>`;
}
