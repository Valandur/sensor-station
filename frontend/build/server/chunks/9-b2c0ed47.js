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
const component = async () => (await import('./_page.svelte-1887c258.js')).default;
const server_id = "src/routes/(main)/screens/+page.server.ts";
const imports = ["_app/immutable/entry/(main)-screens-page.svelte.80237ca4.js","_app/immutable/chunks/index.71ce2ac2.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-b2c0ed47.js.map
