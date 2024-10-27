import { type TData, type TCache } from "../tab_data_provider";

// Cleanup function to remove expired entries from the cache
export const cleanupCache = (
  cache: { current: TCache },
  setTabData: React.Dispatch<React.SetStateAction<TData>>
) => {
  const now = Date.now();
  Object.keys(cache.current).forEach((key) => {
    const cachedEntry = cache.current[key];

    if (now - cachedEntry.timestamp >= cachedEntry.ttl) {
      delete cache.current[key]; // Remove expired cache entry
      setTabData((prev) => {
        const { [key]: _, ...rest } = prev; // Remove from state
        return rest;
      });
    }
  });
};
