"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
class Service {
    app;
    isDebug = process.env['DEBUG'] === '1';
    name;
    enabled;
    updateInterval = null;
    timer = null;
    updatedAt = null;
    constructor(app) {
        this.app = app;
        this.name = this.constructor.name.toUpperCase();
        this.enabled = process.env[this.name + '_ENABLED'] === '1';
        this.updateInterval = process.env[this.name + '_UPDATE_INTERVAL']
            ? Number(process.env[this.name + '_UPDATE_INTERVAL'])
            : null;
    }
    async init() {
        if (!this.enabled) {
            this.log('DISABLED');
            return;
        }
        this.debug('INIT');
        await this.doInit();
        this.log('INITIALIZED');
    }
    async start() {
        if (!this.enabled) {
            return;
        }
        this.debug('START');
        await this.doStart();
        this.log('STARTED');
        await this.update();
        if (this.updateInterval) {
            const interval = 1000 * this.updateInterval;
            this.timer = setInterval(this.update, interval);
            this.debug('UPDATE SCHEDULED', interval);
        }
        else {
            this.debug('UPDATE DISABLED');
        }
    }
    update = async () => {
        if (!this.enabled) {
            return;
        }
        this.debug('UPDATING');
        try {
            await this.doUpdate();
            this.updatedAt = new Date();
        }
        catch (err) {
            this.error(err);
        }
        this.debug('UPDATED');
    };
    async stop() {
        if (!this.enabled) {
            return;
        }
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.debug('STOP');
        await this.doStop();
        this.log('STOPPED');
        this.updatedAt = null;
    }
    async dispose() {
        if (!this.enabled) {
            return;
        }
        this.debug('DISPOSE');
        await this.doDispose();
        this.log('DISPOSED');
    }
    debug(message, ...params) {
        this.app.debug(this.name, message, ...params);
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