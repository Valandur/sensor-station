import { r as redirect, e as error } from './index-39e97e00.js';
import { C as Counter } from './counter-b37d52dc.js';
import { differenceInSeconds, parseISO } from 'date-fns';
import { google } from 'googleapis';
import { b as private_env } from './shared-server-b7e48788.js';
import { L as Logger } from './logger-515117da.js';
import 'node:util';
import 'chalk';

const ENABLED = private_env.CALENDAR_ENABLED === "1";
const CACHE_TIME = Number(private_env.CALENDAR_CACHE_TIME);
const CALENDAR_ID = private_env.CALENDAR_GOOGLE_CALENDAR_ID;
const PRIVATE_KEY = private_env.CALENDAR_GOOGLE_PRIVATE_KEY;
const SERVICE_EMAIL = private_env.CALENDAR_GOOGLE_SERVICE_EMAIL;
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const logger = new Logger("CALENDAR");
let events = [];
let cachedAt = /* @__PURE__ */ new Date(0);
async function getEvents() {
  if (!ENABLED) {
    throw error(400, { message: "Calendar module is disabled", key: "calendar.disabled" });
  }
  if (differenceInSeconds(/* @__PURE__ */ new Date(), cachedAt) <= CACHE_TIME) {
    logger.debug("Using cached events");
    return events;
  }
  logger.debug("Updating...");
  const startTime = process.hrtime.bigint();
  try {
    const jwtClient = new google.auth.JWT(SERVICE_EMAIL, void 0, PRIVATE_KEY, SCOPES);
    const calendar = google.calendar({ version: "v3", auth: jwtClient });
    const res = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: (/* @__PURE__ */ new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime"
    });
    const items = res.data.items || [];
    const newEvents = [];
    for (const event of items) {
      const start = event.start?.dateTime || event.start?.date;
      const end = event.end?.dateTime || event.end?.date;
      if (!start || !end || !event.summary) {
        continue;
      }
      newEvents?.push({
        tsStart: parseISO(start),
        tsEnd: parseISO(end),
        content: event.summary,
        isWholeDay: !!event.start?.date
      });
    }
    events = newEvents;
    cachedAt = /* @__PURE__ */ new Date();
    return events;
  } catch (err) {
    throw logger.toSvelteError(err);
  } finally {
    const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
    logger.info("Updated", diffTime, "ms");
  }
}
const MAX_ITEMS = 6;
const counter = new Counter();
const load = async ({ url, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  const allEvents = await getEvents();
  counter.max = allEvents.length;
  let page = Number(url.searchParams.get("page") || "-");
  if (!isFinite(page)) {
    page = 0;
  }
  const events2 = allEvents.slice(page, page + MAX_ITEMS);
  const dataParent = await parent();
  return {
    events: events2,
    nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${page > 0 ? page - 1 : 0}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 11;
const component = async () => (await import('./_page.svelte-3a7dc90c.js')).default;
const server_id = "src/routes/screens/calendar/+page.server.ts";
const imports = ["_app/immutable/chunks/11.4d2b1f60.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/navigation.d8aaec51.js","_app/immutable/chunks/singletons.c8def28c.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.14f81d0e.js","_app/immutable/chunks/index.4a6b61a9.js"];
const stylesheets = ["_app/immutable/assets/11.bcff2c87.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-13e10569.js.map
