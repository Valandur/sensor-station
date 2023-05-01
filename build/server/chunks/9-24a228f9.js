import { r as redirect, e as error } from './index-39e97e00.js';
import { C as Counter } from './counter-b37d52dc.js';
import { differenceInSeconds, parseISO } from 'date-fns';
import { b as private_env } from './shared-server-b7e48788.js';
import { google } from 'googleapis';

const ENABLED = private_env.CALENDAR_ENABLED === "1";
const CACHE_TIME = Number(private_env.CALENDAR_CACHE_TIME);
const CALENDAR_ID = private_env.CALENDAR_GOOGLE_CALENDAR_ID;
const PRIVATE_KEY = private_env.CALENDAR_GOOGLE_PRIVATE_KEY;
const SERVICE_EMAIL = private_env.CALENDAR_GOOGLE_SERVICE_EMAIL;
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
let events = [];
let cachedAt = /* @__PURE__ */ new Date(0);
async function getEvents() {
  if (differenceInSeconds(/* @__PURE__ */ new Date(), cachedAt) <= CACHE_TIME) {
    return events;
  }
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
}
const MAX_ITEMS = 7;
const counter = new Counter();
const load = async ({ url, parent }) => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  let page = Number(url.searchParams.get("page") || "-");
  const allEvents = await getEvents().catch((err) => error(500, err.message));
  if (!("length" in allEvents)) {
    console.error(allEvents);
    throw allEvents;
  }
  counter.max = allEvents.length;
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

const index = 9;
const component = async () => (await import('./_page.svelte-b260efbd.js')).default;
const server_id = "src/routes/(main)/screens/calendar/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-calendar-page.svelte.b237f8b0.js","_app/immutable/chunks/index.376c5e2b.js","_app/immutable/chunks/navigation.6e6e069a.js","_app/immutable/chunks/singletons.c456eda6.js","_app/immutable/chunks/index.5120e63e.js","_app/immutable/chunks/index.2900bf3d.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/index.4a6b61a9.js","_app/immutable/chunks/index.14f81d0e.js"];
const stylesheets = ["_app/immutable/assets/_page.7bfe97d4.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-24a228f9.js.map
