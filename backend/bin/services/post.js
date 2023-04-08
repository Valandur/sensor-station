"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const superagent_1 = __importDefault(require("superagent"));
const html_entities_1 = require("html-entities");
const service_1 = require("./service");
const URL_START = 'https://account.post.ch/idp/?targetURL=https%3A%2F%2Fservice.post.ch%2Fekp-web%2Fsecure%2F%3Flang%3Den%26service%3Dekp%26app%3Dekp&lang=en&service=ekp&inIframe=&inMobileApp=';
const URL_INIT = 'https://login.swissid.ch/api-login/authenticate/init';
const URL_LOGIN = 'https://login.swissid.ch/api-login/authenticate/basic';
const URL_ANOMALY = 'https://login.swissid.ch/api-login/anomaly-detection/device-print';
const FORM_REGEX = /<form .*?action="((?:.|\n)*?)"/i;
const INPUT_REGEX = /<input .*?name="(.*?)" .*?value="(.*?)".*?\/>/gi;
const URL_USER = 'https://service.post.ch/ekp-web/api/user';
const URL_SHIPMENTS = 'https://service.post.ch/ekp-web/secure/api/shipment/mine';
const URL_EVENTS = 'https://service.post.ch/ekp-web/secure/api/shipment/id/$id/events/';
const URL_TEXTS = 'https://service.post.ch/ekp-web/core/rest/translations/de/shipment-text-messages';
class Post extends service_1.Service {
    username = process.env['POST_USERNAME'] || '';
    password = process.env['POST_PASSWORD'] || '';
    agent = superagent_1.default.agent().withCredentials();
    shipmentTexts = new Map();
    shipments = null;
    async doInit() { }
    async doStart() {
        this.shipments = null;
        const resTexts = await this.request('texts', this.agent.get(URL_TEXTS));
        const texts = resTexts.body['shipment-text--'];
        for (const [key, value] of Object.entries(texts)) {
            const splits = key.split('.');
            let entry = ['', this.shipmentTexts];
            while (splits.length > 0) {
                const split = splits.shift();
                let subEntry = entry[1].get(split);
                if (typeof subEntry === 'undefined') {
                    subEntry = ['', new Map()];
                    entry[1].set(split, subEntry);
                }
                entry = subEntry;
            }
            entry[0] = value.trim();
        }
    }
    async doUpdate() {
        const resPre = await this.request('pre', this.agent.get(URL_START).accept('html'));
        let url = (0, html_entities_1.decode)(FORM_REGEX.exec(resPre.text)[1].trim());
        const resStart = await this.request('start', this.agent.post(url).type('form').send({ externalIDP: 'externalIDP' }));
        const params = new URL(resStart.redirects.pop()).searchParams.toString();
        url = `${URL_INIT}?${params}`;
        const resInit = await this.request('init', this.agent.post(url).type('json').send({}));
        url = `${URL_LOGIN}?${params}`;
        let authId = resInit.body.tokens.authId;
        const loginData = { username: this.username, password: this.password };
        const resBasic = await this.request('basic', this.agent.post(url).type('json').set('authId', authId).send(loginData));
        authId = resBasic.body.tokens.authId;
        url = `${URL_ANOMALY}?${params}`;
        const resAnomaly = await this.request('anomaly', this.agent.post(url).type('json').set('authId', authId).send({}));
        url = decodeURI(resAnomaly.body.nextAction.successUrl.trim());
        const resAuth = await this.request('auth', this.agent.get(url).accept('html'));
        url = (0, html_entities_1.decode)(FORM_REGEX.exec(resAuth.text)[1].trim());
        const resDone = await this.request('done', this.agent.post(url).type('form'));
        url = (0, html_entities_1.decode)(FORM_REGEX.exec(resDone.text)[1].trim());
        let matches = INPUT_REGEX.exec(resDone.text);
        const data = {};
        while (matches !== null) {
            data[matches[1]] = matches[2];
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
            await new Promise((res) => setTimeout(res, 1000));
            resShipments = await this.request('shipments', this.agent.get(url));
        }
        if (resShipments.body.status !== 'DONE') {
            throw new Error('Shipment status did not change to DONE');
        }
        const rawShipments = resShipments.body.shipments;
        const shipments = rawShipments
            .filter((s) => s.shipment.globalStatus !== 'DELIVERED')
            .map(({ shipment }) => {
            const phys = shipment.physicalProperties;
            return {
                id: shipment.identity,
                number: shipment.formattedShipmentNumber,
                type: shipment.internationalProduct
                    ? this.getText(shipment.internationalProduct)
                    : this.getText(shipment.product),
                arrival: shipment.calculatedDeliveryDate || null,
                status: null,
                sender: shipment.debitorDescription,
                dims: phys.dimension1 ? { x: phys.dimension1, y: phys.dimension2, z: phys.dimension3 } : null,
                weight: phys.weight || null
            };
        });
        for (const shipment of shipments) {
            const events = await this.request(`events-${shipment.number}`, this.agent.get(URL_EVENTS.replace('$id', shipment.id)));
            const event = events.body[0];
            if (!event) {
                continue;
            }
            shipment.status = this.getText(event.eventCode);
        }
        if (this.isDebug && shipments.length === 0) {
            this.warn('Updating in DEBUG mode');
            shipments.push({
                id: '__unknown__',
                number: '99.xx.yyyyyy.zzzzzzzz',
                type: 'PostPac Priority',
                arrival: '2023-03-29T00:00:00+02:00',
                status: null,
                sender: 'Digitec Galaxus AG',
                dims: { x: 310, y: 240, z: 215 },
                weight: 4320
            }, {
                id: '__unknown__',
                number: '88.xx.yyyyyy.zzzzzzzz',
                type: 'International PostPac Priority',
                arrival: null,
                status: 'Verzollungsprozess',
                sender: 'Digitec Galaxus AG',
                dims: { x: 310, y: 240, z: 215 },
                weight: 4320
            });
        }
        this.shipments = shipments;
    }
    async doStop() {
        this.shipments = null;
    }
    async doDispose() { }
    request = async (name, req) => {
        // this.log(name, req.method, req.url.substring(0, 150));
        const resp = await req;
        /*for (const url of resp.redirects) {
            this.log(name, '-->', url.substring(0, 150));
        }*/
        this.log(name, 'status:', resp.status);
        return resp;
    };
    getText = (code) => {
        let splits = code.split('.');
        let entry = ['', this.shipmentTexts];
        const text = this.getRecursiveTexts(entry, splits, 0);
        return text || code;
    };
    getRecursiveTexts = (entry, splits, index) => {
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
    };
}
exports.Post = Post;
//# sourceMappingURL=post.js.map