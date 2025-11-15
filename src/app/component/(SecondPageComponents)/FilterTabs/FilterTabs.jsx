import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { getCurrency } from "@/utils/getCurrency";
import Image from "next/image";

function FilterTabs({
  setFilteredOptions,
  selectedFilterTab,
  setSelectedFilterTab,
  onChangeCurrency,
}) {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [currencyExchange, setCurrencyExchange] = useState([]);
  const [filteredCurrencyExchange, setFilteredCurrencyExchange] = useState([]);
  const [searchedCurrency, setSearchedCurrency] = useState("");

  // Fetch currencies on component mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const currencies = await getCurrency();
        setCurrencyExchange(currencies);
        setFilteredCurrencyExchange(currencies);
      } catch (error) {
        console.error("Failed to fetch currencies:", error);
      }
    };
    fetchCurrencies();
  }, []);

  // Filter currencies based on search
  useEffect(() => {
    if (!searchedCurrency) {
      setFilteredCurrencyExchange(currencyExchange);
      return;
    }
    const filtered = currencyExchange.filter((currency) => {
      if (!currency) return false;
      const search = searchedCurrency.toLowerCase();
      return (
        String(currency.tpCUR_DESCRIPTION || "").toLowerCase().includes(search) ||
        String(currency.tpCUR_SYMBOL || "").toLowerCase().includes(search) ||
        String(currency.tpCUR_CODE || "").toLowerCase().includes(search)
      );
    });
    setFilteredCurrencyExchange(filtered);
  }, [searchedCurrency, currencyExchange]);
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

  const deriveIsoFromCurrency = (cur) => {
    if (!cur) return "PKR";
    if (typeof cur === "string") {
      const sl = cur.toLowerCase();
      if (sl.includes("usd") || sl.includes("dollar")) return "USD";
      if (sl.includes("eur") || sl.includes("euro")) return "EUR";
      if (sl.includes("gbp") || sl.includes("pound")) return "GBP";
      return "PKR";
    }
    const code = String(cur.tpCUR_CODE || "").trim();
    const symbol = String(cur.tpCUR_SYMBOL || "").trim();
    const desc = String(cur.tpCUR_DESCRIPTION || "").trim();
    if (isIso(symbol)) return symbol.toUpperCase();
    if (isIso(code)) return code.toUpperCase();
    if (desc.toLowerCase().includes("dollar")) return "USD";
    if (desc.toLowerCase().includes("euro")) return "EUR";
    if (desc.toLowerCase().includes("pound")) return "GBP";
    if (desc.toLowerCase().includes("rupee")) return "PKR";
    return "PKR";
  };

  const getFlagEmoji = (iso) => {
    if (!iso) return "🇵🇰";
    const code = iso.toLowerCase();
    if (code === "usd" || code === "us") return "🇺🇸";
    if (code === "eur" || code === "eu") return "🇪🇺";
    if (code === "gbp" || code === "gb" || code === "uk") return "🇬🇧";
    if (code === "pkr" || code === "pk") return "🇵🇰";
    return "🇵🇰";
  };

  const isIso = (s) => /^[A-Z]{2,3}$/i.test(s);

  return (
    <div className="flex flex-col sm:flex-row gap-3 border sm:border-2 border-slate-300 rounded mb-5 font-gotham p-2">
      <div className="flex flex-wrap items-center gap-3">
        <button
          className={`lg:px-10 lg:w-40 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-blue-900 font-medium sm:font-bold ${
            selectedFilterTab === "suggested" ? "bg-blue-100" : "hover:bg-gray-100"
          } rounded transition-colors`}
          onClick={() => {
            setSelectedFilterTab("suggested");
          }}
        >
          Suggested
        </button>
        <button
          className={`lg:px-10 lg:w-40 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-blue-900 font-medium sm:font-bold ${
            selectedFilterTab === "cheapest" ? "bg-blue-100" : "hover:bg-gray-100"
          } rounded transition-colors`}
          onClick={() => {
            setSelectedFilterTab("cheapest");
          }}
        >
          Cheapest
        </button>
        <button
          className={`lg:px-10 lg:w-40 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-blue-900 font-medium sm:font-bold ${
            selectedFilterTab === "fastest" ? "bg-blue-100" : "hover:bg-gray-100"
          } rounded transition-colors`}
          onClick={() => {
            setSelectedFilterTab("fastest");
          }}
        >
          Fastest
        </button>
        {/* Currency Selector Button */}
        <button
          className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
          onClick={() => setShowCurrencyModal(true)}
        >
          <span>Currency</span>
        </button>
      </div>
      <div className="flex justify-end sm:ml-auto">
        <button
          type="button"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs sm:text-sm md:text-base font-medium transition-colors"
          onClick={() => setShowCurrencyModal(true)}
        >
          Change Currency
        </button>
      </div>
      {/* Currency Selection Modal */}
      <Modal
        title={
          <h2 className="text-lg font-gotham text-blue-900">Select Currency</h2>
        }
        open={showCurrencyModal}
        onCancel={() => setShowCurrencyModal(false)}
        footer={null}
      >
        <div className="container py-5 flex flex-col gap-y-4">
          <div className="searchPart flex gap-x-2">
            <input
              type="text"
              value={searchedCurrency}
              onChange={(e) => setSearchedCurrency(e.target.value)}
              placeholder="Search Currency"
              className="w-full border border-slate-300 outline-none rounded font-gotham font-light p-2"
            />
          </div>
          <div className="currencies flex flex-col w-full max-h-56 overflow-y-auto py-2">
            {!filteredCurrencyExchange || filteredCurrencyExchange.length === 0 ? (
              <div className="text-center text-sm text-slate-500 font-gotham">
                No currencies available. Please try again later.
              </div>
            ) : (
              filteredCurrencyExchange
                .filter(Boolean)
                .map((currency) => (
                  <div
                    key={currency.tpCUR_CODE}
                    className="border-b border-slate-200 p-2 rounded cursor-pointer font-gotham font-light text-base py-3 hover:text-blue-900 transition-all duration-150 ease-in-out flex justify-between items-center"
                    onClick={() => {
                      setShowCurrencyModal(false);
                      if (onChangeCurrency) {
                        onChangeCurrency(
                          currency.tpCUR_SYMBOL || currency.tpCUR_CODE || currency.tpCUR_DESCRIPTION,
                          currency.tpCUR_SYMBOL || currency.tpCUR_DESCRIPTION || currency.tpCUR_CODE
                        );
                      }
                    }}
                  >
                    <span>{currency.tpCUR_DESCRIPTION}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currency.tpCUR_SYMBOL}</span>
                      {(() => {
                        const iso = deriveIsoFromCurrency(currency);
                        const flag = getFlagEmoji(iso);
                        return (
                          <span className="text-xl" role="img" aria-label={iso}>
                            {flag}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                ))
            )}
          </div>
          <button
            type="button"
            className="border rounded outline-none cursor-pointer p-2 bg-orange-500 text-white font-gotham mt-4"
            onClick={() => setShowCurrencyModal(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default FilterTabs;
