import { r as redirect } from './index-C-arhqvZ.js';
import { isAfter } from 'date-fns';
import { C as Counter } from './counter-BozXqImb.js';
import { g as getData } from './data5-C32Sf7ql.js';
import 'xml2js';
import 'superagent';
import './shared-server-BfUoNEXY.js';
import './BaseCache-BtPY9_DY.js';
import './BaseLogger-B58-fQ4u.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-B63MHojP.js')).default;
const server_id = "src/routes/screens/sbb/departures/+page.server.ts";
const imports = ["_app/immutable/nodes/16.BVs_n7U1.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/entry.Cia8U66t.js","_app/immutable/chunks/index.DknyqqiT.js","_app/immutable/chunks/swipe.CFeUBoSp.js","_app/immutable/chunks/EmptyCard.h6hF05-m.js","_app/immutable/chunks/index.Bwn2MeFA.js","_app/immutable/chunks/format.BMwO3m9q.js","_app/immutable/chunks/de.DgNxBmDO.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-BHOso9p0.js.map
