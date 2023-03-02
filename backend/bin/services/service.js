"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
class Service {
    constructor(app) {
        this.app = app;
        this.name = this.constructor.name.toUpperCase();
    }
    async init() {
        // NO-OP
    }
    async start() {
        // NO-OP
    }
    log(message, ...params) {
        this.app.log(this.name, message, ...params);
    }
    error(message, ...params) {
        this.app.error(this.name, message, ...params);
    }
}
exports.Service = Service;
