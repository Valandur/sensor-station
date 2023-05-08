import { r as redirect, e as error } from './index-39e97e00.js';
import { C as Counter } from './counter-b37d52dc.js';
import { parseISO } from 'date-fns';
import { Parser } from 'xml2js';
import superagent from 'superagent';
import { b as private_env } from './shared-server-b7e48788.js';
import { B as BaseCache } from './BaseCache-8b1d2e36.js';
import { B as BaseLogger } from './BaseLogger-d23f9d0c.js';
import 'node:util';
import 'chalk';

const ENABLED = private_env.SBB_ENABLED === "1";
const CACHE_TIME = Number(private_env.SBB_CACHE_TIME);
const WORDS = private_env.SBB_KEYWORDS.split(",");
const API_KEY = private_env.SBB_API_KEY;
const URL = "https://api.opentransportdata.swiss/siri-sx";
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
    const { text } = await superagent.get(URL).set("Authorization", `Bearer ${API_KEY}`);
    const parser = new Parser({ async: true });
    const res = await parser.parseStringPromise(text);
    const sits = res.Siri.ServiceDelivery[0].SituationExchangeDelivery[0].Situations[0].PtSituationElement;
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
      alerts
    };
  });
}
function alertIsRelevant(text) {
  return WORDS.some((w) => text.includes(w));
}
function getTextDE(texts) {
  return texts?.find((s) => s["$"]["xml:lang"] === "DE")?.["_"];
}
const counter = new Counter();
const load = async ({ url, parent }) => {
  const data = await getData();
  counter.max = data.alerts.length;
  let page = Number(url.searchParams.get("page") || "-");
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const alert = data.alerts[page];
  const dataParent = await parent();
  if (!alert && dataParent.skipScreen) {
    throw redirect(302, dataParent.skipScreen);
  }
  return {
    alert,
    nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 14;
const component = async () => (await import('./_page.svelte-9967a835.js')).default;
const server_id = "src/routes/screens/sbb/+page.server.ts";
const imports = ["_app/immutable/chunks/14.46579777.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/navigation.7746a0bd.js","_app/immutable/chunks/singletons.850aac70.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/EmptyCard.46c04464.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-531701ef.js.map
