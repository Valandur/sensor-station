import { b as private_env } from './shared-server-b7e48788.js';
import { r as redirect } from './index-39e97e00.js';

const ENABLED = private_env.NEWS_ENABLED === "1";
const load = async () => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 4;
const component = async () => (await import('./layout.svelte-cbbd1799.js')).default;
const server_id = "src/routes/(main)/screens/news/+layout.server.ts";
const imports = ["_app/immutable/entry/layout.svelte.51caf022.js","_app/immutable/chunks/index.71ce2ac2.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-661662be.js.map
