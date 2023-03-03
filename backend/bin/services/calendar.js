"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = void 0;
const service_1 = require("./service");
class Calendar extends service_1.Service {
    updatedAt = null;
    events = null;
    async doInit() {
        await this.app.storage.run('CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, ts DATETIME, repeat TEXT, description TEXT)');
    }
    async doStart() {
        this.events = await this.app.storage.all('SELECT * FROM events');
        this.log(`Loaded ${this.events.length} events`);
    }
    async doStop() {
        this.updatedAt = null;
        this.events = null;
    }
    async doDispose() { }
}
exports.Calendar = Calendar;
