import superagent from 'superagent';
import { decode } from 'html-entities';

import { Service } from './service';

const URL_START =
	'https://account.post.ch/idp/?targetURL=https%3A%2F%2Fservice.post.ch%2Fekp-web%2Fsecure%2F%3Flang%3Den%26service%3Dekp%26app%3Dekp&lang=en&service=ekp&inIframe=&inMobileApp=';
const URL_INIT = 'https://login.swissid.ch/api-login/authenticate/init';
const URL_LOGIN = 'https://login.swissid.ch/api-login/authenticate/basic';
const URL_ANOMALY = 'https://login.swissid.ch/api-login/anomaly-detection/device-print';
const FORM_REGEX = /<form .*?action="((?:.|\n)*?)"/i;
const INPUT_REGEX = /<input .*?name="(.*?)" .*?value="(.*?)".*?\/>/gi;
const URL_USER = 'https://service.post.ch/ekp-web/api/user';
const URL_SHIPMENTS = 'https://service.post.ch/ekp-web/secure/api/shipment/mine';
const USERNAME = process.env['POST_USERNAME'];
const PASSWORD = process.env['POST_PASSWORD'];

export interface Shipment {
	id: string;
	sender: string;
	arrival: string;
}

export class Post extends Service {
	private agent = superagent.agent().withCredentials();
	private timer: NodeJS.Timer | null = null;

	public updatedAt: Date | null = null;
	public shipments: Shipment[] | null = null;

	protected override async doInit(): Promise<void> {}

	protected override async doStart(): Promise<void> {
		await this.update();

		if (process.env['POST_UPDATE_INTERVAL']) {
			const interval = 1000 * Number(process.env['POST_UPDATE_INTERVAL']);
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
		this.shipments = null;
	}

	protected override async doDispose(): Promise<void> {}

	private update = async () => {
		try {
			const resPre = await this.request('pre', this.agent.get(URL_START).accept('html'));

			let url = decode(FORM_REGEX.exec(resPre.text)![1]!.trim());

			const resStart = await this.request(
				'start',
				this.agent.post(url).type('form').send({ externalIDP: 'externalIDP' })
			);

			const params = new URL(resStart.redirects.pop()!).searchParams.toString();
			url = `${URL_INIT}?${params}`;

			const resInit = await this.request('init', this.agent.post(url).type('json').send({}));

			url = `${URL_LOGIN}?${params}`;
			let authId = resInit.body.tokens.authId;
			const loginData: any = { username: USERNAME, password: PASSWORD };

			const resBasic = await this.request(
				'basic',
				this.agent.post(url).type('json').set('authId', authId).send(loginData)
			);

			authId = resBasic.body.tokens.authId;
			url = `${URL_ANOMALY}?${params}`;

			const resAnomaly = await this.request(
				'anomaly',
				this.agent.post(url).type('json').set('authId', authId).send({})
			);

			url = decodeURI(resAnomaly.body.nextAction.successUrl.trim());

			const resAuth = await this.request('auth', this.agent.get(url).accept('html'));

			url = decode(FORM_REGEX.exec(resAuth.text)![1]!.trim());

			const resDone = await this.request('done', this.agent.post(url).type('form'));

			url = decode(FORM_REGEX.exec(resDone.text)![1]!.trim());
			let matches = INPUT_REGEX.exec(resDone.text);
			const data: any = {};
			while (matches !== null) {
				data[matches[1]!] = matches[2];
				matches = INPUT_REGEX.exec(resDone.text);
			}

			await this.request('post', this.agent.post(url).type('form').send(data));

			const resUser = await this.request('user', this.agent.get(URL_USER));

			url = `${URL_SHIPMENTS}/user/${resUser.body.userIdentifier}`;

			const resShipmentReq = await this.request('shipments-req', this.agent.get(url));

			url = `${URL_SHIPMENTS}/result/${resShipmentReq.body}`;

			let resShipments = await this.request('shipments', this.agent.get(url));
			for (let i = 0; i < 5; i++) {
				if (resShipments.body.status === 'DONE') {
					break;
				}
				await new Promise<void>((res) => setTimeout(res, 1000));
				resShipments = await this.request('shipments', this.agent.get(url));
			}
			if (resShipments.body.status !== 'DONE') {
				throw new Error('Shipment status did not change to DONE');
			}

			const shipments: any[] = resShipments.body.shipments;
			this.shipments = shipments
				.filter((s) => s.shipment.globalStatus !== 'DELIVERED')
				.map(({ shipment }) => ({
					id: shipment.formattedShipmentNumber,
					arrival: shipment.calculatedDeliveryDate,
					sender: shipment.debitorDescription
				}));
		} catch (err) {
			this.error(err);
		}
	};

	private request = async (name: string, req: superagent.SuperAgentRequest) => {
		// this.log(name, req.method, req.url.substring(0, 150));
		const resp = await req;
		/*for (const url of resp.redirects) {
			this.log(name, '-->', url.substring(0, 150));
		}*/
		this.log(name, 'status:', resp.status);
		return resp;
	};
}
