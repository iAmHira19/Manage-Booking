import React, { useEffect } from "react";

function FilterTabs({
  setFilteredOptions,
  selectedFilterTab,
  setSelectedFilterTab,
  onChangeCurrency,
}) {
  useEffect(() => {
    const derivePrice = (item) => {
      // Prefer brand price if available, else fall back to card-level priceStructure
      const brand0 = item?.brands && item.brands[0];
      if (brand0 && brand0.keyData !== "Root0") {
        const p = Number(brand0?.priceStructure?.totalPriceFC || 0);
        return isNaN(p) ? Number.MAX_SAFE_INTEGER : p;
      }
      const p2 = Number(item?.priceStructure?.totalPriceFC || 0);
      return isNaN(p2) ? Number.MAX_SAFE_INTEGER : p2;
    };

    const deriveDuration = (item) => {
      const d = item?.duration;
      if (typeof d === "number") return d;
      if (typeof d === "string") {
        const parts = d.split(":");
        if (parts.length >= 2) {
          const h = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10);
          if (!isNaN(h) && !isNaN(m)) return h * 60 + m;
        }
      }
      return Number.MAX_SAFE_INTEGER;
    };

    if (selectedFilterTab === "suggested") {
      setFilteredOptions((prevValue) => {
        const copy = [...prevValue];
        // If lowPriceOrder is present, use it; otherwise fall back to price
        return copy.sort((a, b) => {
          const la = typeof a.lowPriceOrder === "number" ? a.lowPriceOrder : derivePrice(a);
          const lb = typeof b.lowPriceOrder === "number" ? b.lowPriceOrder : derivePrice(b);
          return la - lb;
        });
      });
    } else if (selectedFilterTab === "cheapest") {
      setFilteredOptions((prevValue) => {
        const copy = [...prevValue];
        return copy.sort((a, b) => derivePrice(a) - derivePrice(b));
      });
    } else if (selectedFilterTab === "fastest") {
      setFilteredOptions((prevValue) => {
        const copy = [...prevValue];
        return copy.sort((a, b) => deriveDuration(a) - deriveDuration(b));
      });
    }
  }, [selectedFilterTab, setFilteredOptions]);

  return (
    <>
      <div className="flex gap-3 border sm:border-2 border-slate-300 flex-wrap rounded mb-5 text-center font-gotham items-center px-2">
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
        <div className="ml-auto my-2">
          <button
            type="button"
            className="px-4 py-2 bg-orange-500 text-white rounded text-xs sm:text-sm md:text-base"
            onClick={() => onChangeCurrency && onChangeCurrency()}
          >
            Change Currency
          </button>
        </div>
      </div>
    </>
  );
}

export default FilterTabs;
