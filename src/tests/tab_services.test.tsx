import { vi } from "vitest";
import { getTabData } from "../services/tab_services";

describe("getTabData", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("returns the title when fetch is successful", async () => {
    const mockTitle = "Dummy Post Title";
    // Mock fetch to resolve with a successful response
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ title: mockTitle }),
    });

    const result = await getTabData("1");
    expect(result).toBe(mockTitle);
  });

  test("throws an error when fetch fails", async () => {
    // Mock fetch to reject with an error
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    await expect(getTabData("1")).rejects.toThrow(
      "Network response was not ok"
    );
  });
});
