import { exec } from 'child_process';

const actions = {
  restart: async () => {
    exec("sudo /sbin/shutdown -r now", (msg) => console.log(msg));
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions
});

const index = 9;
const component = async () => (await import('./_page.svelte-c38f1444.js')).default;
const server_id = "src/routes/(main)/screens/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-page.svelte.f6193b36.js","_app/immutable/chunks/index.fe1ee059.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-6fd47d93.js.map
