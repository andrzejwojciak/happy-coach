type cacheType = { [key: string]: CacheData };

const globalForCache = globalThis as unknown as { cache: cacheType };

let cache = globalForCache.cache || {};

if (process.env.NODE_ENV !== "production") globalForCache.cache = {};

export function getCache(key: string): CacheData | null {
  const cacheData = cache[key];
  return cacheData ? cacheData : null;
}

export function saveCache(key: string, cacheToSave: CacheData) {
  cache[key] = cacheToSave;

  if (cacheToSave.expires_in)
    setInterval(removeCache, cacheToSave.expires_in, key);
}

export function removeCache(key: string) {
  console.log(cache);

  if (cache.hasOwnProperty(key)) delete cache[key];
}

export type CacheData = {
  value: string;
  expires_in?: number;
};
