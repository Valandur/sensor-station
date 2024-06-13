import { differenceInMinutes, parseISO } from 'date-fns';
import { Parser } from 'xml2js';
import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import type { ServiceActionFailure } from '$lib/models/service';
import { clamp } from '$lib/counter';
import {
	SBB_DEPARTURES_SERVICE_ACTIONS,
	SBB_DEPARTURES_SERVICE_TYPE,
	type SbbDeparture,
	type SbbDeparturesServiceAction,
	type SbbDeparturesServiceConfig,
	type SbbDeparturesServiceConfigData,
	type SbbDeparturesServiceMainData
} from '$lib/models/sbb-departures';

import { Cache } from '../Cache';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

interface CacheData {
	ts: Date;
	departures: SbbDeparture[];
}

const ENABLED = env.SBB_DEPARTURES_ENABLED === '1';
const STOP_URL = 'https://api.opentransportdata.swiss/trias2020';

export class SbbDeparturesService extends BaseService<
	SbbDeparturesServiceAction,
	SbbDeparturesServiceConfig
> {
	public override readonly type = SBB_DEPARTURES_SERVICE_TYPE;
	public static readonly actions = SBB_DEPARTURES_SERVICE_ACTIONS;

	private readonly cache: Cache<CacheData> = new Cache(this.logger);

	protected getDefaultConfig(): SbbDeparturesServiceConfig {
		return {
			apiKey: '',
			stopPoint: '',
			itemsPerPage: 6
		};
	}

	protected getActions(): ServiceActions<SbbDeparturesServiceAction> {
		return {
			config: {
				get: this.getConfig.bind(this),
				set: this.setConfig.bind(this)
			},
			main: {
				get: this.getData.bind(this)
			},
			preview: {
				get: this.getData.bind(this)
			}
		};
	}

	public async getConfig({ url }: ServiceGetDataOptions): Promise<SbbDeparturesServiceConfigData> {
		if (!ENABLED) {
			error(400, {
				message: `SBB departures is disabled`,
				key: 'sbbDepartures.disabled'
			});
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
			return fail(400, { key: 'sbbDepartures.apiKey.invalid', message: 'Invalid api key' });
		}

		const stopPoint = form.get('stopPoint');
		if (typeof stopPoint !== 'string') {
			return fail(400, { key: 'sbbDepartures.stopPoint.invalid', message: 'Invalid stop point' });
		}

		const itemsPerPage = Number(form.get('itemsPerPage'));
		if (!isFinite(itemsPerPage)) {
			return fail(400, {
				key: 'sbbDepartures.itemsPerPage.invalid',
				message: 'Invalid number of items per page'
			});
		}

		this.config.apiKey = apiKey;
		this.config.stopPoint = stopPoint;
		this.config.itemsPerPage = itemsPerPage;
	}

	public async getData({ url }: ServiceGetDataOptions): Promise<SbbDeparturesServiceMainData> {
		if (!ENABLED) {
			error(400, {
				message: `SBB departures is disabled`,
				key: 'sbbDepartures.disabled'
			});
		}

		if (!this.config.apiKey || !this.config.stopPoint) {
			error(400, {
				key: 'sbbDepartures.config.invalid',
				message: 'Invalid SBB departures config'
			});
		}

		const forceUpdate = url.searchParams.has('force');

		const data = await this.cache.with(
			{
				key: this.config.stopPoint,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				const parser = new Parser({ async: true });

				const body = this.getRequestBody(this.config.stopPoint);
				const res = await fetch(STOP_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/xml',
						Authorization: this.config.apiKey
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
					departures
				};
			}
		);

		let page = Number(url.searchParams.get('page'));
		if (!isFinite(page)) {
			page = 0;
		}
		const [departures, prevPage, nextPage] = clamp(
			data.departures.length,
			page,
			this.config.itemsPerPage,
			data.departures
		);

		return {
			ts: data.ts,
			type: 'data',
			departures
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
