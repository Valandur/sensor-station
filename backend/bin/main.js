"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./types");
const app_1 = require("./app");
const main = async () => {
    const app = new app_1.Application();
    await app.init();
    await app.run();
};
main().catch((err) => console.error(err));
