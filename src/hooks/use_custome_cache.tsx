import { useState, useEffect } from "react";
import useFetchWithCache from "../tab_data_provider";

// Custom hook to fetch data with caching
const useCustomCache = (tabId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { fetchWithCache, tabData } = useFetchWithCache();

  useEffect(() => {
    const fetchData = async () => {
      setError("");
      try {
        setLoading(true);
        await fetchWithCache(tabId);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tabId, fetchWithCache]);

  return { tabData, loading, error };
};

export default useCustomCache;
