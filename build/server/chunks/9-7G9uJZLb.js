import { r as redirect, e as error } from './index-C-arhqvZ.js';
import { C as Counter } from './counter-BozXqImb.js';
import { google } from 'googleapis';
import { parseISO } from 'date-fns';
import { d as private_env } from './shared-server-BfUoNEXY.js';
import { B as BaseCache } from './BaseCache-BtPY9_DY.js';
import { B as BaseLogger } from './BaseLogger-B58-fQ4u.js';
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
  if (!ENABLED) {
    throw error(400, {
      message: `Calendar is disabled`,
      key: "calendar.disabled"
    });
  }
  return cache.withDefault(forceUpdate, async () => {
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
const counter = new Counter({
  maxSliceSize: 6
});
const load = async ({ url, parent }) => {
  const data = await getData();
  counter.max = data.events.length;
  let page = Number(url.searchParams.get("page") || "---");
  if (!isFinite(page)) {
    page = 0;
  }
  const events = counter.slice(data.events, page);
  const dataParent = await parent();
  if (!events && dataParent.skipScreen) {
    throw redirect(302, dataParent.skipScreen);
  }
  return {
    events,
    nextPage: `${dataParent.currScreen}&page=${counter.fit(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${page > 0 ? page - 1 : 0}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-xXHexo7a.js')).default;
const server_id = "src/routes/screens/calendar/+page.server.ts";
const imports = ["_app/immutable/nodes/9.BNDgDS6w.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/entry.B8Kgx2WW.js","_app/immutable/chunks/index.DknyqqiT.js","_app/immutable/chunks/swipe.CFeUBoSp.js","_app/immutable/chunks/EmptyCard.h6hF05-m.js","_app/immutable/chunks/format.CJrgGK3Q.js","_app/immutable/chunks/de.oFxG6rdj.js"];
const stylesheets = ["_app/immutable/assets/9.De4OaMi5.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-7G9uJZLb.js.map
