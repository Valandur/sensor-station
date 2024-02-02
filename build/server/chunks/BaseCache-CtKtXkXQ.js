import './index-H42hWO6o.js';
import { differenceInSeconds } from 'date-fns';

const DEFAULT_KEY = "__default__";
class BaseCache {
  logger;
  cacheTime;
  errorCacheTime;
  cache = /* @__PURE__ */ new Map();
  constructor(logger, cacheTime, errorCacheTime = 60) {
    this.logger = logger;
    this.cacheTime = cacheTime;
    this.errorCacheTime = errorCacheTime;
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
    if (!force) {
      const timeDiff = differenceInSeconds(/* @__PURE__ */ new Date(), updatedAt);
      if (cachedData && timeDiff <= this.cacheTime) {
        this.logger.debug("Using cached data");
        return cachedData;
      } else if (cachedError && timeDiff <= this.errorCacheTime) {
        this.logger.debug("Using cached error");
        throw cachedError;
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
//# sourceMappingURL=BaseCache-CtKtXkXQ.js.map
