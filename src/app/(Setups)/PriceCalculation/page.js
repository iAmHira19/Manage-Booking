"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Select, Checkbox, DatePicker, message } from "antd";
import "./PriceCalculation.css";
import { Button } from "antd";
import { usePriceCalApi } from "@/utils/getPriceCalc";
import { usePriceCalCstmrTypDDApi } from "@/utils/getPriceCalCstmrTypDD";
import { useSignInContext } from "@/providers/SignInStateProvider";
import setPriceCalAPI from "@/services/setPriceCal"; // API
import delPriceCalAPI from "@/services/delPriceCal"; // API
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useForm } from "antd/es/form/Form";
const { Search } = Input;

const Page = () => {
  const router = useRouter();
  const [form] = useForm();
  const { isSignedIn, userId } = useSignInContext();
  dayjs.extend(customParseFormat);

  // API calls
  const { getPriceCalApi } = usePriceCalApi();
  const { getPriceCalCstmrTypDDApi } = usePriceCalCstmrTypDDApi();

  // Hooks
  const [schemeId, setSchemeId] = useState("");
  const [schemeDesc, setSchemeDesc] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [apisupplier, setapisupplier] = useState("");
  const [product, setProduct] = useState("");
  const [pcm_active, setPCM_Active] = useState(false);
  const [rules, setRules] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [rowIdForBg, setRowIdForBg] = useState(null);
  const [dropdownData, setDropdownData] = useState([]); // For entire form's select boxed
  const [priceCalcAPI, setPriceCalcAPI] = useState([]); // API response being stored
  const [pageloading, setPageLoading] = useState(true);
  const [ruleToBeDeleted, setRuleToBeDeleted] = useState({
    idx: null,
    effectiveDate: "",
  });

  const [customerTypeLabel, setCustomerTypeLabel] = useState("");
  const [productValue, setProductValue] = useState("");

  // **NEW STATE FOR SEARCH FUNCTIONALITY**
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // const [isNewRecord, setIsNewRecord] = useState(false);

  // Helper function to get label from dropdown data
  const getCustomerTypeLabel = (value) => {
    const customerTypeOption = dropdownData?.objUserGroup?.find(
      (item) => item.UG_CSTTYPE === value
    );
    return customerTypeOption ? customerTypeOption.UG_CODE : value;
  };

  const getApiSupplierLabel = (value) => {
    const apiSupplierOption = dropdownData?.objGds?.find(
      (item) => item.tpGDS_CODE === value
    );
    return apiSupplierOption ? apiSupplierOption.tpGDS_NAME : value;
  };

  const getProductLabel = (value) => {
    const productOption = dropdownData?.objCategory?.find(
      (item) => item.ctg_CODE === value
    );
    return productOption ? productOption.ctg_DESCRIPTION : value;
  };

  const getProductValue = (value) => {
    const productOption = dropdownData?.objCategory?.find(
      (item) => item.ctg_DESCRIPTION === value
    );
    return productOption ? productOption.ctg_CODE : value;
  };

  const getCustomerID = (value) => {
    let cusId = dropdownData?.objUsers?.find((item) => value == item.user_Name);
    return cusId ? cusId.user_ID : value;
  };

  const getCustomerTypeID = (value) => {
    const cusTypeID = dropdownData?.objUserGroup?.find(
      (item) => item.UG_CODE == value
    );
    return cusTypeID ? cusTypeID.UG_CSTTYPE : value;
  };

  // **NEW SEARCH FUNCTION**
  const handleSearch = (value) => {
    setSearchTerm(value);

    if (!value || value.trim() === "") {
      // If search is empty, show all data
      setFilteredData(priceCalcAPI);
      return;
    }

    // Filter the data based on search term
    const filtered = priceCalcAPI.filter((item) => {
      const searchValue = value.toLowerCase().trim();

      return (
        // Search in Product/Category
        item.pcm_CATEGORY?.toLowerCase().includes(searchValue) ||
        // Search in API/GDS Code
        item.pcm_GDSCODE?.toLowerCase().includes(searchValue) ||
        // Search in Customer Type
        item.pcm_CUSTYPE?.toLowerCase().includes(searchValue) ||
        // Search in Customer Name/User ID
        item.pcm_USRID?.toLowerCase().includes(searchValue) ||
        // Search in Description
        item.pcm_DESC?.toLowerCase().includes(searchValue) ||
        // Search in Scheme ID/Code
        item.pcm_CODE?.toLowerCase().includes(searchValue)
      );
    });

    setFilteredData(filtered);
  };

  // **NEW EFFECT TO INITIALIZE FILTERED DATA**
  useEffect(() => {
    setFilteredData(priceCalcAPI);
  }, [priceCalcAPI]);

  useEffect(() => {
    if (sessionStorage.getItem("signIn") !== "true") {
      router.push("/");
    } else {
      setPageLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await getPriceCalApi();
        setPriceCalcAPI(response);
        let response1 = await getPriceCalCstmrTypDDApi();
        const data = await JSON.parse(response1);
        setDropdownData(data);
      } catch (error) {
        console.log("Error: ", error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (customerType && apisupplier && product) {
      // Use labels for display in scheme description
      const customerTypeDisplayLabel = getCustomerTypeLabel(customerType);
      const apiSupplierDisplayLabel = getApiSupplierLabel(apisupplier);
      const productDisplayLabel = getProductLabel(product);

      const newSchemeDesc = `${customerTypeDisplayLabel}-${apiSupplierDisplayLabel}-${productDisplayLabel}`;
      setSchemeDesc(newSchemeDesc);
      form.setFieldsValue({ schemeDesc: newSchemeDesc });
    }
  }, [customerType, apisupplier, product, dropdownData]);

  if (pageloading) {
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

  const handleFractionNumberInputChange = (value, index, field) => {
    const regex = /^[0-9]*(\.[0-9]*)?$/;
    if (value === "" || regex.test(value)) {
      const newRules = [...rules];
      newRules[index][field] = value;
      setRules(newRules);
    }
  };

  const handleDateChange = (date, index) => {
    const newRules = [...rules];
    newRules[index].pcd_EFFECTIVEFROM = date ? date.format("DD/MM/YYYY") : null;
    setRules(newRules);
  };

  const handleRowClick = (item) => {
    setRowIdForBg(item.pcm_ID);
    setSelectedRecord(item);
    // Set form values
    setSchemeId(item.pcm_CODE);
    setSchemeDesc(item.pcm_DESC);
    setCustomerType(getCustomerTypeID(item.pcm_CUSTYPE));
    setCustomerName(item.pcm_USRID);
    setapisupplier(item.pcm_GDSCODE);
    setProduct(item.pcm_CATEGORY);
    setPCM_Active(item.pcm_ACTIVE == 1);

    // Set rules from existing data
    const existingRules = item.objPCDetail || [];
    setRules(
      existingRules.map((rule) => ({
        pcd_EFFECTIVEFROM: rule.pcd_EFFECTIVEFROM,
        pcd_MARKUP: rule.pcd_MARKUP,
        pcd_SERVICECHARGES: rule.pcd_SERVICECHARGES,
        pcd_BANKCHARGES: rule.pcd_BANKCHARGES,
        pcd_REFUNDCHARGES: rule.pcd_REFUNDCHARGES,
        pcd_CHANGECHARGES: rule.pcd_CHANGECHARGES,
      }))
    );

    form.setFieldsValue({
      schemeId: item.pcm_CODE,
      schemeDesc: item.pcm_DESC,
      customerType: item.pcm_CUSTYPE,
      customerName: item.pcm_USRID == "N/A" ? null : item.pcm_USRID,
      apisupplier: item.pcm_GDSCODE,
      product: item.pcm_CATEGORY,
      remember: item.pcm_ACTIVE == 1,
    });
  };

  const handleNew = () => {
    setSchemeId("");
    setSchemeDesc("");
    setCustomerType("");
    setCustomerName("");
    setapisupplier("");
    setProduct("");
    setPCM_Active(false);
    setRules([]);
    setRowIdForBg(null);
    setSelectedRecord(null);

    form.resetFields();
    form.setFieldsValue({
      schemeId: "",
      schemeDesc: "",
      remember: true,
    });
  };

  const handleAdd = () => {
    const newRule = {
      pcd_EFFECTIVEFROM: null,
      pcd_MARKUP: "",
      pcd_SERVICECHARGES: "",
      pcd_BANKCHARGES: "",
      pcd_REFUNDCHARGES: "",
      pcd_CHANGECHARGES: "",
    };
    setRules([...rules, newRule]);
  };

  const handleRemove = () => {
    if (rules.length > 0) {
      const newRules = rules.filter(
        (rule) => rule.pcd_EFFECTIVEFROM !== ruleToBeDeleted.effectiveDate
      );
      setRules(newRules);
    }
  };

  const validateForm = () => {
    if (!customerType) {
      message.error("Customer Type is required");
      return false;
    }
    if (!apisupplier) {
      message.error("API Supplier is required");
      return false;
    }
    if (!product) {
      message.error("Product/Service is required");
      return false;
    }
    if (rules.length === 0) {
      message.error("At least one rule is required");
      return false;
    }

    // Validate each rule
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (!rule.pcd_EFFECTIVEFROM) {
        message.error(`Effective Date is required for rule ${i + 1}`);
        return false;
      }
      if (!rule.pcd_MARKUP) {
        message.error(`Margin % is required for rule ${i + 1}`);
        return false;
      }
      if (!rule.pcd_SERVICECHARGES) {
        message.error(`RoE % is required for rule ${i + 1}`);
        return false;
      }
      if (!rule.pcd_BANKCHARGES) {
        message.error(`Bank Charges % is required for rule ${i + 1}`);
        return false;
      }
      if (!rule.pcd_REFUNDCHARGES) {
        message.error(`Refund Charges is required for rule ${i + 1}`);
        return false;
      }
      if (!rule.pcd_CHANGECHARGES) {
        message.error(`Change Charges is required for rule ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSaveData = async () => {
    if (!validateForm()) {
      return;
    }

    const saveData = {
      objPCMaster: [
        {
          pcm_CODE: schemeId,
          pcm_DESC: schemeDesc,
          pcm_CUSTYPE: customerType,
          pcm_USRID: getCustomerID(customerName),
          pcm_GDSCODE: apisupplier,
          pcm_CATEGORY: getProductValue(product),
          pcm_ACTIVE: pcm_active ? "1" : "0",
          objPCDetail: rules,
          pcm_CREATEDBY: userId,
        },
      ],
    };

    try {
      let res = await setPriceCalAPI(saveData);
      message.success(res);

      // Refresh the data
      const response = await getPriceCalApi();
      setPriceCalcAPI(response);

      // Reset form if it was a new record
      handleNew();
    } catch (error) {
      message.error("Error saving record: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) {
      message.error("Please select a record to delete");
      return;
    }

    try {
      // Implement delete API call here
      await delPriceCalAPI({
        pcm_CODE: selectedRecord.pcm_CODE,
      });
      message.success("Record deleted successfully!");

      // Refresh the data
      const response = await getPriceCalApi();
      setPriceCalcAPI(response);

      // Reset form
      handleNew();
    } catch (error) {
      message.error("Error deleting record: " + error.message);
    }
  };

  const handleFormChange = (changedFields) => {
    // Handle form field changes
    Object.keys(changedFields).forEach((key) => {
      const value = changedFields[key];
      switch (key) {
        case "customerType":
          setCustomerType(value);
          setCustomerTypeLabel(getCustomerTypeLabel(value));
          break;
        case "customerName":
          setCustomerName(getCustomerID(value));
          break;
        case "apisupplier":
          setapisupplier(value);
          break;
        case "product":
          setProduct(getProductValue(value));
          break;
        case "remember":
          setPCM_Active(value);
          break;
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 mb-20">
      <div className="w-full lg:w-1/2 p-2 md:p-7 flex flex-col gap-y-3">
        <h2 className="text-xl lg:text-3xl mb-4 text-orange-500 font-gotham font-bold">
          Price Calculation Setup
        </h2>
        {/* **UPDATED SEARCH COMPONENT WITH FUNCTIONALITY** */}
        <Search
          placeholder="Search for product"
          allowClear
          enterButton="Search"
          size="large"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
        />

        {/* **ADDED SEARCH RESULTS COUNTER** */}
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredData.length} of {priceCalcAPI.length} results
          </div>
        )}

        <table className="w-full border-collapse border border-slate-400 !mt-10 !rounded-lg">
          <thead>
            <tr className="bg-blue-900 text-white rounded">
              <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-sm">
                Product
              </th>
              <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-sm">
                API
              </th>
              <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-sm">
                Customer Type
              </th>
              <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-sm">
                Customer
              </th>
              <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-sm">
                Description
              </th>
              <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-sm">
                Scheme ID
              </th>
            </tr>
          </thead>
          <tbody>
            {/* **CHANGED FROM priceCalcAPI TO filteredData** */}
            {filteredData.map((item) => {
              return (
                <tr
                  key={item.pcm_ID}
                  className={`cursor-pointer ${
                    rowIdForBg === item.pcm_ID
                      ? "bg-yellow-500"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onContextMenu={(e) => e.preventDefault()}
                  onClick={() => {
                    handleRowClick(item);
                  }}
                >
                  <td className="border text-center text-[9px] sm:text-sm py-2">
                    {item.pcm_CATEGORY}
                  </td>
                  <td className="border text-center text-[9px] sm:text-sm py-2">
                    {item.pcm_GDSCODE}
                  </td>
                  <td className="border text-center text-[9px] sm:text-sm py-2">
                    {item.pcm_CUSTYPE}
                  </td>
                  <td className="border text-center text-[9px] sm:text-sm py-2">
                    {item.pcm_USRID || "N/A"}
                  </td>
                  <td className="border text-center text-[9px] sm:text-sm py-2">
                    {item.pcm_DESC}
                  </td>
                  <td className="border text-center text-[9px] sm:text-sm py-2">
                    {item.pcm_CODE}
                  </td>
                </tr>
              );
            })}
            {/* **ADDED NO RESULTS MESSAGE** */}
            {filteredData.length === 0 && searchTerm && (
              <tr>
                <td
                  colSpan="6"
                  className="border text-center py-4 text-gray-500"
                >
                  No results found for &quot;{searchTerm}&quot;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Right side form */}
      <div className="border-2 border-slate-100 lg:mt-24 mr-10 rounded w-full lg:w-1/2 overflow-x-scroll lg:overflow-x-hidden">
        {/* Upper part - Form */}
        <div className="flex gap-5 px-4 py-4 w-full">
          <Form
            layout="vertical"
            form={form}
            onValuesChange={handleFormChange}
            className="grid lg:grid-cols-2 gap-x-5 w-full"
          >
            <Form.Item
              name="schemeId"
              label="Scheme ID"
              className="font-gotham w-full"
            >
              <Input className="w-full !h-10" readOnly />
            </Form.Item>

            <Form.Item
              name="schemeDesc"
              label="Scheme Description"
              className="font-gotham w-full"
            >
              <Input className="w-full !h-10" readOnly />
            </Form.Item>

            <Form.Item
              name="customerType"
              label="Customer Type"
              className="font-gotham"
              rules={[{ required: true, message: "Customer Type is required" }]}
            >
              <Select
                className="!w-full !h-10"
                placeholder="Select Customer Type"
                options={
                  dropdownData?.objUserGroup &&
                  dropdownData?.objUserGroup?.length > 0 &&
                  dropdownData.objUserGroup.map((item) => ({
                    label: item.UG_CODE,
                    value: item.UG_CSTTYPE,
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name="customerName"
              label="Customer Name"
              className="font-gotham"
            >
              <Select
                className="!w-full !h-10"
                placeholder="Select Customer Name"
                options={
                  dropdownData?.objUsers &&
                  dropdownData?.objUsers?.length > 0 &&
                  dropdownData.objUsers.map((item) => ({
                    label: item.user_Name,
                    value: item.user_ID,
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name="apisupplier"
              label="API Supplier"
              className="font-gotham"
              rules={[{ required: true, message: "API Supplier is required" }]}
            >
              <Select
                className="!w-full !h-10"
                placeholder="Select API Supplier"
                options={
                  dropdownData?.objGds &&
                  dropdownData?.objGds?.length > 0 &&
                  dropdownData.objGds.map((item) => ({
                    label: item.tpGDS_NAME,
                    value: item.tpGDS_CODE,
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name="product"
              label="Product/Service"
              className="font-gotham"
              rules={[{ required: true, message: "Product is required" }]}
            >
              <Select
                className="!w-full !h-10"
                placeholder="Select Product/Service"
                options={
                  dropdownData?.objCategory &&
                  dropdownData?.objCategory?.length > 0 &&
                  dropdownData.objCategory.map((item) => ({
                    label: item.ctg_DESCRIPTION,
                    value: item.ctg_CODE,
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              className="lg:col-span-2"
            >
              <Checkbox className="font-gotham">Active</Checkbox>
            </Form.Item>
          </Form>
        </div>

        {/* Lower part - Rules Table */}
        <table className="w-full border border-slate-400 table-fixed">
          <thead>
            <tr className="bg-blue-900 text-white w-full">
              <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-xs font-gotham">
                Effective Date
              </th>
              <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-xs font-gotham">
                Margin %
              </th>
              <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-xs font-gotham">
                RoE %
              </th>
              <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-xs font-gotham">
                Bank Charges %
              </th>
              <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-xs font-gotham">
                Refund Charges
              </th>
              <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-xs font-gotham">
                Change Charges
              </th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, idx) => (
              <tr
                className={`${
                  ruleToBeDeleted.idx === idx ? "bg-yellow-500" : "bg-white"
                }`}
                key={idx}
                onClick={() => {
                  setRuleToBeDeleted((prev) => {
                    let obj = {
                      idx: prev?.idx === idx ? null : idx,
                      effectiveDate:
                        prev?.effectiveDate === rule.pcd_EFFECTIVEFROM
                          ? null
                          : rule.pcd_EFFECTIVEFROM,
                    };
                    return obj;
                  });
                }}
              >
                <td className="border text-center text-xs py-2">
                  <DatePicker
                    style={{ border: "none", outline: "none" }}
                    className={`!focus:outline-none !focus:border-none max-w-full md:min-w-full !bg-transparent ${
                      ruleToBeDeleted.idx === idx
                        ? "!text-white"
                        : "!text-black"
                    }`}
                    value={
                      rule.pcd_EFFECTIVEFROM
                        ? dayjs(rule.pcd_EFFECTIVEFROM, "DD/MM/YYYY")
                        : null
                    }
                    format="DD/MM/YYYY"
                    placeholder="Select date"
                    onChange={(date) => handleDateChange(date, idx)}
                    disabledDate={(current) => {
                      const selectedDates = rules
                        .filter((_, i) => i !== idx) // Exclude current row
                        .map((r) =>
                          dayjs(r.pcd_EFFECTIVEFROM, "DD/MM/YYYY").startOf(
                            "day"
                          )
                        );

                      return (
                        current &&
                        (current < dayjs().startOf("day") || // Disable past dates
                          selectedDates.some((d) => d.isSame(current, "day"))) // Disable already-selected
                      );
                    }}
                  />
                </td>
                <td className="border text-center text-xs py-2">
                  <input
                    type="text"
                    value={rule.pcd_MARKUP ?? ""}
                    onChange={(e) =>
                      handleFractionNumberInputChange(
                        e.target.value,
                        idx,
                        "pcd_MARKUP"
                      )
                    }
                    onBlur={() => {
                      const newRules = [...rules];
                      const val = Number(rule.pcd_MARKUP);
                      newRules[idx]["pcd_MARKUP"] = isNaN(val)
                        ? ""
                        : val.toFixed(2);
                      setRules(newRules);
                    }}
                    placeholder="7.00"
                    className={`px-2 w-14 sm:max-w-24 md:min-w-28 border-none outline-none !bg-transparent ${
                      ruleToBeDeleted.idx === idx
                        ? "!text-white"
                        : "!text-black"
                    }`}
                  />
                </td>
                <td className="border text-center text-xs py-2">
                  <input
                    type="text"
                    value={rule.pcd_SERVICECHARGES || ""}
                    onChange={(e) =>
                      handleFractionNumberInputChange(
                        e.target.value,
                        idx,
                        "pcd_SERVICECHARGES"
                      )
                    }
                    onBlur={() => {
                      const newRules = [...rules];
                      const val = Number(rule.pcd_SERVICECHARGES);
                      newRules[idx]["pcd_SERVICECHARGES"] = isNaN(val)
                        ? ""
                        : val.toFixed(2);
                      setRules(newRules);
                    }}
                    placeholder="7.00"
                    className={`px-2 w-14 sm:max-w-24 md:min-w-28 border-none outline-none !bg-transparent ${
                      ruleToBeDeleted.idx === idx
                        ? "!text-white"
                        : "!text-black"
                    }`}
                  />
                </td>
                <td className="border text-center text-xs py-2">
                  <input
                    type="text"
                    value={rule.pcd_BANKCHARGES || ""}
                    onChange={(e) =>
                      handleFractionNumberInputChange(
                        e.target.value,
                        idx,
                        "pcd_BANKCHARGES"
                      )
                    }
                    onBlur={() => {
                      const newRules = [...rules];
                      const val = Number(rule.pcd_BANKCHARGES);
                      newRules[idx]["pcd_BANKCHARGES"] = isNaN(val)
                        ? ""
                        : val.toFixed(2);
                      setRules(newRules);
                    }}
                    placeholder="7.00"
                    className={`px-2 w-14 sm:max-w-24 lg:min-w-28 border-none outline-none !bg-transparent ${
                      ruleToBeDeleted.idx === idx
                        ? "!text-white"
                        : "!text-black"
                    }`}
                  />
                </td>
                <td className="border text-center text-xs py-2">
                  <input
                    type="text"
                    value={rule.pcd_REFUNDCHARGES || ""}
                    onBlur={() => {
                      const newRules = [...rules];
                      const val = Number(rule.pcd_REFUNDCHARGES);
                      newRules[idx]["pcd_REFUNDCHARGES"] = isNaN(val)
                        ? ""
                        : val.toFixed(2);
                      setRules(newRules);
                    }}
                    onChange={(e) =>
                      handleFractionNumberInputChange(
                        e.target.value,
                        idx,
                        "pcd_REFUNDCHARGES"
                      )
                    }
                    placeholder="7.00"
                    className={`px-2 w-14 sm:max-w-24 lg:min-w-28 border-none outline-none !bg-transparent ${
                      ruleToBeDeleted.idx === idx
                        ? "!text-white"
                        : "!text-black"
                    }`}
                  />
                </td>
                <td className="border text-center text-xs py-2">
                  <input
                    type="text"
                    value={rule.pcd_CHANGECHARGES || ""}
                    onBlur={() => {
                      const newRules = [...rules];
                      const val = Number(rule.pcd_CHANGECHARGES);
                      newRules[idx]["pcd_CHANGECHARGES"] = isNaN(val)
                        ? ""
                        : val.toFixed(2);
                      setRules(newRules);
                    }}
                    onChange={(e) =>
                      handleFractionNumberInputChange(
                        e.target.value,
                        idx,
                        "pcd_CHANGECHARGES"
                      )
                    }
                    placeholder="7.00"
                    className={`px-2 w-14 sm:max-w-24 lg:min-w-28 border-none outline-none !bg-transparent ${
                      ruleToBeDeleted.idx === idx
                        ? "!text-white"
                        : "!text-black"
                    }`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Action Buttons */}
        <div className="w-full flex flex-wrap justify-center gap-2 my-5 lg:my-10">
          <Button
            className="!bg-orange-500 !text-white hover:!bg-orange-600"
            onClick={handleAdd}
          >
            Add
          </Button>
          <Button
            className="!bg-orange-500 !text-white hover:!bg-orange-600"
            onClick={handleRemove}
            disabled={rules.length === 0}
          >
            Remove
          </Button>
          <Button
            className="!bg-orange-500 !text-white hover:!bg-orange-600"
            onClick={handleNew}
          >
            New
          </Button>
          <Button
            className="!bg-orange-500 !text-white hover:!bg-orange-600"
            onClick={handleSaveData}
          >
            Save
          </Button>
          <Button
            className="!bg-orange-500 !text-white hover:!bg-orange-600"
            onClick={handleDelete}
            disabled={!selectedRecord}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
