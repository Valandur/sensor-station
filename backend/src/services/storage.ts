import { mkdir } from 'fs/promises';
import sqlite3, { Database } from 'sqlite3';

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

	public async run(query: string, params?: any[]): Promise<void> {
		await new Promise<void>((res, rej) => this.db.run(query, params, (err) => (err ? rej(err) : res())));
	}

	public async all<R>(query: string, params?: any[]): Promise<R[]> {
		return new Promise<R[]>((res, rej) => this.db.all(query, params, (err, rows) => (err ? rej(err) : res(rows))));
	}
}
