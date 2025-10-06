"use client";
import React, { useEffect, useState } from "react";
import { Input, Form, Select, Checkbox, Button, message } from "antd";
import { useSignInContext } from "@/providers/SignInStateProvider";
import { useRouter } from "next/navigation";
import { getCountries } from "@/utils/getCountries";
import useAirline from "@/hooks/useAirline";
import setAirline from "@/services/setAirline";
import { useForm } from "antd/es/form/Form";

const { Search } = Input;
const { Option } = Select;

/* --------------------------------------------------
   Regex helpers for validation
-------------------------------------------------- */
const onlyLetters = /^[A-Za-z ()]+$/;
const IATARegex = /^[A-Z]{2,3}$/; // 2–3 upper‑case letters
const ICAORegex = /^[A-Z]{3,4}$/; // 3–4 upper‑case letters
const countryCodeRegex = /^[A-Z]{2}$/;

const Page = () => {
  const router = useRouter();
  const { isSignedIn } = useSignInContext();

  /* ----- State ----- */
  const [country, setCountry] = useState([]);
  const [airline, setAirlineOption] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchedAirline, setSearchedAirline] = useState("");
  const [filteredAirline, setFilteredAirline] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  /* Ant Design Form instance */
  const [form] = useForm();

  /* Airline dataset */
  const { data: AirlineData, err: AirlineError } = useAirline();

  /* Fetch dropdown lists */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const localCountry = await getCountries();
        const countries = localCountry.map((c) => ({
          label: c.tpCC_COUNTRY,
          value: c.tpCC_COUNTRY_CODE,
        }));
        setCountry(countries);
        
        // Only set airline data if it exists and is not empty
        if (AirlineData && Array.isArray(AirlineData)) {
          setAirlineOption(AirlineData);
          setFilteredAirline(AirlineData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load data. Please try again.");
      }
    };
    fetchData();
  }, [AirlineData]);

  /* Route guard */
  useEffect(() => {
    if (sessionStorage.getItem("signIn") !== "true") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [isSignedIn, router]);

  /* Submit handler (Add button) */
  const handleAdd = async () => {
    try {
      const values = await form.validateFields(); // runs validation
      const payload = {
        ...values,
        tpAL_ACTIVE: values.tpAL_ACTIVE ? "1" : "0",
      };
      
      await setAirline(payload);
      message.success("Airline saved successfully");
      
      // Reset form and selection
      form.resetFields();
      setSelectedRow(null);
      
      // Refresh airline data by re-fetching
      // Note: In a real app, you might want to add the new airline to the list
      // or trigger a data refresh from the API
      window.location.reload(); // Simple refresh for now
      
    } catch (err) {
      console.error("Error saving airline:", err);
      // validation failed or API error
      if (err.errorFields) {
        message.error("Please fix validation errors and try again.");
      } else {
        message.error("Failed to save airline. Please check your connection and try again.");
      }
    }
  };

  /* Loading screen */
  if (loading) {
    return (
      <div className="min-w-screen min-h-screen flex items-center justify-center">
        <p className="text-4xl text-orange-500 font-gotham font-bold">
          Loading...
        </p>
      </div>
    );
  }

  /* Error handling for API errors */
  if (AirlineError) {
    return (
      <div className="min-w-screen min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-500 font-gotham font-bold mb-4">
            Error Loading Airlines
          </p>
          <p className="text-gray-600 mb-4">{AirlineError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Search section */}
      <div className="w-1/2 p-7">
        <h2 className="text-3xl font-gotham font-semibold mb-4 text-orange-500">
          Airline Setup
        </h2>
        <Search
          placeholder="Search airline"
          className="orange-search-button .ant-btn-primary"
          allowClear
          value={searchedAirline}
          onChange={(e) => {
            const searchValue = e.target.value;
            setSearchedAirline(searchValue);
            
            // Real-time filtering as user types
            if (searchValue === "") {
              // If search is cleared, show all airlines
              setFilteredAirline(airline);
            } else {
              // Filter airlines in real-time based on search input
              const filtered = airline.filter(
                (a) =>
                  a.tpAL_NAME.toLowerCase().includes(searchValue.toLowerCase()) ||
                  a.tpAL_DISPLAYNAME.toLowerCase().includes(searchValue.toLowerCase()) ||
                  a.tpAL_IATA.toLowerCase().includes(searchValue.toLowerCase())
              );
              setFilteredAirline(filtered);
            }
            
            // Always reset selection and form when filtering
            setSelectedRow(null);
            form.resetFields();
          }}
          onSearch={(value) => {
            // Since we're already filtering in real-time via onChange,
            // we just need to ensure the search value is set and selection is reset
            setSearchedAirline(value);
            setSelectedRow(null);
            form.resetFields();
          }}
          enterButton="Search"
          size="large"
        />
      </div>

      {/* Table + Form section */}
      <div className="flex flex-col-reverse lg:flex-row w-full items-start px-4">
        {/* Airline table */}
        <div className="table mt-10 lg:mx-5 lg:w-[50%]">
          <table className="border-collapse border border-slate-400 w-full">
            <thead>
              <tr className="bg-blue-900 text-white text-sm">
                <th className="border p-1">Airline Name</th>
                <th className="border p-1">Airline Code</th>
                <th className="border p-1">Country</th>
                <th className="border p-1">ICAO</th>
                <th className="border p-1">IATA</th>
              </tr>
            </thead>
            <tbody>
              {filteredAirline && filteredAirline.length > 0 ? (
                filteredAirline.map((item, idx) => (
                <tr
                  key={idx}
                  className={
                    selectedRow === idx ? "bg-orange-500 text-white" : ""
                  }
                  onClick={() => {
                    console.log("item: ", item);
                    setSelectedRow(idx);
                    const countryCode = country.find(
                      (c) =>
                        c.label.toLowerCase() ===
                        item.tpAL_COUNTRY.toLowerCase()
                    );
                    form.setFieldsValue({
                      tpAL_NAME: item.tpAL_NAME,
                      tpAL_COUNTRY: item.tpAL_COUNTRY,
                      tpAL_COUNTRYCODE: countryCode?.value || "",
                      tpAL_IATA: item.tpAL_IATA,
                      tpAL_ICAO: item.tpAL_ICAO,
                      tpAL_ACTIVE: item.tpAL_ACTIVE == 1,
                    });
                  }}
                >
                  <td className="border p-2 text-sm">{item.tpAL_NAME}</td>
                  <td className="border p-2 text-sm text-center">
                    {item.tpAL_CODE}
                  </td>
                  <td className="border p-2 text-sm text-center">
                    {item.tpAL_COUNTRY}
                  </td>
                  <td className="border p-2 text-sm text-center">
                    {item.tpAL_ICAO}
                  </td>
                  <td className="border p-2 text-sm text-center">
                    {item.tpAL_IATA}
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border p-4 text-center text-gray-500">
                    {searchedAirline ? "No airlines found matching your search" : "No airlines available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Form */}
        <div className="border mt-10 rounded-md w-full lg:w-1/2">
          <div className="px-8 py-7 w-full">
            <Form
              form={form}
              layout="vertical"
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 items-center"
            >
              {/* Airline Name */}
              <Form.Item
                label="Airline Name"
                name="tpAL_NAME"
                rules={[
                  { required: true, message: "Airline name is required" },
                  {
                    pattern: onlyLetters,
                    message: "Letters, spaces and parenthesis only",
                  },
                ]}
              >
                <Input placeholder="Enter Airline Name" className="h-10" />
              </Form.Item>

              {/* Country (dropdown) */}
              <Form.Item
                label="Airline Country"
                name="tpAL_COUNTRY"
                rules={[{ required: true, message: "Country is required" }]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Select Country"
                  optionFilterProp="children"
                >
                  {country.map((c, idx) => (
                    <Option key={idx} value={c.label}>
                      {c.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Country Code */}
              <Form.Item
                label="Country Code"
                name="tpAL_COUNTRYCODE"
                rules={[
                  { required: true, message: "Country code is required" },
                  {
                    pattern: countryCodeRegex,
                    message: "Use 2 uppercase letters (ISO) e.g. PK",
                  },
                ]}
              >
                <Input placeholder="PK" className="h-10" />
              </Form.Item>

              {/* IATA */}
              <Form.Item
                label="IATA Code"
                name="tpAL_IATA"
                rules={[
                  { required: true, message: "IATA code is required" },
                  {
                    pattern: IATARegex,
                    message: "2–3 uppercase letters e.g. EK",
                  },
                ]}
              >
                <Input placeholder="EK" className="h-10" maxLength={3} />
              </Form.Item>

              {/* ICAO */}
              <Form.Item
                label="ICAO Code"
                name="tpAL_ICAO"
                rules={[
                  { required: true, message: "ICAO code is required" },
                  {
                    pattern: ICAORegex,
                    message: "3–4 uppercase letters e.g. UAE",
                  },
                ]}
              >
                <Input placeholder="UAE" className="h-10" maxLength={4} />
              </Form.Item>

              {/* Active checkbox */}
              <Form.Item
                label="Status"
                name="tpAL_ACTIVE"
                valuePropName="checked"
              >
                <Checkbox>Is Airline Active?</Checkbox>
              </Form.Item>
            </Form>
          </div>

          {/* Buttons */}
          <div className="w-full flex justify-center mb-5 gap-2">
            <Button
              className="!bg-orange-500 !text-white w-20"
              onClick={() => form.resetFields()}
            >
              New
            </Button>
            <Button
              className="!bg-orange-500 !text-white w-20"
              onClick={handleAdd}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
