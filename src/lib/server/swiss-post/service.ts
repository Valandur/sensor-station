import { decode } from 'html-entities';
import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import makeFetchCookie from 'fetch-cookie';

import type { ServiceActionFailure } from '$lib/models/service';
import { wrap } from '$lib/counter';
import {
	SWISS_POST_SERVICE_TYPE,
	SWISS_POST_SERVICE_ACTIONS,
	type SwissPostServiceAction,
	type SwissPostServiceConfig,
	type SwissPostServiceConfigData,
	type SwissPostServiceMainData,
	type Shipment,
	type RecursiveMap
} from '$lib/models/swiss-post';

import { Cache } from '../Cache';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

interface CacheData {
	ts: Date;
	shipments: Shipment[];
}

const ENABLED = env.SWISS_POST_ENABLED === '1';
const URL_START =
	'https://account.post.ch/idp/?targetURL=https%3A%2F%2Fservice.post.ch%2Fekp-web%2Fsecure%2F%3Flang%3Den%26service%3Dekp%26app%3Dekp&lang=en&service=ekp&inIframe=&inMobileApp=';
const URL_INIT = 'https://login.swissid.ch/api-login/authenticate/init';
const URL_LOGIN = 'https://login.swissid.ch/api-login/authenticate/basic';
const URL_ANOMALY = 'https://login.swissid.ch/api-login/anomaly-detection/device-print';
const FORM_REGEX = /<form .*?action="((?:.|\n)*?)"/i;
const INPUT_REGEX = /<input .*?name="(.*?)" .*?value="(.*?)".*?\/>/gi;
const URL_USER = 'https://service.post.ch/ekp-web/api/user';
const URL_SHIPMENTS = 'https://service.post.ch/ekp-web/secure/api/shipment/mine';
const URL_EVENTS = 'https://service.post.ch/ekp-web/secure/api/shipment/id/$id/events/';
const URL_TEXTS =
	'https://service.post.ch/ekp-web/core/rest/translations/de/shipment-text-messages';

export class SwissPostService extends BaseService<SwissPostServiceAction, SwissPostServiceConfig> {
	public override readonly type = SWISS_POST_SERVICE_TYPE;
	public static readonly actions = SWISS_POST_SERVICE_ACTIONS;

	private hasTexts = false;
	private shipmentTexts: RecursiveMap = new Map();
	private fetchCookie = makeFetchCookie(fetch);
	private readonly cache: Cache<CacheData> = new Cache(this.logger);

	protected getDefaultConfig(): SwissPostServiceConfig {
		return {
			username: '',
			password: ''
		};
	}

