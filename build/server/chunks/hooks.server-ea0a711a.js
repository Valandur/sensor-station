import { resolve, normalize } from 'path';
import { readFile } from 'fs/promises';
import { B as BaseLogger } from './BaseLogger-d23f9d0c.js';
import './index-39e97e00.js';
import 'date-fns';
import 'node:util';
import 'chalk';

const logger = new BaseLogger("MAIN");
const handle = async ({ event, resolve: resolve$1 }) => {
  const path = event.url.pathname;
  if (path.startsWith("/data/")) {
    const file = await readFile(resolve("." + normalize(path)));
    return new Response(file, { status: 200 });
  }
  const response = await resolve$1(event);
  return response;
};
const handleError = async ({ error, event }) => {
  logger.error(error);
  return {
    message: error instanceof Error ? error.message : JSON.stringify(error),
    key: "unhandled",
    params: { route: event.route, error: JSON.parse(JSON.stringify(error)) }
  };
};

export { handle, handleError };
//# sourceMappingURL=hooks.server-ea0a711a.js.map
