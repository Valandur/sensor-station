"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = void 0;
const service_1 = require("./service");
class Calendar extends service_1.Service {
    constructor() {
        super(...arguments);
        this.enabled = process.env.CALENDAR_ENABLED === '1';
        this.events = [];
    }
    async init() {
        if (!this.enabled) {
            this.log('CALENDAR DISABLED');
            return;
        }
        await this.app.storage.run('CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, ts DATETIME, repeat TEXT, description TEXT)');
        this.events = await this.app.storage.all('SELECT * FROM events');
        this.log(`Loaded ${this.events.length} events`);
    }
}
exports.Calendar = Calendar;
