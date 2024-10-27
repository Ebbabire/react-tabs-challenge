const TabLoading = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="animate-pulse rounded-md bg-gray-400/30 py-5 w-28 mb-4"></div>
      <div className="animate-pulse rounded-md bg-gray-400/30 py-3 w-full"></div>
      <div className="animate-pulse rounded-md bg-gray-400/30 py-3 w-full"></div>
      <div className="animate-pulse rounded-md bg-gray-400/30 py-3 w-[80%]"></div>
    </div>
  );
};

export default TabLoading;
