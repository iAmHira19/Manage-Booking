"use client";

import { useSignInContext } from "@/providers/SignInStateProvider";
import { usePriceCalApi } from "@/utils/getPriceCalc";
import { usePriceCalCstmrTypDDApi } from "@/utils/getPriceCalCstmrTypDD";
import { Button, Checkbox, DatePicker, Form, Input, Select, Modal, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";

const { Search } = Input;

dayjs.extend(customParseFormat);

const TestPageContent = () => {
  const [form] = useForm();
  const { isSignedIn, userId } = useSignInContext();
  const [isClient, setIsClient] = useState(false);

  // API calls
  const { getPriceCalApi, loading: loadingPriceCalc } = usePriceCalApi();
  const { getPriceCalCstmrTypDDApi, loading: loadingCustomerTypes } = usePriceCalCstmrTypDDApi();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // Form state
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
  const [dropdownData, setDropdownData] = useState([]);
  const [priceCalcAPI, setPriceCalcAPI] = useState([]);
  const [ruleToBeDeleted, setRuleToBeDeleted] = useState({
    idx: null,
    effectiveDate: "",
  });

  const [customerTypeLabel, setCustomerTypeLabel] = useState("");
  const [productValue, setProductValue] = useState("");
  const [loading, setLoading] = useState(true);

  // Set isClient to true after mount
  useEffect(() => {
    setIsClient(true);
    return () => setIsClient(false);
  }, []);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load dropdown data
        const dropdownData = await getPriceCalCstmrTypDDApi();
        if (dropdownData && isClient) {
          setDropdownData(dropdownData);
        }

        // Load price calculation data
        const priceCalcData = await getPriceCalApi();
        if (priceCalcData && isClient) {
          setPriceCalcAPI(priceCalcData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // You might want to show an error message to the user here
      } finally {
        if (isClient) {
          setLoading(false);
        }
      }
    };

    if (isClient) {
      loadData();
    }
  }, [isClient, getPriceCalApi, getPriceCalCstmrTypDDApi]);

  // Helper functions
  const getCustomerTypeLabel = (value) => {
    if (!dropdownData?.objUserGroup) return value;
    const customerTypeOption = dropdownData.objUserGroup.find(
      (item) => item.UG_CSTTYPE === value
    );
    return customerTypeOption ? customerTypeOption.UG_CODE : value;
  };

  const getApiSupplierLabel = (value) => {
    if (!dropdownData?.objGds) return value;
    const apiSupplierOption = dropdownData.objGds.find(
      (item) => item.tpGDS_CODE === value
    );
    return apiSupplierOption ? apiSupplierOption.tpGDS_NAME : value;
  };

  const getProductLabel = (value) => {
    if (!dropdownData?.objCategory) return value;
    const productOption = dropdownData.objCategory.find(
      (item) => item.ctg_CODE === value
    );
    return productOption ? productOption.ctg_DESCRIPTION : value;
  };

  const getProductValue = (value) => {
    if (!dropdownData?.objCategory) return value;
    const productOption = dropdownData.objCategory.find(
      (item) => item.ctg_DESCRIPTION === value
    );
    return productOption ? productOption.ctg_CODE : value;
  };

  const getCustomerID = (value) => {
    if (!dropdownData?.objUsers) return value;
    const cusId = dropdownData.objUsers.find((item) => value === item.user_Name);
    return cusId ? cusId.user_ID : value;
  };

  const getCustomerTypeID = (value) => {
    if (!dropdownData?.objUserGroup) return value;
    const cusTypeID = dropdownData.objUserGroup.find(
      (item) => item.UG_CODE === value
    );
    return cusTypeID ? cusTypeID.UG_CSTTYPE : value;
  };

  // Render loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // Main render
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Page</h1>
      <p>This is a test page with client-side data loading.</p>
      
      {/* Add your form and table components here */}
      <Form form={form} layout="vertical">
        {/* Add your form fields here */}
        <Form.Item label="Scheme ID" name="schemeId">
          <Input 
            value={schemeId}
            onChange={(e) => setSchemeId(e.target.value)}
            placeholder="Enter Scheme ID"
          />
        </Form.Item>
        
        <Form.Item label="Customer Type" name="customerType">
          <Select
            value={customerType}
            onChange={(value) => setCustomerType(value)}
            placeholder="Select Customer Type"
            options={dropdownData?.objUserGroup?.map(item => ({
              value: item.UG_CSTTYPE,
              label: item.UG_CODE
            })) || []}
          />
        </Form.Item>
        
        {/* Add more form fields as needed */}
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      
      {/* Add your data table here */}
      
      {/* Add modals and other components as needed */}
    </div>
  );
};

export default TestPageContent;
