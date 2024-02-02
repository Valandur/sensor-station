import { i as isHttpError, e as error } from './index-H42hWO6o.js';
import { format } from 'date-fns';
import { inspect } from 'node:util';
import chalk from 'chalk';

class BaseLogger {
  constructor(moduleName) {
    this.moduleName = moduleName;
    this.moduleLowerName = moduleName.toLowerCase();
  }
  moduleLowerName;
  getDate() {
    return chalk.grey(format(/* @__PURE__ */ new Date(), "HH:mm:ss"));
  }
  debug(message, ...params) {
    const msg = chalk.gray(typeof message === "string" ? message : inspect(message));
    console.log(
      `${this.getDate()} [${chalk.gray("DEBUG")}] [${chalk.green(this.moduleName)}] ${msg}`,
      ...params
    );
  }
  info(message, ...params) {
    const msg = typeof message === "string" ? message : inspect(message);
    console.log(
      `${this.getDate()} [${chalk.cyan("INFO")}] [${chalk.green(this.moduleName)}] ${msg}`,
      ...params
    );
  }
  warn(message, ...params) {
    const msg = chalk.yellow(typeof message === "string" ? message : inspect(message));
    console.log(
      `${this.getDate()} [${chalk.yellow("WARN")}] [${chalk.green(this.moduleName)}] ${msg}`,
      ...params
    );
  }
  error(message, ...params) {
    const msg = chalk.red(typeof message === "string" ? message : inspect(message));
    console.error(
      `${this.getDate()} [${chalk.red("ERROR")}] [${chalk.green(this.moduleName)}] ${msg}`,
      ...params
    );
  }
  toSvelteError(err, extra) {
    this.error(err);
    if (isHttpError(err)) {
      err.body = { ...extra, ...err.body, params: { ...extra?.params, ...err.body.params } };
      return err;
    }
    try {
      return error(500, {
        ...extra,
        message: err instanceof Error ? err.message : JSON.stringify(err),
        key: `${this.moduleLowerName}.unhandled`,
        params: { ...extra?.params, error: JSON.parse(JSON.stringify(err)) }
      });
    } catch (err2) {
      return err2;
    }
  }
}

export { BaseLogger as B };
//# sourceMappingURL=BaseLogger-SyOYFtXW.js.map
