import { r as redirect, e as error } from './index-39e97e00.js';
import { C as Counter } from './counter-b37d52dc.js';
import { google } from 'googleapis';
import { parseISO } from 'date-fns';
import { b as private_env } from './shared-server-b7e48788.js';
import { B as BaseCache } from './BaseCache-8b1d2e36.js';
import { B as BaseLogger } from './BaseLogger-d23f9d0c.js';
import 'node:util';
import 'chalk';

const ENABLED = private_env.CALENDAR_ENABLED === "1";
const CACHE_TIME = Number(private_env.CALENDAR_CACHE_TIME);
const CALENDAR_ID = private_env.CALENDAR_GOOGLE_CALENDAR_ID;
const PRIVATE_KEY = private_env.CALENDAR_GOOGLE_PRIVATE_KEY;
const SERVICE_EMAIL = private_env.CALENDAR_GOOGLE_SERVICE_EMAIL;
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const logger = new BaseLogger("CALENDAR");
const cache = new BaseCache(logger, CACHE_TIME);
async function getData(forceUpdate = false) {
  return cache.withDefault(forceUpdate, async () => {
    if (!ENABLED) {
      throw error(400, {
        message: `Calendar is disabled`,
        key: "calendar.disabled"
      });
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
    const events = [];
    for (const event of items) {
      const start = event.start?.dateTime || event.start?.date;
      const end = event.end?.dateTime || event.end?.date;
      if (!start || !end || !event.summary) {
        continue;
      }
      events.push({
        tsStart: parseISO(start),
        tsEnd: parseISO(end),
        content: event.summary,
        isWholeDay: !!event.start?.date
      });
    }
    return {
      ts: /* @__PURE__ */ new Date(),
      events
    };
  });
}
const MAX_ITEMS = 6;
const counter = new Counter();
const load = async ({ url, parent }) => {
  const data = await getData();
  counter.max = data.events.length;
  let page = Number(url.searchParams.get("page") || "-");
  if (!isFinite(page)) {
    page = 0;
  }
  const events = data.events.slice(page, page + MAX_ITEMS);
  const dataParent = await parent();
  if (!events && dataParent.skipScreen) {
    throw redirect(302, dataParent.skipScreen);
  }
  return {
    events,
    nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${page > 0 ? page - 1 : 0}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 9;
const component = async () => (await import('./_page.svelte-09acba63.js')).default;
const server_id = "src/routes/screens/calendar/+page.server.ts";
const imports = ["_app/immutable/chunks/9.5360cd40.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/index.931f9fab.js","_app/immutable/chunks/navigation.dad157d9.js","_app/immutable/chunks/singletons.f142e14a.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/swipe.f8763146.js","_app/immutable/chunks/EmptyCard.46c04464.js","_app/immutable/chunks/index.14f81d0e.js","_app/immutable/chunks/index.4a6b61a9.js"];
const stylesheets = ["_app/immutable/assets/9.bcff2c87.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-96502452.js.map
