"use client";
import React, { useEffect, useState } from "react";
import styles from "./InputBox.module.css";
import { Select } from "antd";
import "./InputBoxText.css";
import { getCountries } from "@/utils/getCountries";
const InputBox = ({
  className,
  border,
  airline,
  Placeholder,
  InputIcon,
  RangePicker,
  options = [],
  ReadOnly,
  onChange,
  name,
  value,
  disableDates,
  disableNextDates,
  disableOnlyPrevDates,
  minDate,
  disableAdult,
  disableChild,
  disableInfant,
  minDateProp,
  smallScreenPadding,
}) => {
  const [selected, setSelected] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [searchValue, setSearchValue] = useState("");
  const [storedValue, setStoredValue] = useState("");
  const [countryMap, setCountryMap] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getCountries();
        const map = {};
        (Array.isArray(list) ? list : []).forEach((c) => {
          const name = String(c?.tpCC_COUNTRY || "").trim().toUpperCase();
          const code = String(c?.tpCC_COUNTRY_CODE || "").trim().toUpperCase();
          if (name && code) map[name] = code;
        });
        if (mounted) setCountryMap(map);
      } catch (_) {
        if (mounted) setCountryMap({});
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const handleAirlineChange = (selectedObject) => {
    if (!selectedObject) {
      setSelected("");
      setStoredValue("");
      setSearchValue("");
      onChange(name, null);
      return;
    }
    const fullObject = filteredOptions.find(
      (option) => option.value === selectedObject.value
    );
    if (!fullObject) return;
    setSelected(fullObject.label); // Ensure label is displayed
    setStoredValue(fullObject.value); // Store value for consistency
    setSearchValue("");
    onChange(name, fullObject.value, fullObject.label); // Pass both value and label to onChange
  };

  const renderAirlineOption = (option, searchValue = "") => {
    const code = (option.value || "").toString().split("~")[0] || "";
    const logoSrc = `/AirlineLogo/${code}.png`;
    return (
      <div className="flex items-center justify-between gap-3 w-full">
        <span className="flex-1 min-w-0">
          {searchValue ? (
            highlightMatchingText(option.label, searchValue)
          ) : (
            <span className="font-light">{option.label}</span>
          )}
        </span>
        <img
          src={logoSrc}
          alt={code}
          className="h-5 w-5 object-contain shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  };

  const getLabelForValue = (value) => {
    const matchedOption = options.find((option) => option.value === value);
    return matchedOption
      ? `${matchedOption.cityName} (${matchedOption.value})`
      : value;
  };

  const renderAirportOption = (option, searchValue = "") => {
    const iata = String((option.value || "").toString().split("~")[0] || "").toUpperCase();
    const byProp = (option.countryCode || "").toString().toUpperCase();
    const countryNameUpper = String(option.countryName || "").trim().toUpperCase();
    const byName = countryMap[countryNameUpper] || "";
    const countryCode = byProp || byName;
    const encodedFolder = encodeURIComponent("The Flags of Whole Countries");
    const folder = "The Flags of Whole Countries";
    const aliasMap = {
      "SAUDI ARABIA": ["SA", "KSA", "SAUDI ARABIA"],
      "UNITED ARAB EMIRATES": ["AE", "UAE", "UNITED ARAB EMIRATES"],
      "UNITED KINGDOM": ["GB", "UK", "UNITED KINGDOM"],
      "UNITED STATES": ["US", "USA", "UNITED STATES"],
      "RUSSIA": ["RU", "RUS", "RUSSIA"],
      "IRAN": ["IR", "IRN", "IRAN"],
      "PAKISTAN": ["PK", "PAK", "PAKISTAN"],
      "FRANCE": ["FR", "FRA", "FRANCE"],
      "FRANCE, METROPOLITAN": ["FR", "FRA", "FRANCE"],
      "FRENCH POLYNESIA": ["PF", "FRENCH POLYNESIA"],
    };
    const nameAliases = aliasMap[countryNameUpper] || [countryNameUpper];
    const buildFlagCandidates = (cc, nameList) => {
      const list = [];
      const pushForToken = (raw) => {
        if (!raw) return;
        const base = String(raw).trim();
        const variants = new Set();
        const proper = base
          .toLowerCase()
          .split(/\s+/)
          .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
          .join(" ");
        variants.add(base.toUpperCase());
        variants.add(base.toLowerCase());
        variants.add(proper);
        // hyphen and underscore variants
        Array.from([...variants]).forEach((v) => {
          variants.add(v.replace(/\s+/g, "-"));
          variants.add(v.replace(/\s+/g, "_"));
        });
        variants.forEach((t) => {
          list.push(
            `/${encodedFolder}/${t}.png`,
            `/${folder}/${t}.png`,
            `/${encodedFolder}/${t}.jpg`,
            `/${folder}/${t}.jpg`,
            `/${encodedFolder}/${t}.jpeg`,
            `/${folder}/${t}.jpeg`,
            `/${encodedFolder}/${t}.webp`,
            `/${folder}/${t}.webp`
          );
        });
      };
      pushForToken(cc);
      (nameList || []).forEach(pushForToken);
      return list;
    };
    const airportOverride = {
      JED: ["SA", "KSA", "SAUDI ARABIA"],
      AAA: ["PF", "FRENCH POLYNESIA", "GY"],
    };
    const overrideTokens = airportOverride[iata];
    const flagCandidates = overrideTokens
      ? buildFlagCandidates("", overrideTokens)
      : buildFlagCandidates(countryCode, nameAliases);
    const flagSrc = flagCandidates.length > 0 ? flagCandidates[0] : null;
    return (
      <div
        className="md:px-2"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "Gotham",
          fontWeight: 300,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Gotham",
            fontWeight: 300,
          }}
        >
          <div>
            {searchValue
              ? highlightMatchingText(option.cityName, searchValue)
              : option.cityName}
            ,{" "}
            {searchValue
              ? highlightMatchingText(option.countryName, searchValue)
              : option.countryName}
          </div>
          <div style={{ fontSize: "12px", fontWeight: 300 }}>
            {searchValue
              ? highlightMatchingText(option.airportName, searchValue)
              : option.airportName}
          </div>
        </div>
        <span className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 border text-xs">
            <span className="font-semibold">
              {searchValue
                ? highlightMatchingText(option.value?.split("~")[0], searchValue)
                : option.value?.split("~")[0]}
            </span>
            {flagSrc && (
              <img
                src={flagSrc}
                alt={countryCode}
                className="h-4 w-6 object-contain rounded-sm"
                data-idx="0"
                onError={(e) => {
                  const el = e.currentTarget;
                  const i = parseInt(el.getAttribute("data-idx") || "0", 10);
                  const next = flagCandidates[i + 1];
                  if (next) {
                    el.setAttribute("data-idx", String(i + 1));
                    el.src = next;
                  } else {
                    el.style.display = "none";
                  }
                }}
              />
            )}
          </span>
        </span>
      </div>
    );
  };

  const handleAirportChange = (selectedObject) => {
    if (!selectedObject) {
      setSelected("");
      setStoredValue("");
      setSearchValue("");
      onChange(name, null);
      return;
    }
    const fullObject = filteredOptions.find(
      (option) => option.value === selectedObject.value
    );
    setSelected(`${fullObject.cityName} (${fullObject.value?.split("~")[0]})`);
    setStoredValue(`${fullObject.value}`);
    setSearchValue("");
    onChange(name, selectedObject.value, fullObject.cityName);
  };
  const handleSearch = (searchValue) => {
    setSearchValue(searchValue);
    const filtered = options.filter((option) => {
      return (
        option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        option.value.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
    let matchGroup = [];
    if (searchValue) {
      const searchKey = searchValue.split("~")?.[0].toLowerCase();
      matchGroup = filtered.filter((opt) =>
        opt.value.toLowerCase().startsWith(searchKey)
      );
    }

    const others = filtered.filter((opt) => !matchGroup.includes(opt));
    if (matchGroup.length > 0) {
      setFilteredOptions([...matchGroup, ...others]);
    } else {
      setFilteredOptions(filtered);
    }
  };

  const handleDropdownVisibleChange = (open) => {
    if (open && selected) {
      setFilteredOptions(
        options.filter((option) => option.value === storedValue)
      );
    } else {
      setFilteredOptions(options);
    }
  };

  const escapeRegExp = (string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlightMatchingText = (label, searchValue) => {
    const safeSearch = escapeRegExp(searchValue);
    const regex = new RegExp(`(${safeSearch})`, "gi");
    const parts = label.split(regex);
    return parts.map((part, index) => {
      if (part.toLowerCase() === searchValue.toLowerCase()) {
        return (
          <span
            key={`highlight-${index}`}
            style={{
              color: "orange",
              fontWeight: "bold",
              fontFamily: "Gotham",
            }}
          >
            {part}
          </span>
        );
      }
      return (
        <span key={index} style={{ fontFamily: "Gotham", fontWeight: 300 }}>
          {part}
        </span>
      );
    });
  };

  return (
    <div
      className={`flex items-center ${
        border && "border"
      } px-2 md:px-1 overflow-hidden relative rounded overflow-x-hidden ${className} md:text-2xl font-light font-gotham`}
    >
      <span className="text-blue-900 pl-2 md:pl-5 font-gotham font-light !text-xs md:text-lg">
        {InputIcon}
      </span>
      {RangePicker ? (
        <div
          className={`${smallScreenPadding} md:py-2 md:px-2 outline-none w-full z-0 font-gotham font-light rpicker`}
        >
          <RangePicker
            placeholder={Placeholder}
            allowClear={false}
            className={`custom-range-picker ${styles.customRangePicker} font-gotham font-light !text-xs md:text-[25px] !w-full border-none outline-none md:pt-2 md:pb-2`}
            value={value}
            disabledDate={(current) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const currentDate = current.toDate();

              if (disableAdult) {
                const maxDOB = new Date(today); // Max allowed DOB: 12 years ago
                maxDOB.setFullYear(maxDOB.getFullYear() - 12);

                if (minDateProp) {
                  const [day, month, year] = minDateProp.split("/").map(Number);
                  const minDOB = new Date(year, month - 1, day);
                  minDOB.setHours(0, 0, 0, 0);

                  // ⛔ Block dates before minDateProp or after 12 years ago
                  return currentDate < minDOB || currentDate > maxDOB;
                }

                // ⛔ If no minDateProp, just block after 12 years ago
                return currentDate > maxDOB;
              }

              if (disableChild) {
                const maxDOB = new Date(today);
                maxDOB.setFullYear(today.getFullYear() - 12);
                maxDOB.setDate(maxDOB.getDate() + 1);

                const minDOB = new Date(today);
                minDOB.setFullYear(today.getFullYear() - 2);

                return currentDate < maxDOB || currentDate > minDOB;
              }

              if (disableInfant) {
                const maxDOB = new Date(today);
                maxDOB.setFullYear(today.getFullYear() - 2);
                maxDOB.setDate(maxDOB.getDate() + 1);

                const minDOB = new Date(today);

                return currentDate < maxDOB || currentDate > minDOB;
              }

              if (disableDates) {
                const maxDate = new Date(
                  today.getFullYear() + 1,
                  today.getMonth(),
                  today.getDate() - 1
                );

                if (currentDate < today || currentDate > maxDate) return true;

                if (minDate && currentDate < new Date(minDate)) return true;
              } else if (disableNextDates) {
                if (currentDate >= today) return true;
              } else if (disableOnlyPrevDates) {
                if (currentDate <= today) return true;

                if (minDateProp) {
                  const [day, month, year] = minDateProp.split("/").map(Number);
                  const parsedMinDate = new Date(year, month - 1, day);
                  parsedMinDate.setHours(0, 0, 0, 0);

                  if (currentDate < parsedMinDate) return true;
                }
              }
              return false;
            }}
            format="DD-MM-YYYY"
            onChange={(dateString) => onChange(dateString)}
          />
        </div>
      ) : (
        <Select
          style={{ fontSize: "16px" }}
          allowClear
          placeholder={Placeholder}
          showSearch
          value={
            selected
              ? { value: storedValue, label: selected }
              : value
              ? { value: value, label: getLabelForValue(value) }
              : undefined
          }
          onSearch={handleSearch}
          onChange={airline ? handleAirlineChange : handleAirportChange}
          optionFilterProp="children"
          options={filteredOptions.slice(0, 5).map((option, index) => ({
            ...option,
            key: index,
            label: airline ? (
              renderAirlineOption(option, searchValue)
            ) : searchValue ? (
              renderAirportOption(option, searchValue)
            ) : (
              renderAirportOption(option)
            ),
            children: option.label,
          }))}
          onDropdownVisibleChange={handleDropdownVisibleChange}
          suffixIcon={null}
          notFoundContent={<div>No matches, please try again!</div>}
          dropdownStyle={{
            border: "none",
            width: "90vw",
            maxWidth: "30rem",
          }}
          className={`md:py-2 text-base px-2 outline-none font-normal overflow-hidden h-full w-full ${styles.select} ${styles.antSelect} ${styles.customSelect}`}
          type="text"
          name={name}
          readOnly={ReadOnly}
          dropdownRender={(options) => (
            <div
              style={{
                maxHeight: 300,
                overflowY: "auto",
                fontFamily: "Gotham",
                fontWeight: 300,
              }}
            >
              {options}
            </div>
          )}
          labelInValue
        />
      )}
    </div>
  );
};

export default InputBox;
