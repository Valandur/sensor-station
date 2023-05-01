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

const index = 8;
const component = async () => (await import('./_page.svelte-c38f1444.js')).default;
const server_id = "src/routes/(main)/screens/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-page.svelte.43599754.js","_app/immutable/chunks/index.376c5e2b.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-b0afc97a.js.map
