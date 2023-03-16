"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SBB = void 0;
const axios_1 = __importDefault(require("axios"));
const date_fns_1 = require("date-fns");
const xml2js_1 = require("xml2js");
const service_1 = require("./service");
const KEY = process.env['SBB_API_KEY'] || '';
const URL = 'https://api.opentransportdata.swiss/siri-sx';
class SBB extends service_1.Service {
    timer = null;
    parser = new xml2js_1.Parser({ async: true });
    updatedAt = null;
    alerts = null;
    async doInit() { }
    async doStart() {
        await this.update();
        if (process.env['SBB_UPDATE_INTERVAL']) {
            const interval = 1000 * Number(process.env['SBB_UPDATE_INTERVAL']);
            this.timer = setInterval(this.update, interval);
            this.log('UPDATE STARTED', interval);
        }
        else {
            this.log('UPDATE DISABLED');
        }
    }
    async doStop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.updatedAt = null;
        this.alerts = null;
    }
    async doDispose() { }
    update = async () => {
        try {
            const { data } = await axios_1.default.request({
                method: 'GET',
                url: URL,
                headers: {
                    Authorization: `Bearer ${KEY}`
                }
            });
            const res = await this.parser.parseStringPromise(data);
            const sits = res.Siri.ServiceDelivery[0].SituationExchangeDelivery[0].Situations[0].PtSituationElement;
            const alerts = sits.map((i) => {
                const pubAct = i.PublishingActions[0].PublishingAction[0];
                const textCont = pubAct.PassengerInformationAction[0].TextualContent;
                const pub = textCont.find((c) => c.TextualContentSize[0] === 'S');
                return {
                    start: (0, date_fns_1.parseISO)(i.ValidityPeriod[0].StartTime[0]),
                    end: (0, date_fns_1.parseISO)(i.ValidityPeriod[0].EndTime[0]),
                    planned: i.Planned?.[0] === 'true',
                    summary: pub.SummaryContent?.[0].SummaryText.find((s) => s['$']['xml:lang'] === 'DE')?.['_'],
                    reason: pub.ReasonContent?.[0].ReasonText.find((s) => s['$']['xml:lang'] === 'DE')?.['_'],
                    description: pub.DescriptionContent?.[0].DescriptionText.find((s) => s['$']['xml:lang'] === 'DE')?.['_'],
                    consequence: pub.ConsequenceContent?.[0].ConsequenceText.find((s) => s['$']['xml:lang'] === 'DE')?.['_'],
                    duration: pub.DurationContent?.[0].DurationText.find((s) => s['$']['xml:lang'] === 'DE')?.['_'],
                    recommendation: pub.RecommendationContent?.[0].RecommendationText.find((s) => s['$']['xml:lang'] === 'DE')?.['_'],
                    affects: i.Affects
                };
            });
            this.alerts = alerts.filter((a) => !a.planned);
        }
        catch (err) {
            this.error(err);
        }
    };
}
exports.SBB = SBB;
//# sourceMappingURL=sbb.js.map