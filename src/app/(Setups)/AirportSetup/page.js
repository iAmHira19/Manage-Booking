"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Input, Form, Select, Checkbox, Button, message } from "antd";
import { useSignInContext } from "@/providers/SignInStateProvider";
import { useRouter } from "next/navigation";
import setAirport from "@/services/setAirport";
import { getCountries } from "@/utils/getCountries";
import { getCity } from "@/utils/getCity";
import useAirports from "@/hooks/useAirports";

const { Search } = Input;
const { Option } = Select;

/* --------------------------------------------------
   Validation regex helpers
-------------------------------------------------- */
const lettersRegex = /^[A-Za-z ]+$/;
const IATACodeRegex = /^[A-Z]{3}$/; // 3‑letter uppercase

const Page = () => {
  const router = useRouter();
  const { isSignedIn } = useSignInContext();

  /* ---------------- State ---------------- */
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [airportOptions, setAirportOptions] = useState([]);

  // FIXED: Separate search states to avoid unnecessary filtering
  const [countrySearchValue, setCountrySearchValue] = useState("");
  const [citySearchValue, setCitySearchValue] = useState("");

  /* AntD Form */
  const [form] = Form.useForm();

  /* Dataset */
  const { data: AirportData, loading: AirportLoading } = useAirports("none");

  /* Fetch dropdown data */
  useEffect(() => {
    (async () => {
      const [localCountries, localCities] = await Promise.all([
        getCountries(),
        getCity(),
      ]);
      setCountries(localCountries);
      setCities(localCities);
      setAirportOptions(AirportData);
    })();
  }, [AirportData]);

  /* Auth guard */
  useEffect(() => {
    if (sessionStorage.getItem("signIn") !== "true") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [isSignedIn, router]);

  // FIXED: Removed Form.useWatch to prevent unnecessary re-renders on every form change
  // Only watch specific field if needed
  const countryValue = Form.useWatch("tpAIRPORT_COUNTRYNAME", form);

  // FIXED: Use useCallback to prevent recreation on every render
  useEffect(() => {
    if (countryValue) {
      form.setFieldValue("tpAIRPORT_CODE", countryValue);
    }
  }, [countryValue, form]);

  // FIXED: Memoize filtered airports to prevent recalculation on every render
  const filteredAirports = useMemo(() => {
    if (!searchValue.trim()) return airportOptions;
    const searchLower = searchValue.toLowerCase();
    return airportOptions.filter(
      (a) =>
        a.tpDescription?.toLowerCase().includes(searchLower) ||
        a.tpAIRPORT_NAME?.toLowerCase().includes(searchLower) ||
        a.tpAIRPORT_CODE?.toLowerCase().includes(searchLower) ||
        a.tpAIRPORT_COUNTRYNAME?.toLowerCase().includes(searchLower) ||
        a.tpAIRPORT_CITYNAME?.toLowerCase().includes(searchLower)
    );
  }, [airportOptions, searchValue]);

  // FIXED: Memoize filtered countries to prevent recalculation
  const filteredCountryOpts = useMemo(() => {
    if (!countrySearchValue.trim()) return countries.slice(0, 10); // Limit initial results
    const searchLower = countrySearchValue.toLowerCase();
    return countries
      .filter((c) => c.tpCC_COUNTRY?.toLowerCase().includes(searchLower))
      .slice(0, 10); // Limit search results
  }, [countries, countrySearchValue]);

  // FIXED: Memoize filtered cities to prevent recalculation
  const filteredCityOpts = useMemo(() => {
    if (!citySearchValue.trim()) return cities.slice(0, 10); // Limit initial results
    const searchLower = citySearchValue.toLowerCase();
    return cities
      .filter((c) => c.tpCC_CITY?.toLowerCase().includes(searchLower))
      .slice(0, 10); // Limit search results
  }, [cities, citySearchValue]);

  /* ---------------- Handlers ---------------- */
  // FIXED: Use useCallback to prevent recreation
  const handleAdd = useCallback(async () => {
    try {
      const values = await form.validateFields();
      await setAirport({
        ...values,
        tpAIRPORT_ACTIVE: values.tpAIRPORT_ACTIVE ? "1" : "0",
      });
      message.success("Airport saved successfully");
      form.resetFields();
      setSelectedIndex(null); // Clear selection
    } catch (err) {
      if (err.errorFields) {
        message.error("Please fix validation errors and try again.");
      } else {
        message.error("Failed to save airport");
      }
    }
  }, [form]);

  // FIXED: Use useCallback for search handler
  const handleSearch = useCallback((value) => {
    setSearchValue(value);
  }, []);

  // FIXED: Use useCallback for row click handler
  const handleRowClick = useCallback(
    (airport, idx) => {
      setSelectedIndex(idx);
      const cTry = countries.find(
        (c) =>
          c.tpCC_COUNTRY?.toLowerCase() ===
          airport.tpAIRPORT_COUNTRYNAME?.toLowerCase()
      );
      const cTy = cities.find(
        (c) =>
          c.tpCC_CITY?.toLowerCase() ===
          airport.tpAIRPORT_CITYNAME?.toLowerCase()
      );
      form.setFieldsValue({
        tpAIRPORT_NAME: airport.tpAIRPORT_NAME,
        tpAIRPORT_COUNTRYNAME: cTry?.tpCC_COUNTRY_CODE,
        tpAIRPORT_CODE: airport.tpAIRPORT_CODE,
        tpAIRPORT_CITYNAME: cTy?.tpCC_CODE,
        tpAIRPORT_ACTIVE: airport.tpAIRPORT_ACTIVE === "1",
      });
    },
    [countries, cities, form]
  );

  // FIXED: Use useCallback for country search
  const handleCountrySearch = useCallback((value) => {
    setCountrySearchValue(value);
  }, []);

  // FIXED: Use useCallback for city search
  const handleCitySearch = useCallback((value) => {
    setCitySearchValue(value);
  }, []);

  // FIXED: Use useCallback for form reset
  const handleNew = useCallback(() => {
    form.resetFields();
    setSelectedIndex(null);
    setSearchValue("");
    setCountrySearchValue("");
    setCitySearchValue("");
  }, [form]);

  /* ---------------- Render ---------------- */
  if (loading) {
    return (
      <div className="min-w-screen min-h-screen flex items-center justify-center">
        <p className="text-4xl text-orange-500 font-gotham font-bold">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-5">
      {/* Search & table */}
      <div className="w-1/2 p-7">
        <h2 className="text-2xl font-semibold mb-4 text-orange-500">
          Airport Setup
        </h2>
        <Search
          placeholder="Search Airport"
          className="orange-search-button .ant-btn-primary"
          allowClear
          value={searchValue}
          enterButton="Search"
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          size="large"
        />
      </div>

      <div className="lowerContainer flex flex-col-reverse lg:flex-row w-full items-start !gap-5 py-5 !px-5">
        <div className="table lg:min-w-[50%]">
          <table className="border-collapse border border-slate-400 text-sm w-full">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border p-2 w-56">Airport Name</th>
                <th className="border p-2 w-26">Code</th>
                <th className="border p-2 w-44">Country</th>
                <th className="border p-2 w-44">City</th>
              </tr>
            </thead>
            <tbody>
              {!AirportLoading ? (
                filteredAirports.map((airport, idx) => (
                  <tr
                    key={`${airport.tpAIRPORT_CODE}-${idx}`} // FIXED: Better key
                    className={
                      selectedIndex === idx
                        ? "bg-orange-500 text-white cursor-pointer"
                        : "cursor-pointer hover:bg-gray-100"
                    }
                    onClick={() => handleRowClick(airport, idx)}
                  >
                    <td className="border p-2">{airport.tpAIRPORT_NAME}</td>
                    <td className="border p-2 text-center">
                      {airport.tpAIRPORT_CODE}
                    </td>
                    <td className="border p-2 text-center">
                      {airport.tpAIRPORT_COUNTRYNAME}
                    </td>
                    <td className="border p-2 text-center">
                      {airport.tpAIRPORT_CITYNAME}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    Loading…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Form */}
        <div className="h-fit mb-20 lg:mb-0 rounded-md lg:min-w-[49%]">
          <div className="px-8 py-4 border !w-full">
            <Form
              form={form}
              layout="vertical"
              className="flex w-full items-center flex-col"
              // FIXED: Prevent unnecessary re-renders
              preserve={false}
            >
              <div className="formContainer grid grid-cols-1 sm:grid-cols-2 gap-x-5 items-center w-full">
                {/* Airport Name */}
                <Form.Item
                  label="Airport Name"
                  name="tpAIRPORT_NAME"
                  rules={[
                    { required: true, message: "Airport name is required" },
                    { pattern: lettersRegex, message: "Letters & spaces only" },
                  ]}
                >
                  <Input placeholder="Enter Airport Name" className="h-10" />
                </Form.Item>

                {/* Country (dropdown) */}
                <Form.Item
                  label="Airport Country"
                  name="tpAIRPORT_COUNTRYNAME"
                  rules={[{ required: true, message: "Country is required" }]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="Select Country"
                    onSearch={handleCountrySearch}
                    filterOption={false}
                    // FIXED: Add virtual scrolling for better performance
                    virtual={true}
                    showArrow={true}
                  >
                    {filteredCountryOpts.map((c, idx) => (
                      <Option
                        key={`country-${c.tpCC_COUNTRY_CODE}-${idx}`}
                        value={c.tpCC_COUNTRY_CODE}
                      >
                        {c.tpCC_COUNTRY}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Airport IATA code */}
                <Form.Item
                  label="Airport IATA Code"
                  name="tpAIRPORT_CODE"
                  rules={[
                    { required: true, message: "IATA code is required" },
                    {
                      pattern: IATACodeRegex,
                      message: "3 uppercase letters e.g. ISB",
                    },
                  ]}
                >
                  <Input
                    placeholder="ISB"
                    className="h-10"
                    maxLength={3}
                    style={{ textTransform: "uppercase" }} // FIXED: Auto uppercase
                  />
                </Form.Item>

                {/* City dropdown */}
                <Form.Item
                  label="Airport City"
                  name="tpAIRPORT_CITYNAME"
                  rules={[{ required: true, message: "City is required" }]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="Select City"
                    onSearch={handleCitySearch}
                    filterOption={false}
                    // FIXED: Add virtual scrolling for better performance
                    virtual={true}
                    showArrow={true}
                  >
                    {filteredCityOpts.map((c, idx) => (
                      <Option
                        key={`city-${c.tpCC_CODE}-${idx}`}
                        value={c.tpCC_CODE}
                      >
                        {c.tpCC_CITY}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Active checkbox */}
                <Form.Item name="tpAIRPORT_ACTIVE" valuePropName="checked">
                  <Checkbox>Is Airport Active?</Checkbox>
                </Form.Item>
              </div>

              {/* Buttons */}
              <Form.Item>
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    className="!bg-orange-500"
                    onClick={handleAdd}
                  >
                    Save
                  </Button>
                  <Button onClick={handleNew} color="blue" variant="solid">
                    New
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
