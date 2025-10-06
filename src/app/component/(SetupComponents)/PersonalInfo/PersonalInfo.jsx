import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { getCountries } from "@/utils/getCountries";
import { components } from "@/constants/components";
import { SlCalender } from "react-icons/sl";
import { RxCross1 } from "react-icons/rx";
import { DatePicker, Select } from "antd";
import { getCity } from "@/utils/getCity";

const PersonalInfo = () => {
  const { InputBoxText } = components;
  const [genderSelected, setGenderSelected] = useState(false);
  const [cities, setCities] = useState("");
  const [city, setCity] = useState();

  useEffect(() => {
    const abortController = new AbortController();
    const getData = async () => {
      const data = await getCity();
      setCities(data);
    };
    getData();
    return () => {
      abortController.abort();
    };
  }, []);

  const [country, setCountry] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const countries = await getCountries();
      setCountry(countries);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Personal Information Section */}
      <div className="w-full">
        <div className="title bg-blue-900 w-full py-4 px-4 md:px-6">
          <h3 className="text-orange-500 font-gotham font-semibold text-lg md:text-xl break-words">
            Personal Information
          </h3>
        </div>
        <div className="form bg-white py-2 px-4 md:px-6 border">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              title: "",
              gender: "",
              passportCountry: "",
              passportNumber: "",
            }}
            validationSchema={Yup.object({
              firstName: Yup.string().required("FirstName is required"),
              lastName: Yup.string().required("LastName is required"),
              title: Yup.string().required("Select Title is required"),
              gender: Yup.string().required("Select Gender is required"),
              passportCountry: Yup.string().required("Select Country"),
              passportNumber: Yup.string().required(
                "Passport Number is required"
              ),
            })}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleSubmit,
              handleChange,
              setFieldValue,
            }) => {
              const handleGenderClick = (genderValue) => {
                setFieldValue("gender", genderValue);
              };
              return (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 py-4 md:py-8 items-start w-full"
                >
                  <div className="formFields grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pb-3">
                    {/* For Title */}
                    <div className="flex flex-col gap-y-1 min-w-0 ">
                      <label
                        htmlFor="title"
                        className="text-sm font-medium break-words"
                      >
                        Title*
                      </label>
                      <select
                        id="title"
                        name="title"
                        className="border rounded p-4 px-3 focus:outline-none text-sm font-gotham font-light bg-white w-full min-w-0"
                        value={values.title}
                        onChange={handleChange}
                      >
                        <option value="">Select Title</option>
                        <option value="mr">Mr</option>
                        <option value="mrs">Mrs</option>
                        <option value="miss">Miss</option>
                      </select>
                      {touched.title && errors.title && (
                        <div className="text-sm text-red-500 break-words">
                          {errors.title}
                        </div>
                      )}
                    </div>

                    {/* For FirstName */}
                    <div className="flex flex-col gap-y-1 min-w-0">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium break-words"
                      >
                        First Name*
                      </label>
                      <input
                        autoComplete="off"
                        type="text"
                        className="border rounded p-4 px-3 focus:outline-none text-sm font-gotham font-light w-full min-w-0"
                        placeholder="Enter First Name"
                        id="firstName"
                        name="firstName"
                        onChange={handleChange}
                        value={values.firstName}
                      />
                      {touched.firstName && errors.firstName && (
                        <div className="text-sm text-red-500 break-words">
                          {errors.firstName}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-y-1 min-w-0">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium break-words"
                      >
                        Last Name*
                      </label>
                      <input
                        autoComplete="off"
                        type="text"
                        className="border rounded p-4 px-3 focus:outline-none text-sm font-gotham font-light w-full min-w-0"
                        placeholder="Enter Last Name"
                        id="lastName"
                        name="lastName"
                        onChange={handleChange}
                        value={values.lastName}
                      />
                      {touched.lastName && errors.lastName && (
                        <div className="text-sm text-red-500 break-words">
                          {errors.lastName}
                        </div>
                      )}
                    </div>

                    {/* For DOB */}
                    <div className="flex flex-col gap-y-1 min-w-0">
                      <label
                        htmlFor="dob"
                        className="text-sm font-medium break-words"
                      >
                        DOB*
                      </label>
                      <div className="w-full">
                        <InputBoxText
                          smallScreenPadding="p-2"
                          disableNextDates={true}
                          className="border w-full"
                          name="DateOfBirth"
                          TabIndex={3}
                          ReadOnly={true}
                          Placeholder="Date of Birth"
                          InputIcon={<SlCalender />}
                          CrossIcon={<RxCross1 />}
                          RangePicker={DatePicker}
                          onChange={(date) => {
                            handleChange(
                              index,
                              "birthDate",
                              `${date.$y}-${date.$M + 1}-${date.$D}`
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="formFields grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pb-3">
                    {/* Gender */}
                    <div className="flex flex-col gap-y-1 min-w-0">
                      <label className="text-sm font-medium break-words">
                        Gender*
                      </label>
                      <div className="flex items-center w-full h-12">
                        <span
                          className={`border w-full min-h-full flex items-center justify-center cursor-pointer font-gotham rounded-l text-sm ${
                            values.gender === "male"
                              ? "bg-blue-200"
                              : "bg-white"
                          }`}
                          onClick={() => {
                            setGenderSelected(values.gender !== "male");
                            handleGenderClick("male");
                          }}
                        >
                          M
                        </span>
                        <span
                          className={`border border-l-0 w-full min-h-full flex items-center justify-center cursor-pointer font-gotham rounded-r text-sm ${
                            values.gender === "female"
                              ? "bg-blue-200"
                              : "bg-white"
                          }`}
                          onClick={() => {
                            setGenderSelected(values.gender !== "female");
                            handleGenderClick("female");
                          }}
                        >
                          F
                        </span>
                      </div>
                      {touched.gender && errors.gender && (
                        <div className="text-sm text-red-500 break-words">
                          {errors.gender}
                        </div>
                      )}
                    </div>

                    {/* Country */}
                    <div className="flex flex-col gap-y-1 min-w-0">
                      <label
                        htmlFor="passportCountry"
                        className="text-sm font-medium break-words"
                      >
                        Select Passport Country*
                      </label>
                      <select
                        id="passportCountry"
                        name="passportCountry"
                        className="border rounded p-3 focus:outline-none text-sm font-gotham font-light bg-white w-full min-w-0"
                        value={values.passportCountry}
                        onChange={handleChange}
                      >
                        <option
                          value=""
                          disabled
                          className="font-gotham font-light"
                        >
                          - Select your country -
                        </option>
                        {country?.map((coun, idx) => (
                          <option
                            value={coun.tpCC_COUNTRY_CODE}
                            key={idx}
                            className="font-gotham font-light"
                          >
                            {coun.tpCC_COUNTRY}
                          </option>
                        ))}
                      </select>
                      {touched.passportCountry && errors.passportCountry && (
                        <div className="text-sm text-red-500 font-gotham font-light break-words">
                          {errors.passportCountry}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-y-1 min-w-0">
                      <label
                        htmlFor="passportNumber"
                        className="text-sm font-medium break-words"
                      >
                        Passport Number*
                      </label>
                      <input
                        autoComplete="off"
                        type="text"
                        className="border rounded py-4 px-3 focus:outline-none text-sm font-gotham font-light w-full min-w-0"
                        placeholder="Enter your Passport Number"
                        id="passportNumber"
                        name="passportNumber"
                        onChange={handleChange}
                        value={values.passportNumber}
                      />
                      {touched.passportNumber && errors.passportNumber && (
                        <div className="text-sm text-red-500 break-words">
                          {errors.passportNumber}
                        </div>
                      )}
                    </div>

                    {/* Passport Expiry */}
                    <div className="flex flex-col gap-y-1 min-w-0">
                      <label className="text-sm font-medium break-words">
                        Passport Expiry*
                      </label>
                      <div className="w-full">
                        <InputBoxText
                          smallScreenPadding="p-2"
                          name="DateOfPassportExpiration"
                          disableOnlyPrevDates={true}
                          className="border w-full"
                          TabIndex={3}
                          ReadOnly={true}
                          Placeholder="Passport Expiration Date"
                          InputIcon={<SlCalender />}
                          CrossIcon={<RxCross1 />}
                          RangePicker={DatePicker}
                          onChange={(date) =>
                            handleChange(
                              index,
                              "expireDate",
                              `${date.$y}-${date.$M + 1}-${date.$D}`
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="w-full">
        <div className="title bg-blue-900 w-full py-4 px-4 md:px-6">
          <h3 className="text-orange-500 font-gotham font-semibold text-lg md:text-xl break-words">
            Contact Information
          </h3>
        </div>
        <div className="form bg-white py-2 px-4 md:px-6 border">
          <Formik
            initialValues={{
              emailAddress: "",
              countryCode: "",
              contactNo: "",
              alternatEmail: "",
              alternateCountryCode: "",
              alternateContactNo: "",
            }}
            validationSchema={Yup.object({
              emailAddress: Yup.string().required("Email is required"),
              countryCode: Yup.string().required("Select Country Code"),
              contactNo: Yup.string().required("Contact Number is required"),
              alternatEmail: Yup.string().required(
                "Alternate Email is required"
              ),
              alternateCountryCode: Yup.string().required(
                "Select Alternate Country Code"
              ),
              alternateContactNo: Yup.string().required(
                "Alternate Contact Number is required"
              ),
            })}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleSubmit,
              handleChange,
            }) => (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 py-4 md:py-8 items-start w-full"
              >
                <div className="formFields grid grid-cols-1 md:grid-cols-3 gap-4 w-full pb-3">
                  <div className="flex flex-col gap-y-1 min-w-0">
                    <label
                      htmlFor="emailAddress"
                      className="text-sm font-medium break-words"
                    >
                      Email*
                    </label>
                    <input
                      autoComplete="off"
                      type="email"
                      className="border rounded p-3 focus:outline-none text-sm font-gotham font-light w-full min-w-0"
                      placeholder="Enter Email Address"
                      id="emailAddress"
                      name="emailAddress"
                      onChange={handleChange}
                      value={values.emailAddress}
                    />
                    {touched.emailAddress && errors.emailAddress && (
                      <div className="text-sm text-red-500 break-words">
                        {errors.emailAddress}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-y-1 min-w-0">
                    <label
                      htmlFor="countryCode"
                      className="text-sm font-medium break-words"
                    >
                      Country / Territory Code*
                    </label>
                    <select
                      id="countryCode"
                      name="countryCode"
                      className="border rounded p-3 focus:outline-none text-sm font-gotham font-light bg-white w-full min-w-0"
                      value={values.countryCode}
                      onChange={handleChange}
                    >
                      <option
                        value=""
                        disabled
                        className="font-gotham font-light"
                      >
                        - Select your country -
                      </option>
                      {country?.map((coun, idx) => (
                        <option
                          value={coun.tpCC_COUNTRY_CODE}
                          key={idx}
                          className="font-gotham font-light"
                        >
                          {coun.tpCC_COUNTRY}
                        </option>
                      ))}
                    </select>
                    {touched.countryCode && errors.countryCode && (
                      <div className="text-sm text-red-500 break-words">
                        {errors.countryCode}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-y-1 min-w-0">
                    <label
                      htmlFor="contactNo"
                      className="text-sm font-medium break-words"
                    >
                      Phone*
                    </label>
                    <input
                      autoComplete="off"
                      type="text"
                      className="border rounded p-3 focus:outline-none text-sm font-gotham font-light w-full min-w-0"
                      placeholder="Contact Number"
                      id="contactNo"
                      name="contactNo"
                      onChange={handleChange}
                      value={values.contactNo}
                    />
                    {touched.contactNo && errors.contactNo && (
                      <div className="text-sm text-red-500 break-words">
                        {errors.contactNo}
                      </div>
                    )}
                  </div>
                </div>

                <div className="formFields grid grid-cols-1 md:grid-cols-3 gap-4 w-full pb-3">
                  <div className="flex flex-col gap-y-1 min-w-0">
                    <label
                      htmlFor="alternatEmail"
                      className="text-sm font-medium break-words"
                    >
                      Alternate Email*
                    </label>
                    <input
                      autoComplete="off"
                      type="email"
                      className="border rounded p-3 focus:outline-none text-sm font-gotham font-light w-full min-w-0"
                      placeholder="Alternate Email"
                      id="alternatEmail"
                      name="alternatEmail"
                      onChange={handleChange}
                      value={values.alternatEmail}
                    />
                    {touched.alternatEmail && errors.alternatEmail && (
                      <div className="text-sm text-red-500 break-words">
                        {errors.alternatEmail}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-y-1 min-w-0">
                    <label
                      htmlFor="alternateCountryCode"
                      className="text-sm font-medium break-words"
                    >
                      Alternate Country Code*
                    </label>
                    <select
                      id="alternateCountryCode"
                      name="alternateCountryCode"
                      className="border rounded p-3 focus:outline-none text-sm font-gotham font-light bg-white w-full min-w-0"
                      value={values.alternateCountryCode}
                      onChange={handleChange}
                    >
                      <option
                        value=""
                        disabled
                        className="font-gotham font-light"
                      >
                        - Select your country -
                      </option>
                      {country?.map((coun, idx) => (
                        <option
                          value={coun.tpCC_COUNTRY_CODE}
                          key={idx}
                          className="font-gotham font-light"
                        >
                          {coun.tpCC_COUNTRY}
                        </option>
                      ))}
                    </select>
                    {touched.alternateCountryCode &&
                      errors.alternateCountryCode && (
                        <div className="text-sm text-red-500 break-words">
                          {errors.alternateCountryCode}
                        </div>
                      )}
                  </div>

                  <div className="flex flex-col gap-y-1 min-w-0">
                    <label
                      htmlFor="alternateContactNo"
                      className="text-sm font-medium break-words"
                    >
                      Alternate Phone*
                    </label>
                    <input
                      autoComplete="off"
                      type="text"
                      className="border rounded p-3 focus:outline-none text-sm font-gotham font-light w-full min-w-0"
                      placeholder="Alternate Contact Number"
                      id="alternateContactNo"
                      name="alternateContactNo"
                      onChange={handleChange}
                      value={values.alternateContactNo}
                    />
                    {touched.alternateContactNo &&
                      errors.alternateContactNo && (
                        <div className="text-sm text-red-500 break-words">
                          {errors.alternateContactNo}
                        </div>
                      )}
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>

      {/* Billing Information Section */}
      <div className="w-full">
        <div className="title bg-blue-900 w-full py-4 px-4 md:px-6">
          <h3 className="text-orange-500 font-gotham font-semibold text-lg md:text-xl break-words">
            Billing Information
          </h3>
        </div>
        <div className="form bg-white py-2 px-4 md:px-6 border">
          <Formik
            initialValues={{
              billingAddFirstName: "",
              billingAddLastName: "",
              billingAddressCountry: "",
              billingAddressCity: "",
              billingAddress: "",
            }}
            validationSchema={Yup.object({
              billingAddFirstName: Yup.string().required(
                "FirstName is required"
              ),
              billingAddLastName: Yup.string().required("LastName is required"),
              billingAddressCountry: Yup.string().required("Select Country"),
              billingAddress: Yup.string().required(
                "Billing Address is required"
              ),
            })}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleSubmit,
              handleChange,
            }) => (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 py-4 md:py-8 items-start w-full"
              >
                <div className="formFields grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pb-3">
                  <div className="flex flex-col gap-y-1 min-w-0">
                    <label
                      htmlFor="billingAddFirstName"
                      className="text-sm font-medium break-words"
                    >
                      First Name*
                    </label>
                    <input
                      autoComplete="off"
                      type="text"
                      className="border rounded p-3 focus:outline-none text-sm font-gotham font-light w-full min-w-0"
                      placeholder="Enter First Name"
                      id="billingAddFirstName"
                      name="billingAddFirstName"
                      onChange={handleChange}
                      value={values.billingAddFirstName}
                    />
                    {touched.billingAddFirstName &&
                      errors.billingAddFirstName && (
                        <div className="text-sm text-red-500 break-words">
                          {errors.billingAddFirstName}
                        </div>
                      )}
                  </div>

                  <div className="flex flex-col gap-y-1 min-w-0">
                    <label
                      htmlFor="billingAddLastName"
                      className="text-sm font-medium break-words"
                    >
                      Last Name*
                    </label>
                    <input
                      autoComplete="off"
                      type="text"
                      className="border rounded p-3 focus:outline-none text-sm font-gotham font-light w-full min-w-0"
                      placeholder="Enter Last Name"
                      id="billingAddLastName"
                      name="billingAddLastName"
                      onChange={handleChange}
                      value={values.billingAddLastName}
                    />
                    {touched.billingAddLastName &&
                      errors.billingAddLastName && (
                        <div className="text-sm text-red-500 break-words">
                          {errors.billingAddLastName}
                        </div>
                      )}
                  </div>

                  <div className="flex flex-col gap-y-1 min-w-0">
                    <label
                      htmlFor="billingAddressCountry"
                      className="text-sm font-medium break-words"
                    >
                      Country*
                    </label>
                    <select
                      id="billingAddressCountry"
                      name="billingAddressCountry"
                      className="border rounded p-3 focus:outline-none text-sm font-gotham font-light bg-white w-full min-w-0"
                      value={values.billingAddressCountry}
                      onChange={handleChange}
                    >
                      <option
                        value=""
                        disabled
                        className="font-gotham font-light"
                      >
                        - Select your country -
                      </option>
                      {country?.map((coun, idx) => (
                        <option
                          value={coun.tpCC_COUNTRY_CODE}
                          key={idx}
                          className="font-gotham font-light"
                        >
                          {coun.tpCC_COUNTRY}
                        </option>
                      ))}
                    </select>
                    {touched.billingAddressCountry &&
                      errors.billingAddressCountry && (
                        <div className="text-sm text-red-500 break-words">
                          {errors.billingAddressCountry}
                        </div>
                      )}
                  </div>

                  <div className="flex flex-col gap-y-1 min-w-0">
                    <label
                      htmlFor="city"
                      className="text-sm font-medium break-words"
                    >
                      City*
                    </label>
                    <div className="w-full">
                      <Select
                        showSearch
                        placeholder="Select City"
                        className="w-full font-gotham font-light"
                        optionFilterProp="children"
                        style={{
                          width: "100%",
                          height: "48px",
                        }}
                        value={city || null}
                        onChange={(value) => {
                          setCity(value);
                        }}
                        filterOption={(input, option) => {
                          return option.children
                            .toLowerCase()
                            .includes(input.toLowerCase());
                        }}
                      >
                        {cities?.map &&
                          cities.map((c) => (
                            <Select.Option
                              key={c.tpCC_CODE}
                              value={c.tpCC_CODE}
                            >
                              {`${c.tpCC_CITY} (${c.tpCC_COUNTRY_CODE})`}
                            </Select.Option>
                          ))}
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="formFields grid grid-cols-1 gap-4 w-full pb-3">
                  <div className="flex flex-col gap-y-1 min-w-0">
                    <label
                      htmlFor="billingAddress"
                      className="text-sm font-medium break-words"
                    >
                      Billing Address*
                    </label>
                    <input
                      autoComplete="off"
                      type="text"
                      className="border rounded p-3 focus:outline-none text-sm font-gotham font-light w-full min-w-0"
                      placeholder="Enter Billing Address"
                      id="billingAddress"
                      name="billingAddress"
                      onChange={handleChange}
                      value={values.billingAddress}
                    />
                    {touched.billingAddress && errors.billingAddress && (
                      <div className="text-sm text-red-500 break-words">
                        {errors.billingAddress}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="border px-4 py-2 bg-orange-500 cursor-pointer text-white font-gotham rounded-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
