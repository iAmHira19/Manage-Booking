"use client";
import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { FaRegEdit } from "react-icons/fa";
import { useSignInContext } from "@/providers/SignInStateProvider";
import { useRouter } from "next/navigation";
import { useCurrencyApi } from "@/utils/getCurrencyForCurrencyApi"; // getExchangeSetup
import setCurrencyApi from "@/services/setCurrency"; // setCurrency
import setExchangeSetup from "@/services/setExchangeSetup";
import useCurrencies from "@/hooks/useCurrencies";
import { IoAddCircle } from "react-icons/io5";
import { BsCurrencyExchange } from "react-icons/bs";
import { Modal } from "antd";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Page() {
  const router = useRouter();
  const { data: currencies_data } = useCurrencies();

  // Modals
  const { isSignedIn } = useSignInContext();
  const [showAddCurrency, setShowAddCurrency] = useState(false);
  const [showAddCurrencyModal, setShowAddCurrencyModal] = useState(false);
  const [showEditCurrencyModal, setShowEditCurrencyModal] = useState(false);
  const [callCurrencies, setCallCurrencies] = useState(true);
  const [showSetCurrencyExchangeModal, setShowSetCurrencyExchangeModal] =
    useState(false);
  const [showExchangeCurrencyModal, setShowExchangeCurrencyModal] =
    useState(false);

  // Data to edit
  const [dataToEdit, setDataToEdit] = useState({});

  // page Loading
  const [loading, setLoading] = useState(true);

  // Set Exch. Rate data
  const [exchangeData, setExchangeData] = useState([]);
  const [maxRecords, setMaxRecords] = useState(3);
  const [criteria, setCriteria] = useState("none");
  const [userSelectedCurrency, setUserSelectedCurrency] = useState({
    desc: "",
    tp_EXRCODE: "",
  });

  // **NEW STATE FOR SEARCH FUNCTIONALITY**
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);

  // APIs being called
  const { getCurrencyApi } = useCurrencyApi();

  // **NEW SEARCH FUNCTION**
  const handleSearch = (value) => {
    setSearchTerm(value);

    if (!value || value.trim() === "") {
      // If search is empty, show all currencies
      setFilteredCurrencies(currencies_data || []);
      return;
    }

    // Filter the currencies based on search term
    const filtered = (currencies_data || []).filter((item) => {
      const searchValue = value.toLowerCase().trim();

      return (
        // Search in Description
        item.tpCUR_DESCRIPTION?.toLowerCase().includes(searchValue) ||
        // Search in Symbol
        item.tpCUR_SYMBOL?.toLowerCase().includes(searchValue) ||
        // Search in Status
        (item.tpCUR_ACTIVE == 1 ? "active" : "inactive").includes(
          searchValue
        ) ||
        // Search in Base Currency status
        (item.tpCUR_BASECURRENCY == 1 ? "base" : "non-base").includes(
          searchValue
        )
      );
    });

    setFilteredCurrencies(filtered);
  };

  // **NEW EFFECT TO INITIALIZE FILTERED DATA**
  useEffect(() => {
    setFilteredCurrencies(currencies_data || []);
  }, [currencies_data]);

  // Effects
  useEffect(() => {
    if (sessionStorage.getItem("signIn") !== "true") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const exchRate = await getCurrencyApi(criteria);
        const parsedExchRate = JSON.parse(exchRate);
        let sortedData = parsedExchRate?.objExchangeRate?.sort((a, b) => {
          const [dayA, monthA, yearA] = a?.tpEXR_DATE?.split("/");
          const [dayB, monthB, yearB] = b?.tpEXR_DATE?.split("/");

          const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
          const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

          return dateB - dateA;
        });
        setExchangeData(sortedData);
        setCallCurrencies(false);
      } catch (error) {
        console.error("Error fetching currencies:", error.message);
      }
    }
    if (callCurrencies) {
      fetchCurrencies();
    }
  }, [criteria, callCurrencies]);

  useEffect(() => {
    if (showAddCurrency) {
      setTimeout(() => {
        setShowAddCurrencyModal(true);
      }, 120);
    }
  }, [showAddCurrency]);

  // Compare whether date matches with today's one or not
  const getDateConfirmation = (date) => {
    let [date_local, month, year] = date.split("/").map(Number);
    let newDate = new Date();
    if (
      newDate.getDate() == date_local &&
      newDate.getMonth() + 1 == month &&
      newDate.getFullYear() == year
    ) {
      return true;
    }
    return false;
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

  return (
    <>
      <div className="flex justify-center flex-col gap-y-10 items-center p-5 md:py-10 mx-auto w-full h-full">
        <h2 className="text-lg md:text-3xl font-bold mb-2 text-orange-500">
          Currency Exchange Setup
        </h2>
        <div className="md:px-5 w-full">
          <Input.Search
            placeholder="Search your currency"
            allowClear
            enterButton="Search"
            size="large"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
          />

          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600 text-center">
              Showing {filteredCurrencies.length} of{" "}
              {currencies_data?.length || 0} results
            </div>
          )}
        </div>

        <div className="w-full md:px-5 flex flex-col gap-y-4">
          <p className="text-lg font-gotham font-bold uppercase text-blue-900 flex items-center justify-between ">
            <p className="text">All Currencies</p>
            <p className="addBtn">
              <IoAddCircle
                className="text-3xl text-green-500 cursor-pointer"
                onClick={() => setShowAddCurrency(true)}
              />
            </p>
          </p>
          <div className="table overflow-x-auto w-full">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-blue-900 text-white text-left text-sm sm:text-base">
                  <th className="px-4 py-3 font-gotham text-center">
                    DESCRIPTION
                  </th>
                  <th className="px-4 py-3 font-gotham text-center">SYMBOL</th>
                  <th className="px-4 py-3 font-gotham text-center">STATUS</th>
                  <th className="px-4 py-3 font-gotham text-center">
                    BASE CURRENCY
                  </th>
                  <th className="px-4 py-3 font-gotham text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm sm:text-base">
                {/* **CHANGED FROM currencies_data TO filteredCurrencies** */}
                {filteredCurrencies &&
                  filteredCurrencies.length > 0 &&
                  filteredCurrencies?.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-blue-50"
                      onClick={() => setCriteria(item.tpCUR_CODE)}
                    >
                      <td className="px-4 py-3 font-gotham font-light text-center">
                        {item.tpCUR_DESCRIPTION}
                      </td>
                      <td className="px-4 py-3 font-gotham font-light text-center">
                        {item.tpCUR_SYMBOL}
                      </td>
                      <td className="px-4 py-3 font-gotham font-light text-center">
                        {item.tpCUR_ACTIVE == 1 ? "Active" : "Inactive"}
                      </td>
                      <td className="px-4 py-3 font-gotham font-light text-center">
                        {item.tpCUR_BASECURRENCY == 1 ? (
                          <input
                            type="checkbox"
                            checked
                            disabled
                            className="bg-blue-500 text-blue-500"
                          />
                        ) : (
                          <input type="checkbox" checked={false} disabled />
                        )}
                      </td>
                      <td className="px-4 py-3 font-gotham font-light flex gap-x-4 items-center justify-center">
                        <BsCurrencyExchange
                          className={`text-orange-500 text-lg cursor-pointer ${
                            item.tpCUR_BASECURRENCY == 1
                              ? "hidden"
                              : "inline-block"
                          }`}
                          title="Exchange"
                          onClick={() => {
                            setUserSelectedCurrency({
                              desc: item.tpCUR_DESCRIPTION,
                              tp_EXRCODE: "",
                            });
                            setShowExchangeCurrencyModal(true);
                            setCriteria(item.tpEXR_CURRENCYCODE);
                            setCallCurrencies(true);
                          }}
                        />
                        <FaRegEdit
                          className={`text-orange-500 text-lg cursor-pointer ${
                            item.tpCUR_BASECURRENCY == 1
                              ? "hidden"
                              : "inline-block"
                          }`}
                          title="Edit"
                          onClick={() => {
                            setDataToEdit({
                              desc: item.tpCUR_DESCRIPTION,
                              symbol: item.tpCUR_SYMBOL,
                            });
                            setShowEditCurrencyModal(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))}

                {/* **ADDED NO RESULTS MESSAGE** */}
                {filteredCurrencies.length === 0 && searchTerm && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No currencies found for &quot;{searchTerm}&quot;
                    </td>
                  </tr>
                )}

                {/* **ADDED NO DATA MESSAGE** */}
                {(!currencies_data || currencies_data.length === 0) &&
                  !searchTerm && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No currencies available
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Currency */}
      <Modal
        title={
          <span className="text-orange-500 font-gotham font-normal text-lg">
            Add Currency
          </span>
        }
        open={showAddCurrencyModal}
        onCancel={() => {
          setShowAddCurrencyModal(false);
          setShowAddCurrency(false);
        }}
        footer={null}
        centered
        destroyOnClose
      >
        <Formik
          initialValues={{
            tpCUR_DESCRIPTION: "",
            tpCUR_SYMBOL: "",
            tpCUR_BASECURRENCY: 0,
          }}
          validationSchema={Yup.object({
            tpCUR_DESCRIPTION: Yup.string()
              .trim()
              .matches(/^[A-Za-z ]+$/, "Letters and spaces only")
              .max(40, "Description must be 40 characters or less")
              .required("Currency description is required"),
            tpCUR_SYMBOL: Yup.string()
              .trim()
              .matches(/^[A-Za-z]{2,5}$/, "Use 2–5 letters only (e.g. PKR)")
              .required("Currency symbol is required"),
          })}
          onSubmit={async (values, { resetForm }) => {
            let data = {
              ...values,
              tpCUR_BASECURRENCY: "0",
            };
            await setCurrencyApi(data);
            resetForm();
            setShowAddCurrencyModal(false);
            setShowAddCurrency(false);
          }}
        >
          {({ resetForm }) => (
            <FormikForm className="flex flex-col gap-4">
              <div>
                <label className="block font-gotham font-normal text-blue-900">
                  Currency Description
                </label>
                <Field
                  type="text"
                  name="tpCUR_DESCRIPTION"
                  autoComplete="off"
                  placeholder="e.g. PAK Rupee"
                  className="w-full !border outline-none border-gray-300 rounded-md px-3 py-2 mt-1"
                />
                <ErrorMessage
                  name="tpCUR_DESCRIPTION"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block font-gotham font-normal text-blue-900">
                  Currency Symbol
                </label>
                <Field
                  type="text"
                  name="tpCUR_SYMBOL"
                  placeholder="e.g. PKR"
                  autoComplete="off"
                  className="w-full border border-gray-300 outline-none rounded-md px-3 py-2 mt-1"
                />
                <ErrorMessage
                  name="tpCUR_SYMBOL"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  onClick={() => {
                    resetForm();
                    setShowAddCurrencyModal(false);
                    setShowAddCurrency(false);
                  }}
                  className="!bg-gray-300 !text-black !font-gotham !font-light"
                >
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  className="!bg-green-500 !text-white !font-gotham !font-light"
                  onClick={() => setCallCurrencies(true)}
                >
                  Add
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Modal>

      {/* Edit Currency */}
      <Modal
        title={
          <span className="text-orange-500 font-gotham font-normal text-lg">
            Edit Currency
          </span>
        }
        open={showEditCurrencyModal}
        onCancel={() => {
          setShowEditCurrencyModal(false);
        }}
        footer={null}
        centered
        destroyOnClose
      >
        <Formik
          initialValues={{
            tpCUR_DESCRIPTION: dataToEdit.desc,
            tpCUR_SYMBOL: dataToEdit.symbol,
          }}
          validationSchema={Yup.object({
            tpCUR_DESCRIPTION: Yup.string()
              .trim()
              .matches(/^[A-Za-z ]+$/, "Letters and spaces only")
              .max(40, "Description must be 40 characters or less")
              .required("Currency description is required"),
          })}
          onSubmit={async (values, { resetForm }) => {
            let data = {
              ...values,
              tpCUR_BASECURRENCY: "0",
            };
            await setCurrencyApi(data);
            resetForm();
            setShowAddCurrencyModal(false);
            setShowAddCurrency(false);
          }}
        >
          {({ resetForm }) => (
            <FormikForm className="flex flex-col gap-4">
              <div>
                <label className="block font-gotham font-normal text-blue-900">
                  Currency Description
                </label>
                <Field
                  type="text"
                  name="tpCUR_DESCRIPTION"
                  autoComplete="off"
                  placeholder="e.g. PAK Rupee"
                  className="w-full !border outline-none border-gray-300 rounded-md px-3 py-2 mt-1"
                />
                <ErrorMessage
                  name="tpCUR_DESCRIPTION"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block font-gotham font-normal text-blue-900">
                  Currency Symbol
                </label>
                <Field
                  type="text"
                  name="tpCUR_SYMBOL"
                  autoComplete="off"
                  readOnly
                  placeholder="e.g. PKR"
                  className="w-full border border-gray-300 outline-none rounded-md px-3 py-2 mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  onClick={() => {
                    resetForm();
                    setShowEditCurrencyModal(false);
                  }}
                  className="!bg-gray-300 !text-black !font-gotham !font-light"
                >
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  className="!bg-green-500 !text-white !font-gotham !font-normal"
                  onClick={() => setCallCurrencies(true)}
                >
                  Edit
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Modal>

      {/* Exchange Currency */}
      <Modal
        title={
          <span className="text-orange-500 font-gotham font-normal text-lg">
            {userSelectedCurrency?.desc} Exchange Rates
          </span>
        }
        open={showExchangeCurrencyModal}
        onCancel={() => {
          setShowExchangeCurrencyModal(false);
        }}
        footer={null}
        centered
        destroyOnClose
        width={730}
      >
        <div className="parent overflow-x-auto">
          <div className="header flex w-full justify-between items-center py-3">
            <div className="left font-gotham font-light">
              Show Results
              <select
                id="result"
                className="border border-black/40 text-xs text-black font-gotham font-light min-w-32 outline-none ml-3 appearance-none p-2 rounded-sm"
                onChange={(e) => {
                  const value = e.target.value;
                  setMaxRecords(value === "all" ? -1 : parseInt(value));
                }}
              >
                <option value="3" className="font-gotham font-light">
                  Last 3 Records
                </option>
                <option value="10" className="font-gotham font-light">
                  Last 10 Records
                </option>
                <option value="all" className="font-gotham font-light">
                  All Records
                </option>
              </select>
            </div>
            <div className="right">
              <button
                className="px-2 py-2 rounded bg-orange-500 text-white font-gotham font-normal cursor-pointer text-sm"
                onClick={() => {
                  setShowExchangeCurrencyModal(false);
                  setShowSetCurrencyExchangeModal(true);
                }}
              >
                Set New Exch. Rate
              </button>
            </div>
          </div>
          <div className="table overflow-x-auto w-full">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-blue-900 text-white text-center">
                  <th className="px-4 py-3 font-gotham text-sm">Date</th>
                  <th className="px-4 py-3 font-gotham text-sm">Exch. Rate</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {maxRecords == -1
                  ? exchangeData.length > 0 &&
                    exchangeData?.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-blue-50 text-center"
                      >
                        <td className="px-4 py-3 font-gotham font-light text-sm">
                          {item.tpEXR_DATE}
                        </td>
                        <td className="px-4 py-3 font-gotham font-light text-sm text-center flex items-center justify-center">
                          <input
                            type="text"
                            readOnly={
                              index == 0
                                ? !getDateConfirmation(item.tpEXR_DATE)
                                : true
                            }
                            value={Number(item?.tpEXR_RATE)?.toFixed(2)}
                            className={`border-none outline-none text-center bg-transparent`}
                          />
                          {getDateConfirmation(item.tpEXR_DATE) ? (
                            <FaRegEdit className="cursor-pointer" />
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    ))
                  : exchangeData.length > 0 &&
                    exchangeData?.slice(0, maxRecords)?.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-blue-50">
                        <td className="px-4 py-3 font-gotham font-light text-sm text-center">
                          {item.tpEXR_DATE}
                        </td>
                        <td className="px-4 py-3 font-gotham font-light text-sm text-center flex items-center justify-center">
                          <input
                            type="text"
                            readOnly={
                              index == 0
                                ? !getDateConfirmation(item.tpEXR_DATE)
                                : true
                            }
                            value={Number(item?.tpEXR_RATE)?.toFixed(2)}
                            className={`border-none outline-none text-center bg-transparent`}
                          />
                          {getDateConfirmation(item.tpEXR_DATE) ? (
                            <FaRegEdit
                              className="cursor-pointer"
                              onClick={() => {
                                setShowSetCurrencyExchangeModal(true);
                                setUserSelectedCurrency((prev) => ({
                                  desc: prev.desc,
                                  tp_EXRCODE: item.tpEXR_CODE,
                                }));
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Set Exchange */}
      <Modal
        title={
          <span className="text-orange-500 font-gotham font-normal text-lg">
            Set Exchange
          </span>
        }
        open={showSetCurrencyExchangeModal}
        onCancel={() => {
          setShowExchangeCurrencyModal(true);
          setShowSetCurrencyExchangeModal(false);
        }}
        footer={null}
        centered
        destroyOnClose
      >
        <Formik
          initialValues={{
            tpCUR_DESCRIPTION: userSelectedCurrency.desc,
            exchangeRate: "",
          }}
          validationSchema={Yup.object({
            tpCUR_DESCRIPTION: Yup.string().required(
              "Currency description is required"
            ),
            exchangeRate: Yup.string()
              .required("Exchange rate is required")
              .matches(
                /^[0-9]*(\.[0-9]*)?$/,
                "Must be a valid number (e.g. 0.001); no letters or symbols"
              ),
          })}
          onSubmit={async (values, { resetForm }) => {
            let data = {
              tpEXR_CODE: userSelectedCurrency?.tp_EXRCODE,
              tpEXR_CURRENCYCODE: criteria,
              tpEXR_DATE: `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getUTCDate()}`,
              tpEXR_RATE: values.exchangeRate,
              tpEXR_MODIFIEDBY: sessionStorage.getItem("username").trim(),
            };
            let resp = await setExchangeSetup(data);

            alert(resp);
            setCallCurrencies(true);
            resetForm();
            setShowExchangeCurrencyModal(true);
            setShowSetCurrencyExchangeModal(false);
          }}
        >
          {({ resetForm }) => (
            <FormikForm className="flex flex-col gap-4">
              <div>
                <label className="block font-gotham font-normal text-blue-900">
                  Currency Description
                </label>
                <Field
                  type="text"
                  name="tpCUR_DESCRIPTION"
                  readOnly
                  placeholder="e.g. PAK Rupee"
                  className="w-full !border outline-none border-gray-300 rounded-md px-3 py-2 mt-1"
                />
                <ErrorMessage
                  name="tpCUR_DESCRIPTION"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label className="block font-gotham font-normal text-blue-900">
                  Enter Exch. Rate
                </label>
                <Field
                  type="text"
                  name="exchangeRate"
                  placeholder="e.g. 0.001"
                  autoComplete="off"
                  className="w-full border border-gray-300 outline-none rounded-md px-3 py-2 mt-1"
                />
                <ErrorMessage
                  name="exchangeRate"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  onClick={() => {
                    resetForm();
                    setShowExchangeCurrencyModal(true);
                    setShowSetCurrencyExchangeModal(false);
                  }}
                  className="!bg-gray-300 !text-black !font-gotham !font-light"
                >
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  className="!bg-green-500 !text-white !font-gotham !font-normal"
                  onClick={() => handleSetExchange()}
                >
                  Set Exchange
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Page;
