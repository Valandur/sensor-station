import { r as redirect } from './index-H42hWO6o.js';
import { isAfter } from 'date-fns';
import { C as Counter } from './counter-Dt35QKyi.js';
import { g as getData } from './data5-Szczk3u3.js';
import 'xml2js';
import 'superagent';
import './shared-server-49TKSBDM.js';
import './BaseCache-CtKtXkXQ.js';
import './BaseLogger-SyOYFtXW.js';
import 'node:util';
import 'chalk';

const counter = new Counter({
  maxSliceSize: 6
});
const load = async ({ url, parent }) => {
  const data = await getData();
  const now = /* @__PURE__ */ new Date();
  const allDepartures = data.departures.filter((d) => isAfter(d.estimated, now));
  counter.max = allDepartures.length;
  let page = Number(url.searchParams.get("page") || "---");
  if (!isFinite(page)) {
    page = 0;
  }
  const departures = counter.slice(allDepartures, page);
  const dataParent = await parent();
  if (!departures && dataParent.skipScreen) {
    throw redirect(302, dataParent.skipScreen);
  }
  return {
    departures,
    nextPage: `${dataParent.currScreen}&page=${counter.fit(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.fit(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 16;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-pr9IWIqH.js')).default;
const server_id = "src/routes/screens/sbb/departures/+page.server.ts";
const imports = ["_app/immutable/nodes/16.-Y5kyrD5.js","_app/immutable/chunks/4.3xRaw29T.js","_app/immutable/chunks/index.wgffNSnY.js","_app/immutable/chunks/each.6w4Ej4nR.js","_app/immutable/chunks/entry.wt3AcDH9.js","_app/immutable/chunks/index.-WvGjXqt.js","_app/immutable/chunks/swipe.ysJLwxnX.js","_app/immutable/chunks/EmptyCard.i7c96Gnh.js","_app/immutable/chunks/format.-3CDNjnq.js","_app/immutable/chunks/de.5ejuWyRG.js","_app/immutable/chunks/constructFrom.5xxej_j7.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-rJQJsRBh.js.map
