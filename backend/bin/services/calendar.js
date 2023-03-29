"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = void 0;
const local_auth_1 = require("@google-cloud/local-auth");
const promises_1 = require("fs/promises");
const googleapis_1 = require("googleapis");
const path_1 = require("path");
const service_1 = require("./service");
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'data/calendar/token.json';
const CREDENTIALS_PATH = 'data/calendar/credentials.json';
class Calendar extends service_1.Service {
    client = null;
    timer = null;
    events = null;
    async doInit() {
        this.client = await this.authorize();
    }
    async doStart() {
        await this.update();
        if (process.env['CALENDAR_UPDATE_INTERVAL']) {
            const interval = 1000 * Number(process.env['CALENDAR_UPDATE_INTERVAL']);
            this.timer = setInterval(this.update, interval);
            this.log('UPDATE STARTED', interval);
        }
        else {
            this.log('UPDATE DISABLED');
        }
    }
    async doStop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.events = null;
    }
    async doDispose() { }
    update = async () => {
        try {
            if (!this.client) {
                this.client = await this.authorize();
            }
            else {
                await this.client.refreshAccessToken();
            }
            const calendar = googleapis_1.google.calendar({ version: 'v3', auth: this.client });
            const res = await calendar.events.list({
                calendarId: '3isnbvbudasaevou1g6ejr6ni0@group.calendar.google.com',
                timeMin: new Date().toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime'
            });
            if (!res.data.items) {
                this.warn('No calendar events');
                return;
            }
            const events = [];
            for (const event of res.data.items) {
                const start = event.start?.dateTime || event.start?.date;
                const end = event.end?.dateTime || event.end?.date;
                if (!start || !end || !event.summary) {
                    this.warn('Invalid calendar event', event);
                    continue;
                }
                events?.push({ tsStart: start, tsEnd: end, content: event.summary, isWholeDay: !!event.start?.date });
            }
            this.events = events;
        }
        catch (err) {
            if (err.code === '400') {
                await (0, promises_1.rm)(TOKEN_PATH);
                this.client = null;
            }
            this.error(JSON.stringify(err));
        }
    };
    async loadSavedCredentialsIfExist() {
        try {
            const content = await (0, promises_1.readFile)(TOKEN_PATH, 'utf-8');
            const credentials = JSON.parse(content);
            return googleapis_1.google.auth.fromJSON(credentials);
        }
        catch (err) {
            return null;
        }
    }
    async saveCredentials(client) {
        const content = await (0, promises_1.readFile)(CREDENTIALS_PATH, 'utf-8');
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token
        });
        await (0, promises_1.writeFile)(TOKEN_PATH, payload);
    }
    async authorize() {
        let client = await this.loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = await (0, local_auth_1.authenticate)({
            scopes: SCOPES,
            keyfilePath: (0, path_1.resolve)(CREDENTIALS_PATH)
        });
        if (client.credentials) {
            await this.saveCredentials(client);
        }
        return client;
    }
}
exports.Calendar = Calendar;
//# sourceMappingURL=calendar.js.map