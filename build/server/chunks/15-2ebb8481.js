import { r as redirect, e as error } from './index-39e97e00.js';
import { C as Counter } from './counter-b37d52dc.js';
import { decode } from 'html-entities';
import { d as dev } from './environment-19782cc3.js';
import { differenceInSeconds } from 'date-fns';
import superagent from 'superagent';
import { b as private_env } from './shared-server-b7e48788.js';
import { L as Logger } from './logger-515117da.js';
import './prod-ssr-17392843.js';
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
const logger = new Logger("POST");
let shipments = [];
let cachedAt = /* @__PURE__ */ new Date(0);
async function getShipments() {
  if (!ENABLED) {
    throw error(400, { message: "Post module is disabled", key: "post.disabled" });
  }
  if (differenceInSeconds(/* @__PURE__ */ new Date(), cachedAt) <= CACHE_TIME) {
    logger.debug("Using cached shipments");
    return shipments;
  }
  logger.debug("Updating...");
  const startTime = process.hrtime.bigint();
  try {
    await updateTexts();
    const agent = superagent.agent().withCredentials();
    const resPre = await request("pre", agent.get(URL_START).accept("html"));
    let rawUrl = FORM_REGEX.exec(resPre.text)?.[1]?.trim();
    if (!rawUrl) {
      throw error(500, { message: "Could not find login form", key: "post.loginFormNotFound" });
    }
    let url = decode(rawUrl);
    const resStart = await request(
      "start",
      agent.post(url).type("form").send({ externalIDP: "externalIDP" })
    );
    const redir = resStart.redirects.pop();
    if (!redir) {
      throw error(500, { message: "Missing redirect URL", key: "post.missingRedirectUrl" });
    }
    const params = new URL(redir).searchParams.toString();
    url = `${URL_INIT}?${params}`;
    const resInit = await request("init", agent.post(url).type("json").send({}));
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
    rawUrl = FORM_REGEX.exec(resAuth.text)?.[1]?.trim();
    if (!rawUrl) {
      throw error(500, { message: "Could not find auth form", key: "post.authFormNotFound" });
    }
    url = decode(rawUrl);
    const resDone = await request("done", agent.post(url).type("form"));
    rawUrl = FORM_REGEX.exec(resDone.text)?.[1]?.trim();
    if (!rawUrl) {
      throw error(500, { message: "Could not find submit form", key: "post.submitFormNotFound" });
    }
    url = decode(rawUrl);
    let matches = INPUT_REGEX.exec(resDone.text);
    const data = {};
    while (matches !== null) {
      data[matches[1]] = matches[2];
      matches = INPUT_REGEX.exec(resDone.text);
    }
    await request("post", agent.post(url).type("form").send(data));
    const resUser = await request("user", agent.get(URL_USER));
    url = `${URL_SHIPMENTS}/user/${resUser.body.userIdentifier}`;
    const resShipmentReq = await request("shipments-req", agent.get(url));
    url = `${URL_SHIPMENTS}/result/${resShipmentReq.body}`;
    let resShipments = await request("shipments", agent.get(url));
    for (let i = 0; i < 5; i++) {
      if (resShipments.body.status === "DONE") {
        break;
      }
      await new Promise((res) => setTimeout(res, 1e3));
      resShipments = await request("shipments", agent.get(url));
    }
    if (resShipments.body.status !== "DONE") {
      throw error(500, {
        message: "Shipment query status did not change to DONE",
        key: "post.shipmentQueryFailed",
        params: { status: resShipments.body.status }
      });
    }
    const rawShipments = resShipments.body.shipments;
    const newShipments = rawShipments.filter((s) => s.shipment.globalStatus !== "DELIVERED").map(({ shipment }) => {
      const phys = shipment.physicalProperties;
      return {
        id: shipment.identity,
        number: shipment.formattedShipmentNumber,
        type: shipment.internationalProduct ? getText(shipment.internationalProduct) : getText(shipment.product),
        arrival: shipment.calculatedDeliveryDate || null,
        status: null,
        sender: shipment.debitorDescription,
        dims: phys.dimension1 ? { x: phys.dimension1, y: phys.dimension2, z: phys.dimension3 } : null,
        weight: phys.weight || null
      };
    });
    for (const shipment of newShipments) {
      const events = await request(
        `events-${shipment.number}`,
        agent.get(URL_EVENTS.replace("$id", shipment.id))
      );
      const event = events.body[0];
      if (!event) {
        continue;
      }
      shipment.status = getText(event.eventCode);
    }
    if (dev && newShipments.length === 0)
      ;
    shipments = newShipments;
    cachedAt = /* @__PURE__ */ new Date();
    return shipments;
  } catch (err) {
    throw logger.toSvelteError(err);
  } finally {
    const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
    logger.info("Updated", diffTime, "ms");
  }
}
async function request(name, req) {
  logger.debug(name, req.method, req.url.substring(0, 150));
  try {
    const resp = await req;
    for (const url of resp.redirects) {
      logger.debug(name, "-->", url.substring(0, 150));
    }
    logger.debug(name, "status:", resp.status);
    return resp;
  } catch (err) {
    logger.warn(name, err.response?.body);
    throw err;
  }
}
let hasTexts = false;
const shipmentTexts = /* @__PURE__ */ new Map();
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
  return text || code;
}
function getRecursiveTexts(entry, splits, index) {
  const split = splits[index];
  if (!split) {
    let subEntry = entry;
    while (!subEntry[0]) {
      const nextSubEntry = entry[1].get("*");
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
const counter = new Counter();
const load = async ({ url, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  const shipments2 = await getShipments();
  counter.max = shipments2.length;
  let page = Number(url.searchParams.get("page") || "-");
  if (!isFinite(page)) {
    page = counter.increment();
  }
  const shipment = shipments2[page];
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

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 15;
const component = async () => (await import('./_page.svelte-21c8249f.js')).default;
const server_id = "src/routes/screens/post/+page.server.ts";
const imports = ["_app/immutable/chunks/15.3659f528.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/navigation.d8aaec51.js","_app/immutable/chunks/singletons.c8def28c.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/EmptyCard.46c04464.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-2ebb8481.js.map
