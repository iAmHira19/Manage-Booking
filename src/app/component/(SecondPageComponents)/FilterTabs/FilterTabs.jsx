import React, { useEffect } from "react";

function FilterTabs({
  setFilteredOptions,
  selectedFilterTab,
  setSelectedFilterTab,
}) {
  useEffect(() => {
    if (selectedFilterTab === "suggested") {
      setFilteredOptions((prevValue) =>
        [...prevValue].sort((a, b) => a.lowPriceOrder - b.lowPriceOrder)
      );
    } else if (selectedFilterTab === "cheapest") {
      setFilteredOptions((prevValue) =>
        [...prevValue].sort((a, b) => a.totalPrice - b.totalPrice)
      );
    } else if (selectedFilterTab === "fastest") {
      setFilteredOptions((prevValue) =>
        [...prevValue].sort((a, b) => a.duration - b.duration)
      );
    }
  }, [selectedFilterTab]);

  return (
    <>
      <div className="flex gap-3 border sm:border-2 border-slate-300 justify-around flex-wrap lg:justify-start rounded mb-5 text-center font-gotham">
        <button
          className={`lg:px-10 lg:w-40 py-3 text-xs sm:text-sm md:text-base text-blue-900 sm:font-bold font-gotham ${
            selectedFilterTab === "suggested" ? "bg-blue-100" : ""
          }`}
          onClick={() => {
            setSelectedFilterTab("suggested");
          }}
        >
          Suggested
        </button>
        <button
          className={`font-gotham lg:px-10 lg:w-40 py-3 text-xs sm:text-sm md:text-base text-blue-900 sm:font-bold ${
            selectedFilterTab === "cheapest" ? "bg-blue-100" : ""
          }`}
          onClick={() => {
            // handleCheapest();
            setSelectedFilterTab("cheapest");
          }}
        >
          Cheapest
        </button>
        <button
          className={`font-gotham lg:px-10 lg:w-40 py-3 text-xs sm:text-sm md:text-base text-blue-900 sm:font-bold ${
            selectedFilterTab === "fastest" ? "bg-blue-100" : ""
          }`}
          onClick={() => {
            // handleFastest();
            setSelectedFilterTab("fastest");
          }}
        >
          Fastest
        </button>
      </div>
    </>
  );
}

export default FilterTabs;
