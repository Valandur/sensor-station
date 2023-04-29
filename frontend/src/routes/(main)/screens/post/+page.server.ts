/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { decode } from 'html-entities';
import { differenceInSeconds } from 'date-fns';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import superagent from 'superagent';

import { Counter } from '$lib/counter';
import type { PostShipment } from '$lib/models/PostShipment';

import type { PageServerLoad } from './$types';

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

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	let page = Number(url.searchParams.get('page') || '-');

	await updateTexts();

	const shipments = await getShipments();
	counter.max = shipments.length;

	if (!isFinite(page)) {
		page = counter.increment();
	}

	const shipment = shipments[page];
	const dataParent = await parent();

	if (!shipment && dataParent.skipScreen) {
		throw redirect(302, dataParent.skipScreen);
	}

	return {
		shipment,
		nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
	};
};

let shipments: PostShipment[] = [];
let cachedAt = new Date(0);

async function getShipments(): Promise<PostShipment[]> {
	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		return shipments;
	}

	const agent = superagent.agent().withCredentials();

	const resPre = await request('pre', agent.get(URL_START).accept('html'));

	let url = decode(FORM_REGEX.exec(resPre.text)![1]!.trim());

	const resStart = await request(
		'start',
		agent.post(url).type('form').send({ externalIDP: 'externalIDP' })
	);

	const params = new URL(resStart.redirects.pop()!).searchParams.toString();
	url = `${URL_INIT}?${params}`;

	const resInit = await request('init', agent.post(url).type('json').send({}));

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

	url = decode(FORM_REGEX.exec(resAuth.text)![1]!.trim());

	const resDone = await request('done', agent.post(url).type('form'));

	url = decode(FORM_REGEX.exec(resDone.text)![1]!.trim());
	let matches = INPUT_REGEX.exec(resDone.text);
	const data: Record<string, string> = {};
	while (matches !== null) {
		data[matches[1]!] = matches[2];
		matches = INPUT_REGEX.exec(resDone.text);
	}

	await request('post', agent.post(url).type('form').send(data));

	const resUser = await request('user', agent.get(URL_USER));

	url = `${URL_SHIPMENTS}/user/${resUser.body.userIdentifier}`;

	const resShipmentReq = await request('shipments-req', agent.get(url));

	url = `${URL_SHIPMENTS}/result/${resShipmentReq.body}`;

	let resShipments = await request('shipments', agent.get(url));
	for (let i = 0; i < 5; i++) {
		if (resShipments.body.status === 'DONE') {
			break;
		}
		await new Promise<void>((res) => setTimeout(res, 1000));
		resShipments = await request('shipments', agent.get(url));
	}
	if (resShipments.body.status !== 'DONE') {
		throw new Error('Shipment status did not change to DONE');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const rawShipments: any[] = resShipments.body.shipments;
	const newShipments: PostShipment[] = rawShipments
		.filter((s) => s.shipment.globalStatus !== 'DELIVERED')
		.map(({ shipment }) => {
			const phys = shipment.physicalProperties;

			return {
				id: shipment.identity,
				number: shipment.formattedShipmentNumber,
				type: shipment.internationalProduct
					? getText(shipment.internationalProduct)
					: getText(shipment.product),
				arrival: shipment.calculatedDeliveryDate || null,
				status: null,
				sender: shipment.debitorDescription,
				dims: phys.dimension1
					? { x: phys.dimension1, y: phys.dimension2, z: phys.dimension3 }
					: null,
				weight: phys.weight || null
			};
		});

	for (const shipment of newShipments) {
		const events = await request(
			`events-${shipment.number}`,
			agent.get(URL_EVENTS.replace('$id', shipment.id))
		);
		const event = events.body[0];
		if (!event) {
			continue;
		}

		shipment.status = getText(event.eventCode);
	}

	shipments = newShipments;
	cachedAt = new Date();

	return shipments;
}

async function request(name: string, req: superagent.SuperAgentRequest) {
	// console.log(name, req.method, req.url.substring(0, 150));
	const resp = await req;
	/*for (const url of resp.redirects) {
		console.log(name, '-->', url.substring(0, 150));
	}*/
	// console.log(name, 'status:', resp.status);
	return resp;
}

type RecursiveMap = Map<string, [string, RecursiveMap]>;

let hasTexts = false;
const shipmentTexts: RecursiveMap = new Map();

async function updateTexts() {
	if (hasTexts) {
		return;
	}

	const resTexts = await superagent.get(URL_TEXTS);
	const texts: Record<string, string> = resTexts.body['shipment-text--'];
	for (const [key, value] of Object.entries(texts)) {
		const splits = key.split('.');
		let entry = ['', shipmentTexts] as [string, RecursiveMap];
		while (splits.length > 0) {
			const split = splits.shift()!;
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
	return text || code;
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
			const nextSubEntry = entry[1].get('*');
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
