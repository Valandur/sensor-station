import { r as redirect, e as error } from './index-39e97e00.js';
import { C as Counter } from './counter-b37d52dc.js';
import { differenceInSeconds, parseISO } from 'date-fns';
import { b as private_env } from './shared-server-b7e48788.js';
import { Parser } from 'xml2js';
import superagent from 'superagent';

const ENABLED = private_env.SBB_ENABLED === "1";
const CACHE_TIME = Number(private_env.SBB_CACHE_TIME);
const WORDS = (private_env.SBB_KEYWORDS || "ZH,Zürich,Zurich").split(",");
const API_KEY = private_env.SBB_API_KEY;
const URL = "https://api.opentransportdata.swiss/siri-sx";
let alerts = [];
let cachedAt = /* @__PURE__ */ new Date(0);
async function getAlerts() {
  if (differenceInSeconds(/* @__PURE__ */ new Date(), cachedAt) <= CACHE_TIME) {
    return alerts;
  }
  const { text } = await superagent.get(URL).set("Authorization", `Bearer ${API_KEY}`);
  const parser = new Parser({ async: true });
  const res = await parser.parseStringPromise(text);
  const sits = res.Siri.ServiceDelivery[0].SituationExchangeDelivery[0].Situations[0].PtSituationElement;
  const newAlerts = [];
  for (const sit of sits) {
    if (!alertIsRelevant(JSON.stringify(sit))) {
      continue;
    }
    const actions = sit.PublishingActions[0].PublishingAction[0];
    const pubs = actions.PassengerInformationAction[0].TextualContent;
    const pub = pubs.find((c) => c.TextualContentSize[0] === "S");
    if (!pub) {
      continue;
    }
    newAlerts.push({
      start: parseISO(sit.ValidityPeriod[0].StartTime[0]),
      end: parseISO(sit.ValidityPeriod[0].EndTime[0]),
      planned: sit.Planned?.[0] === "true",
      summary: getTextDE(pub.SummaryContent[0].SummaryText),
      reason: getTextDE(pub.ReasonContent?.[0].ReasonText),
      description: getTextDE(pub.DescriptionContent?.[0].DescriptionText),
      consequence: getTextDE(pub.ConsequenceContent?.[0].ConsequenceText),
      duration: getTextDE(pub.DurationContent?.[0].DurationText),
      recommendation: getTextDE(pub.RecommendationContent?.[0].RecommendationText)
    });
  }
  alerts = newAlerts.filter((a) => !a.planned);
  cachedAt = /* @__PURE__ */ new Date();
  return alerts;
}
function alertIsRelevant(text) {
  return WORDS.some((w) => text.includes(w));
}
function getTextDE(texts) {
  return texts?.find((s) => s["$"]["xml:lang"] === "DE")?.["_"];
}
const counter = new Counter();
const load = async ({ url, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  let page = Number(url.searchParams.get("page") || "-");
  const alerts2 = await getAlerts().catch((err) => error(500, err.message));
  if (!("length" in alerts2)) {
    console.error(alerts2);
    throw alerts2;
  }
  counter.max = alerts2.length;
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const alert = alerts2[page];
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
const component = async () => (await import('./_page.svelte-d2a4622d.js')).default;
const server_id = "src/routes/(main)/screens/sbb/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-sbb-page.svelte.7fe8887e.js","_app/immutable/chunks/index.376c5e2b.js","_app/immutable/chunks/navigation.108c7480.js","_app/immutable/chunks/singletons.36913a33.js","_app/immutable/chunks/index.5120e63e.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-d326867d.js.map
