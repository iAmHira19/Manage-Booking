"use client";
import React, { useEffect, useState } from "react";
import { Input, Form, Select, Checkbox, Button, message } from "antd";
import { useForm } from "antd/es/form/Form";
import useCustomerSetup from "@/hooks/useCustomerSetup";
import "./CustomerSetup.css";
import { useSignInContext } from "@/providers/SignInStateProvider";
import { useRouter } from "next/navigation";
import setCustomerSetup from "@/services/setCustomerSetup";
import { useCustomerApi } from "@/utils/getCustomerType";

const Page = () => {
  const router = useRouter();
  const [form] = useForm();
  const { getCustomerType } = useCustomerApi(); // API call
  const { data: customerResp } = useCustomerSetup(); // API call
  const { isSignedIn, userId } = useSignInContext();

  // Form States
  const [cusId, setCusId] = useState("");
  const [cusName, setCusName] = useState("");
  const [cusType, setCusType] = useState("");
  const [cusTypeLabel, setCusTypeLabel] = useState("");
  const [cusPhone, setCusPhone] = useState("");
  const [cusEmail, setCusEmail] = useState("");
  const [cusAddress, setCusAddress] = useState("");
  const [cusActive, setCusActive] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [creditDays, setCreditDays] = useState("");

  const [masterUsername, setMasterUsername] = useState("");
  const [masterUserPassword, setMasterUserPassword] = useState("");
  const [masterUserSubAccounts, setMasterUserSubAccounts] = useState("");
  const [masterUserAccessGroup, setMasterUserAccessGroup] = useState("");

  const [objectToBeDeleted, setObjectToBeDeleted] = useState({ product: "" });
  const [customerType, setCustomerType] = useState([]); // API response handler
  const [customerSetupData, setCustomerSetupData] = useState({}); // API response handler
  const [selectedRow, setSelectedRow] = useState(null); // Main Table
  const [objDetails, setObjDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  // ADDED: Search functionality states - similar to PrioritySetup pattern
  const [searchTerm, setSearchTerm] = useState(""); // State to store search input
  const [filteredCustomers, setFilteredCustomers] = useState([]); // State to store filtered customer data

  // Check if user access group is B2B to enable/disable master user fields
  const isB2BUser = masterUserAccessGroup?.toLowerCase() === "b2b";

  useEffect(() => {
    if (sessionStorage.getItem("signIn") !== "true") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCustomerSetupData(customerResp);
        let resp = await getCustomerType();
        setCustomerType(resp);
      } catch (error) {
        console.log("Error: ", error.message);
      }
    };
    fetchData();
  }, [customerResp]);

  // ADDED: Filter customers based on search term - filters by ID, name, type, and contact number
  useEffect(() => {
    if (!customerSetupData?.objCustomerMaster) {
      setFilteredCustomers([]);
      return;
    }

    if (!searchTerm.trim()) {
      // If search term is empty, show all customers
      setFilteredCustomers(customerSetupData.objCustomerMaster);
    } else {
      // Filter customers based on search term (case-insensitive search)
      const filtered = customerSetupData.objCustomerMaster.filter(
        (customer) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            customer.cstm_CODE?.toLowerCase().includes(searchLower) || // Search by Customer ID
            customer.cstm_NAME?.toLowerCase().includes(searchLower) || // Search by Customer Name
            customer.cstm_CUSTTYPE_DESC?.toLowerCase().includes(searchLower) || // Search by Customer Type
            customer.cstm_PHONE_NO?.toLowerCase().includes(searchLower) // Search by Contact Number
          );
        }
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customerSetupData]);

  // ADDED: Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset selected row when searching to avoid confusion
    setSelectedRow(null);
  };

  // ADDED: Clear search functionality
  const handleSearchClear = () => {
    setSearchTerm("");
    setSelectedRow(null);
  };

  const handleRowClick = (item) => {
    setCusId(item?.cstm_CODE);
    setCusName(item?.cstm_NAME);
    setCusType(item?.cstm_CUSTTYPE_CODE);
    setCusEmail(item?.cstm_EMAIL);
    setCusPhone(item?.cstm_PHONE_NO);
    setCusAddress(item?.cstm_ADDRESS);
    setCusActive(item?.cstm_ACTIVE === "1");
    setPaymentMethod(item?.cstm_PAYMENTTYPE);
    setCreditLimit(item?.cstm_CLAMOUNT);
    setCreditDays(item?.cstm_CLDAYS);
    setMasterUsername(item?.cstm_NAME);
    setMasterUserPassword(item?.cstm_PASSWORD);
    setMasterUserAccessGroup(item?.cstm_USERGROUP);
    setMasterUserSubAccounts(item?.cstm_SUBACCOUNTS);

    let existingObjDetails = item?.objCSTDetail || [];
    setObjDetails(existingObjDetails);

    // Find customer type description
    const customerTypeItem = customerType.find(
      (ct) => ct.csttype_CODE === item?.cstm_CUSTTYPE_CODE
    );

    form.setFieldsValue({
      cusId: item?.cstm_CODE,
      cusName: item?.cstm_NAME,
      cus_Type: item?.cstm_CUSTTYPE_CODE,
      cstm_PHONE_NO: item?.cstm_PHONE_NO,
      cusEmail: item?.cstm_EMAIL,
      address: item?.cstm_ADDRESS,
      remember: item.cstm_ACTIVE === "1",
      cstm_PAYMENTTYPE: item?.cstm_PAYMENTTYPE,
      climit: item?.cstm_CLAMOUNT,
      cldays: item?.cstm_CLDAYS,
      muname: item?.cstm_NAME,
      access_group: item?.cstm_USERGROUP,
      password: item?.cstm_PASSWORD,
      subAccounts: item?.cstm_SUBACCOUNTS,
    });
  };

  const handleNew = () => {
    setCusId("");
    setCusName("");
    setCusType("");
    setCusEmail("");
    setCusPhone("");
    setCusAddress("");
    setCusActive(true);
    setPaymentMethod("");
    setCreditLimit("");
    setCreditDays("");
    setMasterUsername("");
    setMasterUserPassword("");
    setMasterUserAccessGroup("");
    setMasterUserSubAccounts("");
    setObjDetails([]);
    form.resetFields();
    form.setFieldsValue({ remember: true });
    // ADDED: Clear search and selection when creating new customer
    setSearchTerm("");
    setSelectedRow(null);
  };

  const handleAdd = () => {
    let newObject = {
      cstd_CO_CODE: "",
      cstd_CUSTOMERCODE: "",
      cstd_DETAILID: "",
      cstd_CATEGORYCODE: "",
      cstd_PRODUCTCODE: "",
      cstd_ACTIVE: "1",
    };
    setObjDetails((prev) => [...prev, newObject]);
  };

  const handleRemove = () => {
    if (objDetails.length > 0) {
      setObjDetails((prev) => prev.slice(0, -1));
    }
  };

  // Handle form field changes
  const handleFormChange = (changedFields, allFields) => {
    changedFields.forEach(({ name, value }) => {
      switch (name[0]) {
        case "cusName":
          setCusName(value);
          break;
        case "cus_Type":
          setCusType(value);
          // Find the customer type description
          const selectedType = customerType.find(
            (ct) => ct.csttype_CODE === value
          );
          setCusTypeLabel(selectedType?.csttype_DESCRIPTION || "");
          break;
        case "cstm_PHONE_NO":
          setCusPhone(value);
          break;
        case "cusEmail":
          setCusEmail(value);
          break;
        case "address":
          setCusAddress(value);
          break;
        case "remember":
          setCusActive(value);
          break;
        case "cstm_PAYMENTTYPE":
          setPaymentMethod(value);
          break;
        case "climit":
          setCreditLimit(value);
          break;
        case "cldays":
          setCreditDays(value);
          break;
        case "muname":
          setMasterUsername(value);
          break;
        case "password":
          setMasterUserPassword(value);
          break;
        case "access_group":
          setMasterUserAccessGroup(value);
          break;
        case "subAccounts":
          setMasterUserSubAccounts(value);
          break;
      }
    });
  };

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

  const validateForm = () => {
    if (!cusId && !cusName) {
      message.error("Customer ID or Customer name is required");
      return false;
    }
    if (!cusName) {
      message.error("Customer name is required");
      return false;
    }
    if (!cusType) {
      message.error("Customer type is required");
      return false;
    }
    if (!cusPhone) {
      message.error("Customer contact number is required");
      return false;
    }
    if (!cusEmail) {
      message.error("Customer email is required");
      return false;
    }
    if (!cusAddress) {
      message.error("Customer address is required");
      return false;
    }
    if (!paymentMethod) {
      message.error("Payment method is required");
      return false;
    }
    if (!creditLimit) {
      message.error("Credit limit is required");
      return false;
    }
    if (!creditDays) {
      message.error("Credit limit days is required");
      return false;
    }
    if (!masterUserAccessGroup) {
      message.error("Master user AccessGroup is required");
      return false;
    }

    // Only validate master user fields if user is B2B
    if (isB2BUser) {
      if (!masterUsername) {
        message.error("Master username is required");
        return false;
      }
      if (!masterUserPassword) {
        message.error("Master user password is required");
        return false;
      }
      if (!masterUserSubAccounts) {
        message.error("User sub-accounts are required");
        return false;
      }
    }

    if (objDetails.length === 0) {
      message.error("At least one product detail is required");
      return false;
    }

    for (let i = 0; i < objDetails.length; i++) {
      const objDetail = objDetails[i];
      // objDetail validations
    }
    return true;
  };

  const handlesave = async () => {
    if (!validateForm()) {
      return;
    }

    const saveData = {
      cstm_CO_CODE: "",
      cstm_CODE: cusId,
      cstm_NAME: cusName,
      cstm_CUSTTYPE_CODE: cusType,
      cstm_CUSTTYPE_DESC: cusTypeLabel,
      cstm_ADDRESS: cusAddress,
      cstm_ACTIVE: cusActive ? "1" : "0",
      cstm_PAYMENTTYPE: paymentMethod,
      cstm_PHONE_NO: cusPhone,
      cstm_EMAIL: cusEmail,
      cstm_PASSWORD: isB2BUser ? masterUserPassword : "",
      cstm_CREATEDBY: userId,
      cstm_CREATEDWHEN: new Date().toISOString().split("T")[0],
      cstm_MODIFIEDBY: userId,
      cstm_MODIFIEDWHEN: new Date().toISOString().split("T")[0],
      cstm_CLDAYS: parseInt(creditDays) || 0,
      cstm_CLAMOUNT: parseInt(creditLimit) || 0,
      cstm_SUBACCOUNTS: isB2BUser ? parseInt(masterUserSubAccounts) || 0 : 0,
      cstm_APCODE: "",
      cstm_USERID: cusEmail,
      cstm_USERGROUP: masterUserAccessGroup,
      cstm_DOCUMENTCODE: "0",
      cstm_DOCUMENTTYPE: "",
      objCSTDetail: objDetails.map((detail) => ({
        ...detail,
        cstd_CUSTOMERCODE: cusId,
        cstd_PRODUCTCODE: null,
        cstd_CATEGORYCODE: null,
        cstd_DETAILID: null,
      })),
    };

    try {
      let resp = await setCustomerSetup(saveData);
      message.success(resp);
    } catch (error) {
      message.error("Error saving record: " + error.message);
    }
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-between gap-1 px-3 py-5 md:py-10">
      <div className="w-full lg:w-[650px] px-2 md:px-5 flex flex-col gap-y-3">
        <h2 className="text-base md:text-3xl font-semibold mb-2 text-orange-500">
          Customer Setup
        </h2>
        <Input.Search
          placeholder="Search Customer Record"
          allowClear
          enterButton="Search"
          size="middle"
          value={searchTerm}
          onChange={handleSearchChange}
          onSearch={(value) => setSearchTerm(value)} // Handle search button click
          onClear={handleSearchClear} // Handle clear button click
        />
        <table className="w-full mt-4 md:mt-5 table-fixed">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="p-2 border border-slate-400 text-xs md:text-base whitespace-nowrap">
                Customer ID
              </th>
              <th className="p-2 border border-slate-400 text-xs md:text-base whitespace-nowrap">
                Customer Name
              </th>
              <th className="p-2 border border-slate-400 text-xs md:text-base whitespace-nowrap">
                Customer Type
              </th>
              <th className="p-2 border border-slate-400 text-xs md:text-base whitespace-nowrap">
                Contact No
              </th>
            </tr>
          </thead>
          <tbody>
            {/* MODIFIED: Changed from customerSetupData?.objCustomerMaster to filteredCustomers */}
            {filteredCustomers?.length > 0 ? (
              filteredCustomers.map((customer, idx) => (
                <tr
                  key={customer.cstm_CODE || idx}
                  onClick={() => {
                    setSelectedRow((prev) => (prev === idx ? null : idx));
                    handleRowClick(customer);
                  }}
                  className={`border border-slate-400 cursor-pointer ${
                    selectedRow === idx
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  <td className="p-2 border border-slate-400 text-xs md:text-sm text-center">
                    {customer.cstm_CODE}
                  </td>
                  <td className="p-2 border border-slate-400 text-xs md:text-sm text-center">
                    {customer.cstm_NAME}
                  </td>
                  <td className="p-2 border border-slate-400 text-xs md:text-sm text-center">
                    {customer.cstm_CUSTTYPE_DESC}
                  </td>
                  <td className="p-2 border border-slate-400 text-xs md:text-sm text-center">
                    {customer.cstm_PHONE_NO}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-2 text-gray-500 text-base"
                >
                  {/* MODIFIED: Updated message to show different text based on search state */}
                  {searchTerm.trim()
                    ? "No customers found matching your search"
                    : "No customers found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border md:border-2 border-slate-100 rounded w-full lg:w-1/2 md:mr-10">
        <div className="px-2 md:px-4 py-2">
          <div>
            <h4 className="text-blue-900 uppercase text-xl mt-5 font-gotham">
              Customer Details
            </h4>
            <Form
              layout="vertical"
              form={form}
              onFieldsChange={handleFormChange}
              className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 md:gap-x-7 gap-y-3 !mt-5"
            >
              <Form.Item
                label="Customer ID"
                name="cusId"
                className="!text-base !font-gotham"
              >
                <Input className="w-full !py-2" readOnly />
              </Form.Item>
              <Form.Item
                label="Customer Name"
                name="cusName"
                className="w-full !text-base !font-gotham"
              >
                <Input className="w-full !py-2" />
              </Form.Item>
              <Form.Item
                label="Customer Type"
                name="cus_Type"
                className="w-full !text-base !font-gotham"
              >
                <Select className="w-full !h-10">
                  {customerType?.map((item) => (
                    <Select.Option
                      value={item?.csttype_CODE}
                      key={item?.csttype_CODE}
                    >
                      {item?.csttype_DESCRIPTION}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Contact Number"
                name="cstm_PHONE_NO"
                className="!text-base !font-gotham"
              >
                <Input type="tel" className="w-full !py-2" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="cusEmail"
                className="w-full !text-base !font-gotham"
              >
                <Input type="email" className="w-full !py-2" />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                className="w-full !text-base !font-gotham"
              >
                <Input className="w-full !py-2" />
              </Form.Item>
              <Form.Item
                name="remember"
                valuePropName="checked"
                className="!font-gotham"
              >
                <Checkbox className="!text-base font-light !font-gotham">
                  Active This Customer
                </Checkbox>
              </Form.Item>
            </Form>
          </div>
          <div className="border-b-2 border-slate-300"></div>
          <div className="mt-2">
            <h4 className="text-blue-900 uppercase text-xl mt-5 font-gotham">
              Payment Terms
            </h4>
            <Form
              layout="vertical"
              form={form}
              onFieldsChange={handleFormChange}
              className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 md:gap-x-7 gap-y-3 !mt-5"
            >
              <Form.Item
                label="Payment Method"
                name="cstm_PAYMENTTYPE"
                className="w-full !text-base !font-gotham"
              >
                <Select className="!h-10">
                  <Select.Option value="advance">Advance</Select.Option>
                  <Select.Option value="credit">Credit</Select.Option>
                  <Select.Option value="cash">Cash</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Credit Limit"
                name="climit"
                className="w-full !text-base !font-gotham"
              >
                <Input type="number" className="!py-2" />
              </Form.Item>
              <Form.Item
                label="Credit Days"
                name="cldays"
                className="w-full !text-base !font-gotham"
              >
                <Input
                  type="number"
                  className="!py-2"
                  placeholder="Enter credit days"
                />
              </Form.Item>
            </Form>
          </div>
          <div className="border-b-2 border-slate-300 h-3"></div>
          <div className="mt-5">
            <h4 className="text-blue-900 text-xl mb-5 font-gotham">
              Account Creation
            </h4>
            <Form
              layout="vertical"
              form={form}
              onFieldsChange={handleFormChange}
              className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 md:gap-x-7 gap-y-3 !mt-5"
            >
              <Form.Item
                label="Master User Name"
                name="muname"
                className="!text-base !font-gotham"
              >
                <Input
                  className="!py-2"
                  disabled={!isB2BUser}
                  placeholder={!isB2BUser ? "Available for B2B users only" : ""}
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                className="!text-base !font-gotham"
              >
                <Input
                  type="password"
                  className="!py-2"
                  disabled={!isB2BUser}
                  placeholder={!isB2BUser ? "Available for B2B users only" : ""}
                />
              </Form.Item>
              <Form.Item
                label="Access Group"
                name="access_group"
                className="!text-base !font-gotham"
              >
                <Select className="!h-10" placeholder="Select">
                  {customerResp?.objUserGroup?.map((item) => (
                    <Select.Option value={item?.UG_CODE} key={item?.UG_CODE}>
                      {item?.UG_CODE}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Number of Sub Accounts"
                name="subAccounts"
                className="!text-base !font-gotham"
              >
                <Input
                  type="number"
                  className="!py-2"
                  disabled={!isB2BUser}
                  placeholder={!isB2BUser ? "Available for B2B users only" : ""}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
        <table className="w-full border-collapse border border-slate-400">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-2 py-2 border-r border-slate-400 !text-base !font-gotham">
                Product
              </th>
              <th className="px-2 py-2 border-r border-slate-400 !text-base !font-gotham">
                AR Product Code
              </th>
              <th className="px-2 py-2 !text-base !font-gotham">Active</th>
            </tr>
          </thead>
          <tbody>
            {objDetails?.length > 0 ? (
              objDetails.map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() =>
                    setObjectToBeDeleted({ product: `product-${idx}` })
                  }
                  className={`cursor-pointer ${
                    objectToBeDeleted.product === `product-${idx}`
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  <td className="border border-slate-400 text-center py-2 text-sm">
                    {item.cstd_PRODUCTCODE || "N/A"}
                  </td>
                  <td className="border border-slate-400 text-center py-2 text-sm">
                    {item.cstd_CO_CODE || "N/A"}
                  </td>
                  <td className="border border-slate-400 text-center py-2">
                    <input
                      type="checkbox"
                      checked={item.cstd_ACTIVE === "1"}
                      readOnly
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No products added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="w-full flex justify-center !mt-10 !mb-5 gap-2">
          <Button className="!bg-orange-500 !text-white" onClick={handleAdd}>
            Add
          </Button>
          <Button className="!bg-orange-500 !text-white" onClick={handleRemove}>
            Remove
          </Button>
          <Button className="!bg-orange-500 !text-white" onClick={handleNew}>
            New
          </Button>
          <Button className="!bg-orange-500 !text-white" onClick={handlesave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
