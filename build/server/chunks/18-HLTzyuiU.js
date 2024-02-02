import { r as redirect } from './index-H42hWO6o.js';
import { C as Counter, a as CounterType } from './counter-Dt35QKyi.js';
import { g as getData } from './data7-UZSvLTb2.js';
import 'node:fs/promises';
import 'superagent';
import './shared-server-49TKSBDM.js';
import './BaseCache-CtKtXkXQ.js';
import 'date-fns';
import './BaseLogger-SyOYFtXW.js';
import 'node:util';
import 'chalk';
import './data2-j1H-xDgc.js';
import 'geo-tz';
import 'serialport';

const counter = new Counter({
  type: CounterType.Wrap
});
const load = async ({ url, parent }) => {
  const data = await getData();
  counter.max = data.alerts.length;
  let page = Number(url.searchParams.get("page") || "---");
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
    location: data.location,
    nextPage: `${dataParent.currScreen}&page=${counter.fit(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.fit(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 18;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-vKfJhyfZ.js')).default;
const server_id = "src/routes/screens/weather/alerts/+page.server.ts";
const imports = ["_app/immutable/nodes/18.3J8bxLoC.js","_app/immutable/chunks/4.3xRaw29T.js","_app/immutable/chunks/index.wgffNSnY.js","_app/immutable/chunks/each.6w4Ej4nR.js","_app/immutable/chunks/entry.wt3AcDH9.js","_app/immutable/chunks/index.-WvGjXqt.js","_app/immutable/chunks/swipe.ysJLwxnX.js","_app/immutable/chunks/EmptyCard.i7c96Gnh.js","_app/immutable/chunks/format.-3CDNjnq.js","_app/immutable/chunks/de.5ejuWyRG.js","_app/immutable/chunks/constructFrom.5xxej_j7.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-HLTzyuiU.js.map
