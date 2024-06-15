import { error, type HttpError, isHttpError } from '@sveltejs/kit';
import { format } from 'date-fns';
import { inspect } from 'node:util';
import chalk from 'chalk';

export class BaseLogger {
	private readonly moduleLowerName;
	public constructor(private readonly moduleName: string) {
		this.moduleLowerName = moduleName.toLowerCase();
	}

	private getDate() {
		return chalk.grey(format(new Date(), 'HH:mm:ss'));
	}

	public debug(message: unknown, ...params: unknown[]) {
		const msg = chalk.gray(typeof message === 'string' ? message : inspect(message));
		console.log(
			`${this.getDate()} [${chalk.gray('DEBUG')}] [${chalk.green(this.moduleName)}] ${msg}`,
			...params
		);
	}
	public info(message: unknown, ...params: unknown[]) {
		const msg = typeof message === 'string' ? message : inspect(message);
		console.log(
			`${this.getDate()} [${chalk.cyan('INFO')}] [${chalk.green(this.moduleName)}] ${msg}`,
			...params
		);
	}
	public warn(message: unknown, ...params: unknown[]) {
		const msg = chalk.yellow(typeof message === 'string' ? message : inspect(message));
		console.log(
			`${this.getDate()} [${chalk.yellow('WARN')}] [${chalk.green(this.moduleName)}] ${msg}`,
			...params
		);
	}
	public error(message: unknown, ...params: unknown[]) {
		const msg = chalk.red(typeof message === 'string' ? message : inspect(message));
		console.error(
			`${this.getDate()} [${chalk.red('ERROR')}] [${chalk.green(this.moduleName)}] ${msg}`,
			...params
		);
	}

	public toSvelteError(err: unknown, extra?: Partial<App.Error>): HttpError {
		this.error(err);

		if (isHttpError(err)) {
			// If we already have a svelte error just extend the extras
			err.body = { ...extra, ...err.body, params: { ...extra?.params, ...err.body.params } };
			return err;
		}

		// This is a bit weird, but the error(...) function THROWS the error, and we can't construct it any better way
		try {
			return error(500, {
				...extra,
				message: err instanceof Error ? err.message : JSON.stringify(err),
				params: { ...extra?.params, error: JSON.parse(JSON.stringify(err)) }
			});
		} catch (err: any) {
			return err;
		}
	}
}
