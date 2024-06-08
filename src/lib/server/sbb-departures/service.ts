import { differenceInMinutes, parseISO } from 'date-fns';
import { Parser } from 'xml2js';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import {
	SBB_DEPARTURES_SERVICE_TYPE,
	type SbbDeparture,
	type SbbDeparturesServiceConfig,
	type SbbDeparturesServiceData,
	type SbbDeparturesServiceInstance
} from '$lib/models/sbb-departures';

import { BaseService } from '../BaseService';

const ENABLED = env.SBB_DEPARTURES_ENABLED === '1';
const STOP_URL = 'https://api.opentransportdata.swiss/trias2020';

class SbbDeparturesService extends BaseService<
	SbbDeparturesServiceConfig,
	SbbDeparturesServiceData
> {
	public override readonly type = SBB_DEPARTURES_SERVICE_TYPE;

	public constructor() {
		super('SBB_DEPARTURES');
	}

	public get(
		{ name, config }: SbbDeparturesServiceInstance,
		forceUpdate?: boolean | undefined
	): Promise<SbbDeparturesServiceData> {
		return this.cache.with(
			{
				key: config.stopPoint,
				force: forceUpdate,
				resultCacheTime: config.resultCacheTime,
				errorCacheTime: config.errorCacheTime
			},
			async () => {
				if (!ENABLED) {
					error(400, {
						message: `SBB departures is disabled`,
						key: 'sbb_departures.disabled'
					});
				}

				const parser = new Parser({ async: true });

				const body = this.getRequestBody(config.stopPoint);
				const res = await fetch(STOP_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/xml',
						Authorization: config.apiKey
					},
					body
				});
				const resTrias = await parser.parseStringPromise(await res.text());

				const serviceDelivery = resTrias['trias:Trias']['trias:ServiceDelivery'][0];
				const deliveryPayload = serviceDelivery['trias:DeliveryPayload'][0];
				const stopEventResponse = deliveryPayload['trias:StopEventResponse'][0];

				const departures: SbbDeparture[] = [];
				for (const d of stopEventResponse['trias:StopEventResult']) {
					const stopEvent = d['trias:StopEvent']?.[0];

					const stop = stopEvent?.['trias:ThisCall']?.[0]?.['trias:CallAtStop']?.[0];
					const serviceDeparture = stop?.['trias:ServiceDeparture']?.[0];

					const scheduledStr = serviceDeparture?.['trias:TimetabledTime']?.[0];
					if (!scheduledStr) {
						this.logger.warn('No scheduled time', JSON.stringify(stopEvent));
						continue;
					}
					const scheduled = parseISO(scheduledStr);

					const estimatedStr = serviceDeparture?.['trias:EstimatedTime']?.[0];
					const estimated = estimatedStr ? parseISO(estimatedStr) : null;

					const service = stopEvent?.['trias:Service']?.[0];
					const lineName = service['trias:PublishedLineName']?.[0]?.['trias:Text']?.[0] ?? '???';
					const destination = service['trias:DestinationText']?.[0]?.['trias:Text']?.[0] ?? '???';

					const type = service?.['trias:Mode']?.[0]?.['trias:PtMode']?.[0] ?? null;

					const delay = estimated ? differenceInMinutes(estimated, scheduled) : 0;
					departures.push({
						scheduled,
						estimated,
						lineName,
						destination,
						delay,
						type
					});
				}

				return {
					ts: new Date(),
					name,
					departures
				};
			}
		);
	}

	public async validate(
		instance: SbbDeparturesServiceInstance,
		config: FormData
	): Promise<SbbDeparturesServiceConfig> {
		const apiKey = config.get('apiKey');
		if (typeof apiKey !== 'string') {
			throw new Error('Invalid api key');
		}

		const stopPoint = config.get('stopPoint');
		if (typeof stopPoint !== 'string') {
			throw new Error('Invalid stop key');
		}

		return {
			apiKey,
			stopPoint
		};
	}

	private getRequestBody(stopPoint: string) {
		return `<?xml version="1.0" encoding="UTF-8"?>
	<Trias version="1.1" xmlns="http://www.vdv.de/trias" xmlns:siri="http://www.siri.org.uk/siri" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
			<ServiceRequest>
					<siri:RequestorRef>Weather-Station</siri:RequestorRef>
					<RequestPayload>
							<StopEventRequest>
									<Location>
											<LocationRef>
													<StopPointRef>${stopPoint}</StopPointRef>
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
}

export default new SbbDeparturesService();
