import { decode } from 'html-entities';
import { error } from '@sveltejs/kit';
import { parseISO } from 'date-fns';
import superagent from 'superagent';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { PostData } from '$lib/models/PostData';
import type { PostShipment } from '$lib/models/PostShipment';

import type { RecursiveMap } from './types';

const ENABLED = env.POST_ENABLED === '1';
const CACHE_TIME = Number(env.POST_CACHE_TIME);
const USERNAME = env.POST_USERNAME;
const PASSWORD = env.POST_PASSWORD;
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

const logger = new BaseLogger('POST');
const cache = new BaseCache<PostData>(logger, CACHE_TIME);

let hasTexts = false;
const shipmentTexts: RecursiveMap = new Map();

export async function getData(forceUpdate = false): Promise<PostData> {
	return cache.withDefault(forceUpdate, async () => {
		if (!ENABLED) {
			throw error(400, {
				message: `Post is disabled`,
				key: 'post.disabled'
			});
		}

		await updateTexts();

		const agent = superagent.agent().withCredentials();

		let url = URL_START;
		const resPre = await request('pre', agent.get(url).accept('html'));

		const redir = resPre.redirects.pop();
		if (!redir) {
			throw error(500, {
				message: 'Missing redirect URL',
				key: 'post.missingRedirectUrl'
			});
		}

		const params = new URL(redir).searchParams.toString();
		url = `${URL_INIT}?${params}`;

		const resInit = await request('init', agent.post(url).type('json').send({}));

		logger.debug('next_action', resInit.body.nextAction?.type);

		url = `${URL_LOGIN}?${params}`;
		let authId = resInit.body.tokens.authId;
		const loginData = { username: USERNAME, password: PASSWORD };

		const resBasic = await request(
			'basic',
			agent.post(url).type('json').set('authId', authId).send(loginData)
		);

		authId = resBasic.body.tokens.authId;
		url = `${URL_ANOMALY}?${params}`;

		const resAnomaly = await request(
			'anomaly',
			agent.post(url).type('json').set('authId', authId).send({})
		);

		url = decodeURI(resAnomaly.body.nextAction.successUrl.trim());

		const resAuth = await request('auth', agent.get(url).accept('html'));

		let rawUrl = FORM_REGEX.exec(resAuth.text)?.[1]?.trim();
		if (!rawUrl) {
			throw error(500, {
				message: 'Could not find auth form',
				key: 'post.authFormNotFound'
			});
		}

		url = decode(rawUrl);

		const resDone = await request('done', agent.post(url).type('form'));

		rawUrl = FORM_REGEX.exec(resDone.text)?.[1]?.trim();
		if (!rawUrl) {
			throw error(500, {
				message: 'Could not find submit form',
				key: 'post.submitFormNotFound'
			});
		}

		url = decode(rawUrl);
		let matches = INPUT_REGEX.exec(resDone.text);
		const data: Record<string, string> = {};
		while (matches !== null) {
			data[matches[1]] = matches[2];
			matches = INPUT_REGEX.exec(resDone.text);
		}

		await request('post', agent.post(url).type('form').send(data));

		const resUser = await request('user', agent.get(URL_USER).set('Accept', 'application/json'));

		url = `${URL_SHIPMENTS}/user/${resUser.body.userIdentifier}`;

		const resShipmentReq = await request(
			'shipments-req',
			agent.get(url).set('Accept', 'application/json')
		);

		url = `${URL_SHIPMENTS}/result/${resShipmentReq.body}`;

		let resShipments = await request('shipments', agent.get(url).set('Accept', 'application/json'));
		for (let i = 0; i < 5; i++) {
			if (resShipments.body.status === 'DONE') {
				break;
			}
			await new Promise<void>((res) => setTimeout(res, 1000));
			resShipments = await request('shipments', agent.get(url).set('Accept', 'application/json'));
		}

		if (resShipments.body.status !== 'DONE') {
			throw error(500, {
				message: 'Shipment query status did not change to DONE',
				key: 'post.shipmentQueryFailed',
				params: { status: resShipments.body.status }
			});
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rawShipments: any[] = resShipments.body.shipments;
		const shipments: PostShipment[] = rawShipments
			.filter((s) => s.shipment.globalStatus !== 'DELIVERED')
			.map(({ shipment }) => {
				const phys = shipment.physicalProperties;
				let type = getText(shipment.product) || shipment.product;
				if (shipment.internationalProduct) {
					const newType = getText(shipment.internationalProduct);
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
			const events = await request(
				`events-${shipment.number}`,
				agent.get(URL_EVENTS.replace('$id', shipment.id)).set('Accept', 'application/json')
			);
			const event = events.body[0];
			if (!event) {
				continue;
			}

			shipment.status = getText(event.eventCode) || event.eventCode;
		}

		if (dev && shipments.length === 0) {
			logger.warn('Using dev mock data');
			shipments.push(...getMockShipments());
		}

		return {
			ts: new Date(),
			shipments
		};
	});
}

async function request(name: string, req: superagent.SuperAgentRequest) {
	logger.debug(name, req.method, req.url);
	try {
		const resp = await req;
		for (const url of resp.redirects) {
			logger.debug(name, '-->', url);
		}
		logger.debug(name, 'status:', resp.status);
		return resp;
	} catch (err: unknown) {
		logger.warn(name, (err as superagent.ResponseError).response?.body);
		throw err;
	}
}

async function updateTexts() {
	if (hasTexts) {
		return;
	}

	const resTexts = await superagent.get(URL_TEXTS);
	const texts: Record<string, string> = resTexts.body['shipment-text--'];
	for (const [key, value] of Object.entries(texts)) {
		const splits = key.split('.');
		let entry = ['', shipmentTexts] as [string, RecursiveMap];
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

	hasTexts = true;
}

function getText(code: string) {
	const splits = code.split('.');
	const entry = ['', shipmentTexts] as [string, RecursiveMap];
	const text = getRecursiveTexts(entry, splits, 0);
	return text;
}

function getRecursiveTexts(
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
		const res = getRecursiveTexts(specific, splits, index + 1);
		if (res) {
			return res;
		}
	}
	const generic = entry[1].get('*');
	if (generic) {
		const res = getRecursiveTexts(generic, splits, index + 1);
		if (res) {
			return res;
		}
	}

	return undefined;
}

function getMockShipments(): PostShipment[] {
	return [
		{
			id: '__unknown__',
			number: '99.xx.yyyyyy.zzzzzzzz',
			type: 'PostPac Priority',
			arrival: '2023-03-29T00:00:00+02:00',
			status: null,
			sender: 'Digitec Galaxus AG',
			dims: { x: 310, y: 240, z: 215 },
			weight: 4320
		},
		{
			id: '__unknown__',
			number: '88.xx.yyyyyy.zzzzzzzz',
			type: 'International PostPac Priority',
			arrival: null,
			status: 'Verzollungsprozess',
			sender: 'Digitec Galaxus AG',
			dims: { x: 310, y: 240, z: 215 },
			weight: 4320
		}
	];
}
