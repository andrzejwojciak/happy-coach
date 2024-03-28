export type CacheData = {
  value: string;
  expiresIn?: number;
  clearAfter?: Date;
};

export type cacheType = { [key: string]: CacheData };

const globalForCache = globalThis as unknown as { cache: cacheType };

const cache = globalForCache.cache || {};

if (process.env.NODE_ENV !== "production") globalForCache.cache = cache;

setInterval(() => {
  const filteredCache = Object.fromEntries(
    Object.entries(cache).filter(
      ([key, value]) =>
        value.clearAfter && value.clearAfter.getTime() < new Date().getTime()
    )
  );

  Object.keys(filteredCache).forEach((key) => {
    removeCacheByKey(key);
  });
}, 1000);

export function getCache(key: string): CacheData | null {
  const cacheData = cache[key];
  return cacheData ? cacheData : null;
}

export function saveCache(key: string, cacheToSave: CacheData) {
  cache[key] = cacheToSave;

  if (cacheToSave.expiresIn)
    setInterval(removeCacheByKey, cacheToSave.expiresIn, key);
}

export function removeCacheByKey(key: string) {
  if (cache.hasOwnProperty(key)) delete cache[key];
}
