import { mkdir } from 'fs/promises';
import sqlite3, { Database, Statement } from 'sqlite3';

import { Service } from './service';

const SQLITE_FILE_NAME = './data/data.sqlite3';

export class Storage extends Service {
	private db: Database;

	public override async init(): Promise<void> {
		await mkdir('./data', { recursive: true });
		this.db = new sqlite3.Database(SQLITE_FILE_NAME);
	}

	public dispose(): void {
		if (this.db) {
			this.db.close();
		}
	}

	public async runPrepared(query: string, values: any[]): Promise<void> {
		const stmt = await new Promise<Statement>((res, rej) =>
			this.db.prepare(query, function (err) {
				err ? rej(err) : res(this);
			})
		);
		for (const value of values) {
			await new Promise<void>((res, rej) => stmt.run(value, (err) => (err ? rej(err) : res())));
		}
		await new Promise<void>((res, rej) => stmt.finalize((err) => (err ? rej(err) : res())));
	}

	public async run(query: string, params?: any[]): Promise<number> {
		return new Promise<number>((res, rej) =>
			this.db.run(query, params, function (err) {
				err ? rej(err) : res(this.lastID);
			})
		);
	}

	public async all<R>(query: string, params?: any[]): Promise<R[]> {
		return new Promise<R[]>((res, rej) => this.db.all(query, params, (err, rows) => (err ? rej(err) : res(rows))));
	}
}
