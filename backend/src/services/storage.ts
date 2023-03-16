import { mkdir } from 'fs/promises';
import sqlite3, { Database, Statement } from 'sqlite3';
import type { Application } from '../app';

import { Service } from './service';

const SQLITE_FILE_NAME = './data/data.sqlite3';

export class Storage extends Service {
	private db: Database | null = null;

	public constructor(app: Application) {
		super(app);

		// Storage cannot be disabled
		this.enabled = true;
	}

	protected override async doInit(): Promise<void> {
		await mkdir('./data', { recursive: true });
		this.db = new sqlite3.Database(SQLITE_FILE_NAME);
	}

	protected override async doStart(): Promise<void> {}

	protected override async doStop(): Promise<void> {}

	protected override async doDispose(): Promise<void> {
		if (this.db) {
			const db = this.db;
			await new Promise<void>((res, rej) => db.close((err) => (err ? rej(err) : res())));
			this.db = null;
		}
	}

	public async runPrepared(query: string, values: any[]): Promise<void> {
		const stmt = await new Promise<Statement>((res, rej) => {
			if (!this.db) {
				throw new Error(`Database is not available`);
			}

			return this.db.prepare(query, function (err) {
				err ? rej(err) : res(this);
			});
		});
		for (const value of values) {
			await new Promise<void>((res, rej) => stmt.run(value, (err) => (err ? rej(err) : res())));
		}
		await new Promise<void>((res, rej) => stmt.finalize((err) => (err ? rej(err) : res())));
	}

	public async run(query: string, params?: any[]): Promise<number> {
		return new Promise<number>((res, rej) => {
			if (!this.db) {
				throw new Error(`Database is not available`);
			}

			return this.db.run(query, params, function (err) {
				err ? rej(err) : res(this.lastID);
			});
		});
	}

	public async all<R>(query: string, params?: any[]): Promise<R[]> {
		return new Promise<R[]>((res, rej) => {
			if (!this.db) {
				throw new Error(`Database is not available`);
			}

			return this.db.all(query, params, (err, rows: any[]) => (err ? rej(err) : res(rows)));
		});
	}
}
