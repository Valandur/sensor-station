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
const server_id = "src/routes/screens/+page.server.ts";
const imports = ["_app/immutable/chunks/8.64e9de68.js","_app/immutable/chunks/index.dd49bebd.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-784eb91c.js.map
