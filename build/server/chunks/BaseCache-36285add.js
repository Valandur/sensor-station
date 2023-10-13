import { e as error } from './index-0087e825.js';
import { differenceInSeconds } from 'date-fns';

const DEFAULT_KEY = "__default__";
class BaseCache {
  logger;
  cacheTime;
  cache = /* @__PURE__ */ new Map();
  constructor(logger, cacheTime) {
    this.logger = logger;
    this.cacheTime = cacheTime;
  }
  getDefaultData() {
    return this.getData(DEFAULT_KEY);
  }
  getData(key) {
    return this.cache.get(key)?.data || null;
  }
  async withDefault(force, onTry, onFinally, onCatch) {
    return this.with(DEFAULT_KEY, force, onTry, onFinally, onCatch);
  }
  async with(key, force, onTry, onFinally, onCatch) {
    const cacheEntry = this.cache.get(key);
    let updatedAt = cacheEntry?.updatedAt || /* @__PURE__ */ new Date(0);
    let cachedData = cacheEntry?.data || null;
    let cachedError = cacheEntry?.error || null;
    if (!force && differenceInSeconds(/* @__PURE__ */ new Date(), updatedAt) <= this.cacheTime) {
      this.logger.debug("Using cached data");
      if (cachedError) {
        throw cachedError;
      } else if (cachedData) {
        return cachedData;
      } else {
        throw error(500, {
          message: "Trying to use empty cached data",
          key: "service.emptyCache"
        });
      }
    }
    this.logger.debug("Updating...");
    const startTime = process.hrtime.bigint();
    try {
      const newData = await onTry();
      cachedData = newData;
      cachedError = null;
      return cachedData;
    } catch (err) {
      cachedError = this.logger.toSvelteError(err);
      if (onCatch) {
        await onCatch(cachedError).catch((err2) => this.logger.warn("Catch error", err2));
      }
      throw cachedError;
    } finally {
      if (onFinally) {
        await onFinally().catch((err) => this.logger.warn("Cleanup error", err));
      }
      updatedAt = /* @__PURE__ */ new Date();
      this.cache.set(key, { updatedAt, data: cachedData, error: cachedError });
      const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
      this.logger.info("Updated", diffTime, "ms");
    }
  }
}

export { BaseCache as B };
//# sourceMappingURL=BaseCache-36285add.js.map
