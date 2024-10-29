import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { getTabData } from "../services/tab_services";
import useFetchWithCache from "../tab_data_provider";

vi.mock("../services/tab_services.ts");
vi.mock("../utils/cleanUp_cache.ts");

describe("useFetchWithCache", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should cache data after a successful fetch", async () => {
    const { result } = renderHook(() => useFetchWithCache());

    const mockKey = "testKey";
    const mockData = "fetched data";

    // Mock getTabData to return mock data
    vi.mocked(getTabData).mockResolvedValue(mockData);

    // Fetch with cache (should fetch new data)
    await act(async () => {
      await result.current.fetchWithCache(mockKey);
    });

    // Check if getTabData was called
    expect(getTabData).toHaveBeenCalledWith(mockKey);

    // Verify that the data is cached
    expect(result.current.tabData[mockKey]).toEqual(mockData);

    // Now try to fetch the data again, which should return the cached value
    const cachedData = await act(async () => {
      return await result.current.fetchWithCache(mockKey);
    });

    // Ensure that the cached data is returned
    expect(cachedData).toEqual(mockData);
    expect(getTabData).toHaveBeenCalledTimes(1); // Ensure getTabData was only called once
  });

  const mockData = "cached data";
  test("should return cached data if it hasn't expired", async () => {
    const key = "testKey";

    // Mock getTabData response
    (getTabData as vi.Mock).mockResolvedValue(mockData);

    // Initialize hook
    const { result } = renderHook(() => useFetchWithCache());

    // First fetch: should call getTabData
    await act(async () => {
      const data = await result.current.fetchWithCache(key);
      expect(data).toBe(mockData);
    });

    // Second fetch: should return cached data without calling getTabData again
    await act(async () => {
      const data = await result.current.fetchWithCache(key);
      expect(data).toBe(mockData);
      expect(getTabData).toHaveBeenCalledTimes(1); // Only called once
    });
  });

  test("should fetch new data if cache has expired", async () => {
    const { result } = renderHook(() => useFetchWithCache());

    // Set a cache entry with a TTL of 1 millisecond
    act(() => {
      result.current.setData("testKey", "cached data", 1);
    });

    // Wait for the cache to expire
    await new Promise((resolve) => setTimeout(resolve, 5)); // Wait longer than TTL

    // Mock getTabData to return mock data
    vi.mocked(getTabData).mockResolvedValue(mockData);

    // Fetch with cache (should fetch new data)
    await act(async () => {
      await result.current.fetchWithCache("testKey");
    });

    // Check if getTabData was called
    expect(getTabData).toHaveBeenCalledWith("testKey");

    // Check if tabData has been updated with new data
    expect(result.current.tabData["testKey"]).toEqual(mockData);
  });

  test("should retry fetching data if fetch fails", async () => {
    const { result } = renderHook(() => useFetchWithCache());

    const errorMessage = "Network error";
    const retryCount = 3;

    // Mock getTabData to fail for the first two attempts and succeed on the third
    vi.mocked(getTabData)
      .mockRejectedValueOnce(new Error(errorMessage)) // First attempt fails
      .mockRejectedValueOnce(new Error(errorMessage)) // Second attempt fails
      .mockResolvedValueOnce(mockData); // Third attempt succeeds

    // Fetch with cache (should retry fetching)
    const fetchPromise = act(async () => {
      await result.current.fetchWithCache("testKey", {
        retries: retryCount,
        delay: 1000,
      }); // Provide delay
    });

    // Check if getTabData was called the expected number of times
    await fetchPromise;
    expect(getTabData).toHaveBeenCalledTimes(retryCount);

    // Ensure that the returned data is the fetched data after retries
    expect(result.current.tabData["testKey"]).toEqual(mockData);
  });
});
