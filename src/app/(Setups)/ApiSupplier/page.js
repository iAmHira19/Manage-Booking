"use client";
import React, { useEffect, useState } from "react";
import { Input, Form, Select, Checkbox, Button } from "antd";
import "./ApiSupplierSetup.css";
import { useSignInContext } from "@/providers/SignInStateProvider";
import { useRouter } from "next/navigation";
import useApiSupplier from "@/hooks/useApiSupplier";
import { getCurrency } from "@/utils/getCurrency";
import useGDSCategory from "@/hooks/useGDSCategory";

const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { isSignedIn } = useSignInContext();
  const [loading, setLoading] = useState(true);
  const [apiSupplierData, setApiSupplierData] = useState([]);
  // **NEW**: Add state for filtered data and search term
  const [filteredApiSupplierData, setFilteredApiSupplierData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const { data: ApiSupplierData } = useApiSupplier();
  const [clickedRow, setClickedRow] = useState(null);
  const [gdsCategories, setGDSCategories] = useState([]);
  const data = useGDSCategory();

  useEffect(() => {
    setGDSCategories(data);
  }, [data]);

  useEffect(() => {
    if (sessionStorage.getItem("signIn") !== "true") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    setApiSupplierData(ApiSupplierData);
    // **NEW**: Initialize filtered data with all data
    setFilteredApiSupplierData(ApiSupplierData);
  }, [ApiSupplierData]);

  // **NEW**: Add search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredApiSupplierData(apiSupplierData);
      return;
    }

    const filtered = apiSupplierData.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item?.tpGDS_NAME?.toLowerCase().includes(searchLower) ||
        item?.tpGDS_CONTACTPERSON?.toLowerCase().includes(searchLower) ||
        item?.tpGDS_CONTACTPHONE?.toLowerCase().includes(searchLower) ||
        item?.tpGDS_CODE?.toLowerCase().includes(searchLower) ||
        item?.tpGDS_ADDRESS?.toLowerCase().includes(searchLower) ||
        item?.tpGDS_CONTACTEMAIL?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredApiSupplierData(filtered);
    // **NEW**: Reset clicked row when searching
    setClickedRow(null);
  }, [searchTerm, apiSupplierData]);

  // **NEW**: Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // **NEW**: Handle search button click
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // **NEW**: Clear search functionality
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    const fetchData = async () => {
      let data = await getCurrency();
      setCurrencies(data);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <div className="min-w-screen min-h-screen flex items-center justify-center">
          <p className="text-4xl text-orange-500 font-gotham font-bold ">
            Loading...
          </p>
        </div>
      </>
    );
  }

  const handleRowClicked = (item, idx) => {
    setClickedRow(idx);
    console.log("item: ", item);
    const updatedValues = {};
    const formFields = form.getFieldsValue();
    const fieldNames = Object.keys(formFields);
    fieldNames.forEach((fName) => {
      switch (fName) {
        case "supplierName":
          updatedValues[fName] = item?.tpGDS_NAME;
          break;
        case "APISupplierCode":
          updatedValues[fName] = item?.tpGDS_CODE;
          break;
        case "Address":
          updatedValues[fName] = item?.tpGDS_ADDRESS;
          break;
        case "contactPerson":
          updatedValues[fName] = item?.tpGDS_CONTACTPERSON;
          break;
        case "contactNo":
          updatedValues[fName] = item?.tpGDS_CONTACTPHONE;
          break;
        case "email":
          updatedValues[fName] = item?.tpGDS_CONTACTEMAIL;
          break;
        case "paymentBasis":
          updatedValues[fName] = item?.tpGDS_PAYMENTBASIS;
          break;
        case "currency":
          updatedValues[fName] = item?.tpGDS_CURRENCY;
          break;
        case "remember":
          updatedValues[fName] = item?.tp_ACTIVE == 1 ? true : false;
          break;
      }
    });
    form.setFieldsValue(updatedValues);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-1 py-10">
        <div className="w-full lg:w-2/4 px-2 lg:px-5 flex flex-col gap-y-3">
          <h2 className="text-lg md:text-3xl font-semibold mb-2 text-orange-500">
            API Supplier Setup
          </h2>
          {/* **ENHANCED**: Improved search input with better functionality */}
          <div className="flex gap-2 mb-3">
            <Input.Search
              placeholder="Search by supplier name, contact person, phone, code, address, or email..."
              enterButton="Search"
              size="middle"
              value={searchTerm}
              onChange={handleSearchChange}
              onSearch={handleSearch}
              allowClear
              onClear={handleClearSearch}
              className="flex-1"
            />
            {/* **NEW**: Search results counter */}
            {searchTerm && (
              <div className="flex items-center px-3 bg-gray-100 rounded text-sm text-gray-600 whitespace-nowrap">
                {filteredApiSupplierData.length} of {apiSupplierData.length}{" "}
                results
              </div>
            )}
          </div>

          <table className="mt-3 md:mt-5 border-collapse border w-full border-slate-400">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th
                  className="p-1 md:p-2 border border-slate-400 w-1/3 text-xs md:text-base font-gotham font-semibold"
                  onClick={() =>
                    console.log("apiSupplierData: ", apiSupplierData)
                  }
                >
                  API Supplier
                </th>
                <th className="p-1 md:p-2 border border-slate-400 w-1/3 text-xs md:text-base font-gotham font-semibold">
                  Contact Person
                </th>
                <th className="p-1 md:p-2 border border-slate-400 w-1/3 text-xs md:text-base font-gotham font-semibold">
                  Contact No
                </th>
              </tr>
            </thead>
            <tbody>
              {/* **CHANGED**: Use filteredApiSupplierData instead of apiSupplierData */}
              {filteredApiSupplierData.length > 0 ? (
                filteredApiSupplierData.map((item, idx) => (
                  <tr
                    key={item?.tpGDS_CODE}
                    className={`border cursor-pointer ${
                      idx === clickedRow
                        ? "bg-yellow-500 text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                    onClick={() => handleRowClicked(item, idx)}
                  >
                    <td className="border text-center p-2">
                      {/* **NEW**: Highlight search terms in results */}
                      {searchTerm ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item?.tpGDS_NAME?.replace(
                              new RegExp(`(${searchTerm})`, "gi"),
                              '<mark style="background-color: yellow; padding: 0;">$1</mark>'
                            ),
                          }}
                        />
                      ) : (
                        item?.tpGDS_NAME
                      )}
                    </td>
                    <td className="border text-center p-2">
                      {/* **NEW**: Highlight search terms in results */}
                      {searchTerm ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item?.tpGDS_CONTACTPERSON?.replace(
                              new RegExp(`(${searchTerm})`, "gi"),
                              '<mark style="background-color: yellow; padding: 0;">$1</mark>'
                            ),
                          }}
                        />
                      ) : (
                        item?.tpGDS_CONTACTPERSON
                      )}
                    </td>
                    <td className="border text-center p-2">
                      {/* **NEW**: Highlight search terms in results */}
                      {searchTerm ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item?.tpGDS_CONTACTPHONE?.replace(
                              new RegExp(`(${searchTerm})`, "gi"),
                              '<mark style="background-color: yellow; padding: 0;">$1</mark>'
                            ),
                          }}
                        />
                      ) : (
                        item?.tpGDS_CONTACTPHONE
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                /* **NEW**: No results message */
                <tr>
                  <td
                    colSpan="3"
                    className="border text-center p-4 text-gray-500"
                  >
                    {searchTerm
                      ? "No suppliers found matching your search."
                      : "No suppliers available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="w-full lg:w-1/2 mr-10 md:border border-slate-200 rounded shadow-sm">
          <div className="px-2 md:px-4 py-10">
            <Form
              form={form}
              layout="vertical"
              className="grid md:grid-cols-2 md:items-center md:justify-center md:gap-y-1 md:gap-x-7 md:text-base font-gotham font-normal"
            >
              <Form.Item
                label="Supplier Name"
                className="w-full"
                name="supplierName"
                rules={[
                  {
                    required: true,
                    message: "Supplier Name is a required field",
                  },
                ]}
              >
                <Input className="w-full !h-10 !bg-gray-50" readOnly />
              </Form.Item>
              <Form.Item
                label="API Supplier Code"
                name="APISupplierCode"
                className="w-full"
                rules={[
                  { required: true, message: "Api supplier code is required" },
                ]}
              >
                <Input className="w-full !h-10 !bg-gray-50" readOnly />
              </Form.Item>
              <Form.Item
                label="Address"
                name="Address"
                rules={[
                  {
                    required: true,
                    message: "Address is required",
                  },
                ]}
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                label="Contact Person Name"
                name="contactPerson"
                rules={[
                  {
                    required: true,
                    message: "Contact person name is required",
                  },
                ]}
                className="w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                label="Contact No."
                name="contactNo"
                rules={[
                  { required: true, message: "Contact number is required" },
                ]}
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                label="Email"
                className="w-full"
                name="email"
                rules={[{ required: true, message: "Email is required" }]}
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                label="Payment Basis"
                name="paymentBasis"
                rules={[
                  { required: true, message: "Payment basis is required" },
                ]}
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                label="Currency"
                className="w-full"
                name="currency"
                rules={[
                  { required: true, message: "Currency field is required" },
                ]}
              >
                <Select className="w-full !h-10 !border-none">
                  {currencies &&
                    currencies.length > 0 &&
                    currencies.map((item) => (
                      <Select.Option
                        value={item?.tpCUR_CODE}
                        key={item?.tpCUR_CODE}
                      >
                        {item?.tpCUR_DESCRIPTION}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Document Type"
                name="doc"
                rules={[
                  { required: true, message: "Document type is required" },
                ]}
                className="hidden"
              >
                <Select className="!w-full !h-10 !border-none">
                  <Select.Option value="credit">Credit</Select.Option>
                  <Select.Option value="advance">Advance</Select.Option>
                  <Select.Option value="NFA">Not From API</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="remember"
                valuePropName="checked"
                label="    "
                className=" items-center"
              >
                <Checkbox>Active This Customer</Checkbox>
              </Form.Item>
            </Form>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-1 md:p-2 border border-slate-400 text-xs md:text-sm font-gotham font-normal">
                  Product
                </th>
                <th className="p-1 md:p-2 border border-slate-400 text-xs md:text-sm font-gotham font-normal">
                  API Product Code
                </th>
                <th className="p-1 md:p-2 border border-slate-400 text-xs md:text-sm font-gotham font-normal">
                  GL Inventry Code
                </th>
                <th className="p-1 md:p-2 border border-slate-400 text-xs md:text-sm font-gotham font-normal">
                  Active
                </th>
              </tr>
            </thead>
            <tbody>
              {gdsCategories &&
                gdsCategories.length > 0 &&
                gdsCategories.map((item) => (
                  <tr className="apiSupplier" key={item.ctg_CODE}>
                    <td className="p-3 md:p-5 border-b text-xs md:text-base font-gotham font-light text-center">
                      {item.ctg_DESCRIPTION}
                    </td>
                    <td className="border text-sm">
                      <Form layout="vertical" className="flex" disabled>
                        <Select
                          className="!w-full !border-none"
                          placeholder="Select an option"
                        ></Select>
                      </Form>
                    </td>
                    <td className="border text-sm">
                      <Form layout="vertical" className="flex gap-7" disabled>
                        <Input
                          className="!w-full"
                          placeholder="Enter inventory code"
                        />
                      </Form>
                    </td>
                    <td className=" border-b text-center text-sm">
                      <Checkbox></Checkbox>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="w-full flex justify-center items-center mt-10 mb-3 gap-2">
            <Button
              className="!bg-orange-500 !font-gotham !font-bold !text-white"
              onClick={() => {
                form.validateFields();
              }}
            >
              Save
            </Button>
            <Button className="!bg-orange-500 !font-gotham !font-bold !text-white">
              Undo
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
