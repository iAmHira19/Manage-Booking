"use client";
import { useSignInContext } from "@/providers/SignInStateProvider";
import { usePriceCalApi } from "@/utils/getPriceCalc";
import { usePriceCalCstmrTypDDApi } from "@/utils/getPriceCalCstmrTypDD";
import { Button, Checkbox, DatePicker, Form, Input, Select, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
// import { useRouter } from "next/router";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useEffect, useState } from "react";
const { Search } = Input;

const Page = () => {
  //   const router = useRouter();
  const [form] = useForm();
  const { isSignedIn, userId } = useSignInContext();
  dayjs.extend(customParseFormat);

  // API calls
  const { getPriceCalApi } = usePriceCalApi();
  const { getPriceCalCstmrTypDDApi } = usePriceCalCstmrTypDDApi();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

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
  //   const [pageloading, setPageLoading] = useState(true);
  const [ruleToBeDeleted, setRuleToBeDeleted] = useState({
    idx: null,
    effectiveDate: "",
  });

  const [customerTypeLabel, setCustomerTypeLabel] = useState("");
  const [productValue, setProductValue] = useState("");

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

  //   useEffect(() => {
  //     if (sessionStorage.getItem("signIn") !== "true") {
  //       router.push("/");
  //     } else {
  //       setPageLoading(false);
  //     }
  //   }, [isSignedIn]);

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

  //   if (pageloading) {
  //     return (
  //       <>
  //         <div className="min-w-screen min-h-screen flex items-center justify-center">
  //           <p className="text-4xl text-orange-500 font-gotham font-bold ">
  //             Loading...
  //           </p>
  //         </div>
  //       </>
  //     );
  //   }

  // Handle view button click
  const handleViewClick = (item, e) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedRowData(item);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRowData(null);
  };

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
    <>
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 mb-20">
        <div className="w-full p-2 md:p-7">
          <h2 className="text-xl lg:text-3xl mb-4 text-orange-500 font-gotham font-bold">
            Order Details
          </h2>
          <Search
            placeholder="Input search text"
            allowClear
            enterButton="Search"
            size="large"
          />
          <table className="w-full border-collapse border border-slate-400 !mt-10 !rounded-lg">
            <thead>
              <tr className="bg-blue-900 text-white rounded">
                <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-sm tracking-wider">
                  PNR
                </th>
                <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-sm tracking-wider">
                  Contact Name
                </th>
                <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-sm tracking-wider">
                  Contact Number
                </th>
                <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-sm tracking-wider">
                  Email
                </th>
                <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-sm tracking-wider">
                  Date
                </th>
                <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-sm tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {priceCalcAPI.map((item) => {
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
                    <td className="border text-center text-[9px] sm:text-sm py-2 tracking-wide">
                      B26DE5
                    </td>
                    <td className="border text-center text-[9px] sm:text-sm py-2 tracking-wide">
                      Shafiq Ahmad
                    </td>
                    <td className="border text-center text-[9px] sm:text-sm py-2 tracking-wide">
                      +92312 1928 921
                    </td>
                    <td className="border text-center text-[9px] sm:text-sm py-2 tracking-wide">
                      abc@gmail.com
                    </td>
                    <td className="border text-center text-[9px] sm:text-sm py-2 tracking-wide">
                      11-08-2025
                    </td>
                    <td className="border text-center text-[9px] sm:text-sm py-2 tracking-wide space-x-2">
                      <button
                        className="text-sm p-2 border rounded hover:bg-slate-300 hover:text-orange-500"
                        onClick={(e) => handleViewClick(item, e)}
                      >
                        View
                      </button>
                      <button className="text-sm p-2 border rounded hover:bg-slate-300 hover:text-orange-500">
                        Resend
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Order Details */}
      <Modal
        title={
          <span className="text-xl font-gotham text-orange-500 font-bold">
            Order Details
          </span>
        }
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width="100vw"
        style={{
          top: 0,
          maxWidth: "100vw",
          height: "100vh",
          maxHeight: "100vh",
          margin: 0,
          padding: 0,
        }}
        bodyStyle={{
          height: "calc(100vh - 55px)",
          overflowY: "auto",
          padding: "20px",
        }}
        className="!p-0 !m-0"
      >
        {/* Right side form start */}
        <div className="border-2 border-slate-100 rounded w-full overflow-x-auto">
          {/* Upper part - Form */}
          <div className="flex flex-col gap-5 px-4 py-4 w-full">
            <Form
              layout="vertical"
              form={form}
              onValuesChange={handleFormChange}
              className="grid lg:grid-cols-2 gap-x-5 w-full"
            >
              <Form.Item
                name="Internal_Odr_No"
                label="Order Number"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" readOnly />
              </Form.Item>
              <Form.Item
                name="odr_date"
                label="Order Date"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" readOnly />
              </Form.Item>
            </Form>

            <h4 className="text-blue-900 font-gotham text-xl">Billing Info</h4>
            <Form
              layout="vertical"
              form={form}
              onValuesChange={handleFormChange}
              className="grid lg:grid-cols-3 gap-x-5 w-full"
            >
              <Form.Item
                name="fname"
                label="First Name"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                name="lname"
                label="Last Name"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Phone Number"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                name="passport"
                label="Passport Number"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                name="nationality"
                label="Nationality"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                name="address"
                label="Address"
                className="font-gotham w-full lg:col-span-3"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
            </Form>

            <h4 className="text-blue-900 font-gotham text-xl">
              Passenger Info
            </h4>
            <Form
              layout="vertical"
              form={form}
              onValuesChange={handleFormChange}
              className="grid lg:grid-cols-3 gap-x-5 w-full"
            >
              <Form.Item
                name="fname"
                label="First Name"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                name="lname"
                label="Last Name"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Phone Number"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                name="passport"
                label="Passport Number"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                name="nationality"
                label="Nationality"
                className="font-gotham w-full"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
              <Form.Item
                name="address"
                label="Address"
                className="font-gotham w-full lg:col-span-3"
              >
                <Input className="w-full !h-10" />
              </Form.Item>
            </Form>

            <div className="w-full">
              <Button color="orange" variant="solid">
                Resend Itinerary
              </Button>
            </div>
          </div>

          {/* Lower part - Rules Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-400 table-fixed min-w-[800px]">
              <thead>
                <tr className="bg-blue-900 text-white w-full">
                  <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-xs font-gotham">
                    Title
                  </th>
                  <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-xs font-gotham">
                    Passenger Name
                  </th>
                  <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-xs font-gotham">
                    Passport Number
                  </th>
                  <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-xs font-gotham">
                    Nationality
                  </th>
                  <th className="px-1 lg:px-2 py-2 border border-slate-400 text-[9px] sm:text-xs font-gotham">
                    Gender
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
                            .filter((_, i) => i !== idx)
                            .map((r) =>
                              dayjs(r.pcd_EFFECTIVEFROM, "DD/MM/YYYY").startOf(
                                "day"
                              )
                            );

                          return (
                            current &&
                            (current < dayjs().startOf("day") ||
                              selectedDates.some((d) =>
                                d.isSame(current, "day")
                              ))
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-wrap justify-center gap-2 my-5 lg:my-10">
            <Button color="orange" variant="solid" onClick={handleAdd}>
              Add
            </Button>
            <Button
              color="orange"
              variant="solid"
              onClick={handleRemove}
              disabled={rules.length === 0}
            >
              Remove
            </Button>
            <Button color="orange" variant="solid" onClick={handleNew}>
              New
            </Button>
            <Button color="orange" variant="solid" onClick={handleSaveData}>
              Save
            </Button>
            <Button
              color="orange"
              variant="solid"
              onClick={handleDelete}
              disabled={!selectedRecord}
            >
              Delete
            </Button>
          </div>
        </div>
        {/* Right side form end */}
      </Modal>
    </>
  );
};

export default Page;