	protected getActions(): ServiceActions<SwissPostServiceAction> {
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

	public async getConfig({ url }: ServiceGetDataOptions): Promise<SwissPostServiceConfigData> {
		if (!ENABLED) {
			error(400, `Swiss Post is disabled`);
		}

		return {
			ts: new Date(),
			type: 'config',
			config: this.config
		};
	}

	public async setConfig({ form }: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const username = form.get('username');
		if (typeof username !== 'string') {
			return fail(400, { message: 'Invalid username' });
		}

		const password = form.get('password');
		if (typeof password !== 'string') {
			return fail(400, { message: 'Invalid password' });
		}

		let url = URL_START;
		const resPre = await this.request('pre', url, {
			headers: { Accept: 'text/html' }
		});

		const redir = resPre.url;
		if (!redir) {
			return fail(400, { message: 'Missing redirect URL' });
		}

		const params = new URL(redir).searchParams.toString();
		url = `${URL_INIT}?${params}`;

		const resInit = await this.request('init', url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({})
		});
		const bodyInit = await resInit.json();

		this.logger.debug('next_action', bodyInit.nextAction?.type);

		url = `${URL_LOGIN}?${params}`;
		let authId = bodyInit.tokens.authId;
		if (!authId) {
			return fail(400, { message: 'Missing auth ID' });
		}

		const loginData = { username, password };

		const resBasic = await this.request('basic', url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				authId: authId
			},
			body: JSON.stringify(loginData)
		});
		const bodyBasic = await resBasic.json();

		authId = bodyBasic.tokens.authId;
		if (!authId) {
			return fail(400, { message: 'Missing auth ID' });
		}

		this.config.username = username;
		this.config.password = password;
	}

	public async getData({ url }: ServiceGetDataOptions): Promise<SwissPostServiceMainData> {
		if (!ENABLED) {
			error(400, `Swiss Post is disabled`);
		}

		if (!this.config.username || !this.config.password) {
			error(400, 'Invalid Swiss Post config');
		}

		const forceUpdate = url.searchParams.has('force');

		const data = await this.cache.with(
			{
				key: this.config.username,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				await this.updateTexts();

				let url = URL_START;
				const resPre = await this.request('pre', url, {
					headers: { Accept: 'text/html' }
				});

				const redir = resPre.url;
				if (!redir) {
					error(500, 'Missing redirect URL');
				}

				const params = new URL(redir).searchParams.toString();
				url = `${URL_INIT}?${params}`;

				const resInit = await this.request('init', url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({})
				});
				const bodyInit = await resInit.json();

				this.logger.debug('next_action', bodyInit.nextAction?.type);

				url = `${URL_LOGIN}?${params}`;
				let authId = bodyInit.tokens.authId;
				const loginData = { username: this.config.username, password: this.config.password };

				const resBasic = await this.request('basic', url, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						authId: authId
					},
					body: JSON.stringify(loginData)
				});
				const bodyBasic = await resBasic.json();

				authId = bodyBasic.tokens.authId;
				url = `${URL_ANOMALY}?${params}`;

				const resAnomaly = await this.request('anomaly', url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						authId: authId
					},
					body: JSON.stringify({})
				});
				const anomalyBody = await resAnomaly.json();

				url = decodeURI(anomalyBody.nextAction.successUrl.trim());

				const resAuth = await this.request('auth', url, {
					headers: {
						Accept: 'text/html'
					}
				});
				const authBody = await resAuth.text();

				let rawUrl = FORM_REGEX.exec(authBody)?.[1]?.trim();
				if (!rawUrl) {
					error(500, 'Could not find auth form');
				}

				url = decode(rawUrl);

				const resDone = await this.request('done', url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
				const doneBody = await resDone.text();

				rawUrl = FORM_REGEX.exec(doneBody)?.[1]?.trim();
				if (!rawUrl) {
					error(500, 'Could not find submit form');
				}

				url = decode(rawUrl);
				let matches = INPUT_REGEX.exec(doneBody);
				const data = new URLSearchParams();
				while (matches !== null) {
					const key = matches[1];
					const value = matches[2];
					data.append(key, value);
					matches = INPUT_REGEX.exec(doneBody);
				}

				await this.request('post', url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: data
				});

				const resUser = await this.request('user', URL_USER, {
					headers: {
						Accept: 'application/json'
					}
				});
				const userBody = await resUser.json();

				url = `${URL_SHIPMENTS}/user/${userBody.userIdentifier}`;

				const resShipmentReq = await this.request('shipments-req', url, {
					headers: {
						Accept: 'application/json'
					}
				});
				const shipmentReqBody = await resShipmentReq.json();

				url = `${URL_SHIPMENTS}/result/${shipmentReqBody}`;

				const resShipments = await this.request('shipments', url, {
					headers: {
						Accept: 'application/json'
					}
				});
				let shipmentsBody = await resShipments.json();

				// Retry 5 times until the shipment is "DONE"
				for (let i = 0; i < 5; i++) {
					if (shipmentsBody.status === 'DONE') {
						break;
					}
					await new Promise<void>((res) => setTimeout(res, 1000));
					const resShipments = await this.request('shipments', url, {
						headers: {
							Accept: 'application/json'
						}
					});
					shipmentsBody = await resShipments.json();
				}

				if (shipmentsBody.status !== 'DONE') {
					error(500, {
						message: 'Shipment query status did not change to DONE',
						params: { status: shipmentsBody.status }
					});
				}

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const rawShipments: any[] = shipmentsBody.shipments;
				const shipments: Shipment[] = rawShipments
					.filter((s) => s.shipment.globalStatus !== 'DELIVERED')
					.map(({ shipment }) => {
						const phys = shipment.physicalProperties;
						let type = this.getText(shipment.product) || shipment.product;
						if (shipment.internationalProduct) {
							const newType = this.getText(shipment.internationalProduct);
							if (newType) {
								type = newType;
							}
						}

						return {
							id: shipment.identity,
							number: shipment.formattedShipmentNumber ?? '-- unbekannt --',
							type: type,
							arrival: shipment.calculatedDeliveryDate ?? null,
							status: null,
							sender: shipment.debitorDescription ?? null,
							dims: phys.dimension1
								? { x: phys.dimension1, y: phys.dimension2, z: phys.dimension3 }
								: null,
							weight: phys.weight ?? null
						};
					});

				for (const shipment of shipments) {
					const eventsRes = await this.request(
						`events-${shipment.number}`,
						URL_EVENTS.replace('$id', shipment.id),
						{
							headers: {
								Accept: 'application/json'
							}
						}
					);
					const eventsBody = await eventsRes.json();
					const event = eventsBody[0];
					if (!event) {
						continue;
					}

					shipment.status = this.getText(event.eventCode) || event.eventCode;
				}

				return {
					ts: new Date(),
					shipments
				};
			}
		);

		let page = Number(url.searchParams.get('page'));
		if (!isFinite(page)) {
			page = 0;
		}
		const [[shipment], prevPage, nextPage] = wrap(data.shipments.length, page, 1, data.shipments);

		return {
			ts: new Date(),
			type: 'data',
			prevPage,
			nextPage,
			shipment
		};
	}

	private async request(name: string, url: string, init: RequestInit) {
		this.logger.debug(name, init.method ?? 'GET', url);
		try {
			const resp = await this.fetchCookie(url, {
				...init,
				redirect: 'follow',
				credentials: 'include'
			});
			this.logger.debug(name, 'status:', resp.status);
			if (resp.status < 200 || resp.status >= 400) {
				const body = await resp.json().catch(() => null);
				const text = body ? null : await resp.text().catch(() => null);
				error(400, `Invalid status: ${resp.status}: ${body?.title ?? text ?? resp.statusText}`);
			}
			return resp;
		} catch (err: unknown) {
			this.logger.error(name, (err as any).cause ?? err);
			throw (err as any).cause ?? err;
		}
	}

	private async updateTexts() {
		if (this.hasTexts) {
			return;
		}

		const resTexts = await fetch(URL_TEXTS);
		const bodyTexts = await resTexts.json();
		const texts: Record<string, string> = bodyTexts['shipment-text--'];
		for (const [key, value] of Object.entries(texts)) {
			const splits = key.split('.');
			let entry = ['', this.shipmentTexts] as [string, RecursiveMap];
			let split: string | undefined;
			while ((split = splits.shift())) {
				let subEntry = entry[1].get(split);
				if (typeof subEntry === 'undefined') {
					subEntry = ['', new Map()];
					entry[1].set(split, subEntry);
				}
				entry = subEntry;
			}
			entry[0] = value.trim();
		}

		this.hasTexts = true;
	}

	private getText(code: string) {
		const splits = code.split('.');
		const entry = ['', this.shipmentTexts] as [string, RecursiveMap];
		const text = this.getRecursiveTexts(entry, splits, 0);
		return text;
	}

	private getRecursiveTexts(
		entry: [string, RecursiveMap],
		splits: string[],
		index: number
	): string | undefined {
		const split = splits[index];
		if (!split) {
			// Find the text -> Either the current entry if there is text, or the first sub entry with key '*' and text (recursivly)
			let subEntry = entry;
			while (!subEntry[0]) {
				const nextSubEntry = subEntry[1].get('*');
				if (!nextSubEntry) {
					break;
				}
				subEntry = nextSubEntry;
			}
			return subEntry[0];
		}

		const specific = entry[1].get(split);
		if (specific) {
			const res = this.getRecursiveTexts(specific, splits, index + 1);
			if (res) {
				return res;
			}
		}
		const generic = entry[1].get('*');
		if (generic) {
			const res = this.getRecursiveTexts(generic, splits, index + 1);
			if (res) {
				return res;
			}
		}

		return undefined;
	}
}
