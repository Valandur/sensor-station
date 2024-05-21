import { r as redirect } from './index-C-arhqvZ.js';
import { C as Counter, a as CounterType } from './counter-BozXqImb.js';
import { g as getData } from './data5-C32Sf7ql.js';
import 'date-fns';
import 'xml2js';
import 'superagent';
import './shared-server-BfUoNEXY.js';
import './BaseCache-BtPY9_DY.js';
import './BaseLogger-B58-fQ4u.js';
import 'node:util';
import 'chalk';

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
    nextPage: `${dataParent.currScreen}&page=${counter.fit(page + 1)}`,
    prevPage: `${dataParent.currScreen}&page=${counter.fit(page - 1)}`
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 15;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B0J8gQgh.js')).default;
const server_id = "src/routes/screens/sbb/alerts/+page.server.ts";
const imports = ["_app/immutable/nodes/15.BHKQ6a2H.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js","_app/immutable/chunks/entry.BeELj15P.js","_app/immutable/chunks/index.DknyqqiT.js","_app/immutable/chunks/swipe.CFeUBoSp.js","_app/immutable/chunks/EmptyCard.h6hF05-m.js","_app/immutable/chunks/Card.C7Fy4Ve5.js","_app/immutable/chunks/format.CJrgGK3Q.js","_app/immutable/chunks/de.oFxG6rdj.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-DeY_YaYr.js.map
