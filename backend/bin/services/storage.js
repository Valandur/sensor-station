"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const promises_1 = require("fs/promises");
const sqlite3_1 = __importDefault(require("sqlite3"));
const service_1 = require("./service");
const SQLITE_FILE_NAME = './data/data.sqlite3';
class Storage extends service_1.Service {
    db = null;
    constructor(app) {
        super(app);
        // Storage cannot be disabled
        this.enabled = true;
    }
    async doInit() {
        await (0, promises_1.mkdir)('./data', { recursive: true });
        this.db = new sqlite3_1.default.Database(SQLITE_FILE_NAME);
    }
    async doStart() { }
    async doStop() { }
    async doDispose() {
        if (this.db) {
            const db = this.db;
            await new Promise((res, rej) => db.close((err) => (err ? rej(err) : res())));
            this.db = null;
        }
    }
    async runPrepared(query, values) {
        const stmt = await new Promise((res, rej) => {
            if (!this.db) {
                throw new Error(`Database is not available`);
            }
            return this.db.prepare(query, function (err) {
                err ? rej(err) : res(this);
            });
        });
        for (const value of values) {
            await new Promise((res, rej) => stmt.run(value, (err) => (err ? rej(err) : res())));
        }
        await new Promise((res, rej) => stmt.finalize((err) => (err ? rej(err) : res())));
    }
    async run(query, params) {
        return new Promise((res, rej) => {
            if (!this.db) {
                throw new Error(`Database is not available`);
            }
            return this.db.run(query, params, function (err) {
                err ? rej(err) : res(this.lastID);
            });
        });
    }
    async all(query, params) {
        return new Promise((res, rej) => {
            if (!this.db) {
                throw new Error(`Database is not available`);
            }
            return this.db.all(query, params, (err, rows) => (err ? rej(err) : res(rows)));
        });
    }
}
exports.Storage = Storage;
