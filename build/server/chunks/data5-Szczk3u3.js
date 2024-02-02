import { parseISO, differenceInMinutes } from 'date-fns';
import { Parser } from 'xml2js';
import superagent from 'superagent';
import { e as error } from './index-H42hWO6o.js';
import { d as private_env } from './shared-server-49TKSBDM.js';
import { B as BaseCache } from './BaseCache-CtKtXkXQ.js';
import { B as BaseLogger } from './BaseLogger-SyOYFtXW.js';

const ENABLED = private_env.SBB_ENABLED === "1";
const CACHE_TIME = Number(private_env.SBB_CACHE_TIME);
const WORDS = private_env.SBB_KEYWORDS?.split(",") ?? [];
const API_KEY = private_env.SBB_API_KEY;
const API_SIRI_KEY = private_env.SBB_API_SIRI_KEY;
const STOP_POINT = private_env.SBB_STOP_POINT_REF;
const STOP_URL = "https://api.opentransportdata.swiss/trias2020";
const STATUS_URL = "https://api.opentransportdata.swiss/siri-sx";
const logger = new BaseLogger("SBB");
const cache = new BaseCache(logger, CACHE_TIME);
async function getData(forceUpdate = false) {
  return cache.withDefault(forceUpdate, async () => {
    if (!ENABLED) {
      throw error(400, {
        message: `SBB is disabled`,
        key: "sbb.disabled"
      });
    }
    const parser = new Parser({ async: true });
    const body = getRequestBody();
    const { text: textDepartures } = await superagent.post(STOP_URL).set("Content-Type", "application/XML").set("Authorization", API_KEY).send(body);
    const resTrias = await parser.parseStringPromise(textDepartures);
    const serviceDelivery = resTrias["trias:Trias"]["trias:ServiceDelivery"][0];
    const deliveryPayload = serviceDelivery["trias:DeliveryPayload"][0];
    const stopEventResult = deliveryPayload["trias:StopEventResponse"][0]["trias:StopEventResult"];
    const departures = stopEventResult.map((d) => d["trias:StopEvent"][0]).map((d) => ({
      stop: d["trias:ThisCall"][0]["trias:CallAtStop"][0],
      service: d["trias:Service"][0]
    })).map((d) => ({
      scheduled: parseISO(d.stop["trias:ServiceDeparture"][0]["trias:TimetabledTime"][0]),
      estimated: parseISO(d.stop["trias:ServiceDeparture"][0]["trias:EstimatedTime"][0]),
      lineName: d.service["trias:PublishedLineName"][0]["trias:Text"][0],
      destination: d.service["trias:DestinationText"][0]["trias:Text"][0]
    })).map((d) => ({
      ...d,
      delay: differenceInMinutes(d.estimated, d.scheduled)
    }));
    const { text: textEvents } = await superagent.get(STATUS_URL).set("Authorization", `Bearer ${API_SIRI_KEY}`);
    const resEvents = await parser.parseStringPromise(textEvents);
    const sits = resEvents.Siri.ServiceDelivery[0].SituationExchangeDelivery[0].Situations[0].PtSituationElement;
    const alerts = [];
    for (const sit of sits) {
      if (sit.Planned?.[0] === "true" || !alertIsRelevant(JSON.stringify(sit))) {
        continue;
      }
      const actions = sit.PublishingActions[0].PublishingAction[0];
      const pubs = actions.PassengerInformationAction[0].TextualContent;
      const pub = pubs.find((c) => c.TextualContentSize[0] === "S");
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
    return {
      ts: /* @__PURE__ */ new Date(),
      alerts,
      departures
    };
  });
}
function alertIsRelevant(text) {
  return WORDS.some((w) => text.includes(w));
}
function getTextDE(texts) {
  return texts?.find((s) => s["$"]["xml:lang"] === "DE")?.["_"];
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

export { getData as g };
//# sourceMappingURL=data5-Szczk3u3.js.map
