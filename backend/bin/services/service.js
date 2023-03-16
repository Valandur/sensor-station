"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
class Service {
    app;
    name;
    enabled;
    constructor(app) {
        this.app = app;
        this.name = this.constructor.name.toUpperCase();
        this.enabled = process.env[this.name + '_ENABLED'] === '1';
    }
    async init() {
        if (!this.enabled) {
            this.log('DISABLED');
            return;
        }
        this.log('INIT');
        await this.doInit();
        this.log('INITIALIZED');
    }
    async start() {
        if (!this.enabled) {
            return;
        }
        this.log('START');
        await this.doStart();
        this.log('STARTED');
    }
    async stop() {
        if (!this.enabled) {
            return;
        }
        this.log('STOP');
        await this.doStop();
        this.log('STOPPED');
    }
    async dispose() {
        if (!this.enabled) {
            return;
        }
        this.log('DISPOSE');
        await this.doDispose();
        this.log('DISPOSED');
    }
    log(message, ...params) {
        this.app.log(this.name, message, ...params);
    }
    warn(message, ...params) {
        this.app.warn(this.name, message, ...params);
    }
    error(message, ...params) {
        this.app.error(this.name, message, ...params);
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map