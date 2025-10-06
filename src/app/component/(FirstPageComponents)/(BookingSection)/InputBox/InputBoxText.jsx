"use client";
import React, { useState } from "react";
import styles from "./InputBox.module.css";
import { Select } from "antd";
import "./InputBoxText.css";
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

  const getLabelForValue = (value) => {
    const matchedOption = options.find((option) => option.value === value);
    return matchedOption
      ? `${matchedOption.cityName} (${matchedOption.value})`
      : value;
  };

  const renderAirportOption = (option, searchValue = "") => (
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
      <p>
        {searchValue
          ? highlightMatchingText(option.value?.split("~")[0], searchValue)
          : option.value?.split("~")[0]}
      </p>
    </div>
  );

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
              searchValue ? (
                highlightMatchingText(option.label, searchValue)
              ) : (
                <span className="font-light">{option.label}</span>
              )
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
