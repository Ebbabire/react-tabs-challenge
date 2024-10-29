import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import useCustomCache from "../hooks/use_custome_cache";
import Tab from "../components/tab";
import TabLoading from "../components/tab_loading";

// Mock the custom caching hook
vi.mock("../hooks/use_custome_cache");

describe("Tab Component", () => {
  test("renders default tab (Tab 1) when no search param is passed", () => {
    // Mock the `useCustomCache` hook to avoid unnecessary dependencies
    (useCustomCache as ReturnType<typeof vi.fn>).mockReturnValue({
      tabData: {},
      loading: false,
      error: null,
    });

    // Render the component with `MemoryRouter` and initialEntries to control URL
    render(
      <MemoryRouter>
        <Tab />
      </MemoryRouter>
    );

    // Verify that Tab 1 has the active styling
    const defaultTabButton = screen.getByRole("button", { name: /tab 1/i });
    expect(defaultTabButton).toHaveClass("bg-[#007bff]");
  });

  test("updates URL and active tab when a tab is clicked", async () => {
    (useCustomCache as ReturnType<typeof vi.fn>).mockReturnValue({
      tabData: {},
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/?tab=1"]}>
        <Tab />
      </MemoryRouter>
    );

    const tab2Button = screen.getByRole("button", { name: /tab 2/i });

    // Simulate clicking the tab
    await userEvent.click(tab2Button);

    // Verify that Tab 2 has the active styling
    expect(tab2Button).toHaveClass("bg-[#007bff]");

    // Check the visual update for the active tab (Tab 2 content should be displayed)
    expect(screen.getByText(/Title 2/i)).toBeInTheDocument();
  });

  test("displays loading state correctly", () => {
    (useCustomCache as ReturnType<typeof vi.fn>).mockReturnValue({
      tabData: {},
      loading: true,
      error: null,
    });
    render(
      <MemoryRouter>
        <Tab />
      </MemoryRouter>
    );

    // Check if loading component is rendered
    expect(render(<TabLoading />));
  });

  test("displays error message when there is an error", () => {
    (useCustomCache as ReturnType<typeof vi.fn>).mockReturnValue({
      tabData: {},
      loading: false,
      error: "Failed to load",
    });
    render(
      <MemoryRouter>
        <Tab />
      </MemoryRouter>
    );

    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  test("displays tab data when loaded", () => {
    const mockData = { "1": "Content for Tab 1", "2": "Content for Tab 2" };
    (useCustomCache as ReturnType<typeof vi.fn>).mockReturnValue({
      tabData: mockData,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/?tab=1"]}>
        <Tab />
      </MemoryRouter>
    );

    expect(screen.getByText(/title 1/i)).toBeInTheDocument();
    expect(screen.getByText(/content for tab 1/i)).toBeInTheDocument();
  });
});
