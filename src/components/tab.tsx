import { useSearchParams } from "react-router-dom";
import useCustomCache from "../hooks/use_custome_cache";
import TabLoading from "./tab_loading";

const Tab = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // Manage search params

  const activeTab = searchParams.get("tab") || "1"; // Get active tab from URL or default to Tab 1
  const { tabData, loading, error } = useCustomCache(activeTab); // Fetch data with caching

  const tabs = [
    { id: "1", label: "Tab 1" },
    { id: "2", label: "Tab 2" },
    { id: "3", label: "Tab 3" },
    { id: "4", label: "Tab 4" },
  ];
  console.log(error);
  return (
    <div className="container mx-auto w-[50%] flex gap-12 flex-col bg-white">
      {/* Tab Navigation */}
      <div className="w-full flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={`${
              activeTab === tab.id
                ? "bg-[#007bff]"
                : "bg-[#37424e] hover:bg-[#5b6e81]"
            } text-white px-12 py-4 flex-1`}
            onClick={() => setSearchParams({ tab: tab.id })} // Update the URL with the selected tab
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Display */}
      <div className="px-12 py-2 h-[12rem] max-h-[25rem] overflow-y-auto">
        {loading && <TabLoading />}
        {error && !loading && (
          <p className="text-center flex flex-col text-red-500">
            <span className="text-lg font-semibold text-black">Error:</span>{" "}
            {error}
          </p>
        )}
        {tabData && !loading && !error && (
          <div>
            <h1 className="text-3xl font-bold mb-4">{`Title ${activeTab}`}</h1>
            <p>{tabData[activeTab]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tab;
