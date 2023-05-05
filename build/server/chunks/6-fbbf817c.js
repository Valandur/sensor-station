import { r as redirect } from './index-39e97e00.js';
import { exec } from 'node:child_process';

const load = async () => {
  throw redirect(302, "/screens");
};
const actions = {
  restart: async () => {
    exec("sudo /sbin/shutdown -r now", (msg) => console.log(msg));
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 6;
const server_id = "src/routes/+page.server.ts";
const imports = [];
const stylesheets = [];
const fonts = [];

export { fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-fbbf817c.js.map
