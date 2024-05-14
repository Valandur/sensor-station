import { r as redirect, e as error } from './index-C-arhqvZ.js';
import { C as Counter, a as CounterType } from './counter-BozXqImb.js';
import { decode } from 'html-entities';
import superagent from 'superagent';
import { d as private_env } from './shared-server-BfUoNEXY.js';
import { B as BaseCache } from './BaseCache-BtPY9_DY.js';
import { B as BaseLogger } from './BaseLogger-B58-fQ4u.js';
import 'date-fns';
import 'node:util';
import 'chalk';

const ENABLED = private_env.POST_ENABLED === "1";
const CACHE_TIME = Number(private_env.POST_CACHE_TIME);
const USERNAME = private_env.POST_USERNAME;
const PASSWORD = private_env.POST_PASSWORD;
const URL_START = "https://account.post.ch/idp/?targetURL=https%3A%2F%2Fservice.post.ch%2Fekp-web%2Fsecure%2F%3Flang%3Den%26service%3Dekp%26app%3Dekp&lang=en&service=ekp&inIframe=&inMobileApp=";
const URL_INIT = "https://login.swissid.ch/api-login/authenticate/init";
const URL_LOGIN = "https://login.swissid.ch/api-login/authenticate/basic";
const URL_ANOMALY = "https://login.swissid.ch/api-login/anomaly-detection/device-print";
const FORM_REGEX = /<form .*?action="((?:.|\n)*?)"/i;
const INPUT_REGEX = /<input .*?name="(.*?)" .*?value="(.*?)".*?\/>/gi;
const URL_USER = "https://service.post.ch/ekp-web/api/user";
const URL_SHIPMENTS = "https://service.post.ch/ekp-web/secure/api/shipment/mine";
const URL_EVENTS = "https://service.post.ch/ekp-web/secure/api/shipment/id/$id/events/";
const URL_TEXTS = "https://service.post.ch/ekp-web/core/rest/translations/de/shipment-text-messages";
const logger = new BaseLogger("POST");
const cache = new BaseCache(logger, CACHE_TIME);
let hasTexts = false;
const shipmentTexts = /* @__PURE__ */ new Map();
async function getData(forceUpdate = false) {
  if (!ENABLED) {
    throw error(400, {
      message: `Post is disabled`,
      key: "post.disabled"
    });
  }
  return cache.withDefault(forceUpdate, async () => {
    await updateTexts();
    const agent = superagent.agent().withCredentials();
    let url = URL_START;
    const resPre = await request("pre", agent.get(url).accept("html"));
    const redir = resPre.redirects.pop();
    if (!redir) {
      throw error(500, {
        message: "Missing redirect URL",
        key: "post.missingRedirectUrl"
      });
    }
    const params = new URL(redir).searchParams.toString();
    url = `${URL_INIT}?${params}`;
    const resInit = await request("init", agent.post(url).type("json").send({}));
    logger.debug("next_action", resInit.body.nextAction?.type);
    url = `${URL_LOGIN}?${params}`;
    let authId = resInit.body.tokens.authId;
    const loginData = { username: USERNAME, password: PASSWORD };
    const resBasic = await request(
      "basic",
      agent.post(url).type("json").set("authId", authId).send(loginData)
    );
    authId = resBasic.body.tokens.authId;
    url = `${URL_ANOMALY}?${params}`;
    const resAnomaly = await request(
      "anomaly",
      agent.post(url).type("json").set("authId", authId).send({})
    );
    url = decodeURI(resAnomaly.body.nextAction.successUrl.trim());
    const resAuth = await request("auth", agent.get(url).accept("html"));
    let rawUrl = FORM_REGEX.exec(resAuth.text)?.[1]?.trim();
    if (!rawUrl) {
      throw error(500, {
        message: "Could not find auth form",
        key: "post.authFormNotFound"
      });
    }
    url = decode(rawUrl);
    const resDone = await request("done", agent.post(url).type("form"));
    rawUrl = FORM_REGEX.exec(resDone.text)?.[1]?.trim();
    if (!rawUrl) {
      throw error(500, {
        message: "Could not find submit form",
        key: "post.submitFormNotFound"
      });
    }
    url = decode(rawUrl);
    let matches = INPUT_REGEX.exec(resDone.text);
    const data = {};
    while (matches !== null) {
      data[matches[1]] = matches[2];
      matches = INPUT_REGEX.exec(resDone.text);
    }
    await request("post", agent.post(url).type("form").send(data));
    const resUser = await request("user", agent.get(URL_USER).set("Accept", "application/json"));
    url = `${URL_SHIPMENTS}/user/${resUser.body.userIdentifier}`;
    const resShipmentReq = await request(
      "shipments-req",
      agent.get(url).set("Accept", "application/json")
    );
    url = `${URL_SHIPMENTS}/result/${resShipmentReq.body}`;
    let resShipments = await request("shipments", agent.get(url).set("Accept", "application/json"));
    for (let i = 0; i < 5; i++) {
      if (resShipments.body.status === "DONE") {
        break;
      }
      await new Promise((res) => setTimeout(res, 1e3));
      resShipments = await request("shipments", agent.get(url).set("Accept", "application/json"));
    }
    if (resShipments.body.status !== "DONE") {
      throw error(500, {
        message: "Shipment query status did not change to DONE",
        key: "post.shipmentQueryFailed",
        params: { status: resShipments.body.status }
      });
    }
    const rawShipments = resShipments.body.shipments;
    const shipments = rawShipments.filter((s) => s.shipment.globalStatus !== "DELIVERED").map(({ shipment }) => {
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
        number: shipment.formattedShipmentNumber ?? "-- unbekannt --",
        type,
        arrival: shipment.calculatedDeliveryDate ?? null,
        status: null,
        sender: shipment.debitorDescription ?? null,
        dims: phys.dimension1 ? { x: phys.dimension1, y: phys.dimension2, z: phys.dimension3 } : null,
        weight: phys.weight ?? null
      };
    });
    for (const shipment of shipments) {
      const events = await request(
        `events-${shipment.number}`,
        agent.get(URL_EVENTS.replace("$id", shipment.id)).set("Accept", "application/json")
      );
      const event = events.body[0];
      if (!event) {
        continue;
      }
      shipment.status = getText(event.eventCode) || event.eventCode;
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      shipments
    };
  });
}
async function request(name, req) {
  logger.debug(name, req.method, req.url);
  try {
    const resp = await req;
    for (const url of resp.redirects) {
      logger.debug(name, "-->", url);
    }
    logger.debug(name, "status:", resp.status);
    return resp;
  } catch (err) {
    logger.warn(name, err.response?.body);
    throw err;
  }
}
async function updateTexts() {
  if (hasTexts) {
    return;
  }
  const resTexts = await superagent.get(URL_TEXTS);
  const texts = resTexts.body["shipment-text--"];
  for (const [key, value] of Object.entries(texts)) {
    const splits = key.split(".");
    let entry = ["", shipmentTexts];
    let split;
    while (split = splits.shift()) {
      let subEntry = entry[1].get(split);
      if (typeof subEntry === "undefined") {
        subEntry = ["", /* @__PURE__ */ new Map()];
        entry[1].set(split, subEntry);
      }
      entry = subEntry;
    }
    entry[0] = value.trim();
  }
  hasTexts = true;
}
function getText(code) {
  const splits = code.split(".");
  const entry = ["", shipmentTexts];
  const text = getRecursiveTexts(entry, splits, 0);
  return text;
}
function getRecursiveTexts(entry, splits, index) {
  const split = splits[index];
  if (!split) {
    let subEntry = entry;
    while (!subEntry[0]) {
      const nextSubEntry = subEntry[1].get("*");
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
  const generic = entry[1].get("*");
  if (generic) {
    const res = getRecursiveTexts(generic, splits, index + 1);
    if (res) {
      return res;
    }
  }
  return void 0;
}
const counter = new Counter({
  type: CounterType.Wrap
});
const load = async ({ url, parent }) => {
  const data = await getData();
  counter.max = data.shipments.length;
  let page = Number(url.searchParams.get("page") || "---");
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const shipment = data.shipments[page];
  const dataParent = await parent();
  if (!shipment && dataParent.skipScreen) {
    throw redirect(302, dataParent.skipScreen);
  }
  return {
    shipment,
    nextPage: `${dataParent.currScreen}&page=${counter.fit(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.fit(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 13;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte--l3wCiLL.js')).default;
const server_id = "src/routes/screens/post/+page.server.ts";
const imports = ["_app/immutable/nodes/13.Ziozeh6R.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js","_app/immutable/chunks/entry.uLdcenjk.js","_app/immutable/chunks/index.DknyqqiT.js","_app/immutable/chunks/swipe.CFeUBoSp.js","_app/immutable/chunks/EmptyCard.h6hF05-m.js","_app/immutable/chunks/Card.C7Fy4Ve5.js","_app/immutable/chunks/parseISO.Kab081GA.js","_app/immutable/chunks/de.oFxG6rdj.js","_app/immutable/chunks/format.CJrgGK3Q.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-Cc7xMP5R.js.map
