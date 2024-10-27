import { useState, useRef, useCallback } from "react";

import { cleanupCache } from "./utils/cleanUp_cache";
import { getTabData } from "./services/tab_services";

// cache type
export type TCache = {
  [key: string]: { data: string; timestamp: number; ttl: number };
};

// data type for each fetched data
export type TData = {
  [key: string]: string;
};

// Define a custom hook or a component
const useFetchWithCache = () => {
  const cache = useRef<TCache>({}); // Acts as the cache
  const [tabData, setTabData] = useState<TData>({}); // To store state

  // Set data globally and in the cache with expiration
  // ttl: time to live in milliseconds (default = 10sec)
  const setData = (key: string, data: string, ttl = 10000) => {
    const timestamp = Date.now();
    setTabData((prev) => ({ ...prev, [key]: data }));
    cache.current[key] = { data, timestamp, ttl };
  };

  // Custom fetcher to manage cache with invalidation and retry logic
  const fetchWithCache = useCallback(
    async (key: string, options = { retries: 3, delay: 1000 }) => {
      cleanupCache(cache, setTabData); // Cleanup before fetching

      const cachedEntry = cache.current[key];

      // Check if the data exists and if it is still valid
      if (cachedEntry && Date.now() - cachedEntry.timestamp < cachedEntry.ttl) {
        return cachedEntry.data; // Return cached data if it exists and is valid
      } else {
        let attempts = 0;

        while (attempts < options.retries) {
          try {
            const data = await getTabData(key);
            setData(key, data); // Store in state and cache
            return data;
          } catch (error) {
            attempts++; //increment the number of attempts
            if (error instanceof Error) {
              console.error(
                `Fetch attempt ${attempts} failed: ${error.message}`
              );
            }

            if (attempts < options.retries) {
              await new Promise((resolve) =>
                setTimeout(resolve, options.delay)
              ); // Wait before retrying
            } else {
              throw new Error(
                `Failed to fetch data after ${attempts} attempts`
              );
            }
          }
        }
      }
    },
    []
  );

  return { fetchWithCache, tabData };
};

export default useFetchWithCache;
