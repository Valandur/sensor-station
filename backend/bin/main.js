"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./types");
const app_1 = require("./app");
const main = async () => {
    const app = new app_1.Application();
    await app.init();
    await app.start();
    const shutdown = async () => {
        await app.stop();
        await app.dispose();
        process.exit(0);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
};
main().catch((err) => console.error(err));
//# sourceMappingURL=main.js.map