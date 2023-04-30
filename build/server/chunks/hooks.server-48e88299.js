import { resolve, normalize } from 'path';
import { readFile } from 'fs/promises';

const handle = async ({ event, resolve: resolve$1 }) => {
  const path = event.url.pathname;
  if (path.startsWith("/data/uploads")) {
    const file = await readFile(resolve("." + normalize(path)));
    return new Response(file, { status: 200 });
  }
  const response = await resolve$1(event);
  return response;
};

export { handle };
//# sourceMappingURL=hooks.server-48e88299.js.map
