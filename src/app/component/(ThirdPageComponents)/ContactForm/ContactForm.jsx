"use client";
import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { RxCross1 } from "react-icons/rx";
import { SlCalender } from "react-icons/sl";
import { Form, Select, DatePicker, Input } from "antd";
import { components } from "@/constants/components";
import "./ContactForm.css";
import LoadingAnim from "../loadingAnim/LoadingAnim";

const ContactForm = ({
  travelersArray,
  handleChange,
  travelersData,
  CAFOptions,
  selectBefore,
  setSelectedCountryCode,
  setFirstName,
  setLastName,
  setCountry,
  setEmail,
  setBillingInfo,
  form,
  loadingTravelersId,
  flightCriteria,
}) => {
  const { InputBoxText } = components;
  const { Option } = Select;
  const commonInputStyles =
    "!block !w-full !h-14 !px-2.5 !pt-4 !pb-2.5 rounded border text-sm text-gray-900 bg-transparent";
  const commonSelectStyles =
    "w-full !h-14 md:h-14 rounded text-sm text-blue-900";
  const validatePassport = (_, value) => {
    if (!value) return Promise.reject("This field is required");
    if (value.length < 7 || value.length > 12) {
      return Promise.reject(
        "Passport number must be between 7 and 12 characters."
      );
    }

    if (!/^[A-Za-z0-9]+$/.test(value)) {
      return Promise.reject(
        "Passport number should only contain letters and numbers."
      );
    }

    return Promise.resolve();
  };
  const validateName = (_, value) => {
    if (!value) return Promise.reject("This field is required");
    if (!/^[A-Za-z\s']+$/.test(value))
      return Promise.reject("Only alphabets are allowed");
    if (!/^[^0-9]*$/.test(value))
      return Promise.reject("Numbers are not allowed");
    return Promise.resolve();
  };

  let mealOption = [
    { type: "", desc: " No Preference"},
    { type: "NOML", desc: "None" },
    { type: "BBML", desc: "Baby" },
    { type: "CHML", desc: "Child" },
    { type: "DBML", desc: "Diabetic" },
    { type: "FPML", desc: "Fruit Platter" },
    { type: "HNML", desc: "Hindu" },
    { type: "VJML", desc: "Jain" },
    { type: "KSML", desc: "Kosher" },
    { type: "LCML", desc: "Low Calorie" },
    { type: "LFML", desc: "Low Fat" },
    { type: "LSML", desc: "Low Salt" },
    { type: "MOML", desc: "Muslim" },
    { type: "NLML", desc: "Non Lactos" },
    { type: "SFML", desc: "Seafood" },
    { type: "VGML", desc: "Vegan" },
    { type: "AVML", desc: "Vegetarian Hindu" },
    { type: "VLML", desc: "Vegetarian Lacto Ovo" },
    { type: "VOML", desc: "Vegetarian Oriental" },
    { type: "RVML", desc: "Vegetarian Raw" },
  ];
  let special_service = [
    { label: " No Preference", value: ""},
    // { label: "None", value: "None" },
    { label: "Traveler is blind", value: "BLND" },
    { label: "Traveler is deaf", value: "DEAF" },
    {
      label:
        "Disabled Passenger with intellectual or development disability needing assistance",
      value: "DPNA",
    },
    {
      label: "Wheelchair is needed – traveler is completely immobile.",
      value: "WCHC",
    },
    {
      label: "Wheelchair is needed – traveler can ascend/descend stairs.",
      value: "WCHR",
    },
    {
      label:
        "Passenger cannot ascend/descend steps but is able to make own way to/from cabin seat. Requires wheelchair for distance to/from aircraft or mobile lounge and must be carried up/down steps.",
      value: "WCHS",
    },
    {
      label:
        "Wheelchair Lithium ION battery to be transported by a passenger which will require advance notification/preparation. Weight and dimensions may be specified. Wheelchair and battery must be claimed and rechecked at each interline transfer point.",
      value: "WCLB",
    },
    {
      label:
        "Wheelchair manual power to be transported by passenger. Weight and dimensions may be specified.",
      value: "WCMP",
    },
    {
      label:
        "Wet cell battery to be transported by passenger. Will require advance notification and may require preparation/(dis)assembly. Weight and dimensions may be specified. Wheelchair and battery must be claimed and rechecked at each interline transfer point.",
      value: "WCBW",
    },
    {
      label:
        "Wheelchair non-spillable battery to be transported by a passenger which will require advance notification/preparation. Weight and dimensions may be specified. Wheelchair and battery must be claimed and rechecked at each interline transfer point.",
      value: "WCBD",
    },
  ];
  return (
    <div className="space-y-8">
      {/* Traveler Data Section */}
      <div className="w-11/12 lg:w-3/4 mx-auto rounded-lg flex flex-col gap-5">
        {travelersArray.map((traveler, index) => (
          <React.Fragment key={index}>
            <div className="border-2 rounded-lg shadow-md">
              {/* Header */}
              <div className="h-14 bg-orange-500 flex items-center">
                <h4 className="pl-3 text-xl text-white font-semibold">
                  {`${traveler.type} ${traveler.id.split("_")[1]}`}
                </h4>
              </div>
              {/* Form Section */}
              <div className="px-5 md:px-10 py-5">
                <Form
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_3fr_3fr_3fr] gap-y-3 sm:gap-4"
                  form={form}
                >
                  {/* Prefix Select */}
                  <Select
                    defaultValue="Mr"
                    onChange={(value) => handleChange(index, "prefix", value)}
                    className={commonSelectStyles}
                    style={{
                      fontFamily: "Gotham",
                      fontWeight: 300,
                      boxShadow: "none",
                    }}
                    dropdownStyle={{
                      boxShadow: "none",
                    }}
                    options={[
                      { value: "Mr", label: "Mr" },
                      { value: "Mrs", label: "Mrs" },
                      { value: "Ms", label: "Ms" },
                      { value: "Miss", label: "Miss" },
                      { value: "Mstr", label: "Mstr" },
                    ]}
                  />

                  {/* First Name */}
                  <Form.Item
                    name={[index, "givenName"]}
                    rules={[{ validator: validateName }]}
                  >
                    <Input
                      type="text"
                      placeholder="First Name"
                      autoComplete="off"
                      className={`${commonInputStyles}`}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setBillingInfo((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }));
                        handleChange(index, "givenName", e.target.value);
                      }}
                    />
                  </Form.Item>

                  {/* Last Name */}
                  <Form.Item
                    name={[index, "surname"]}
                    rules={[{ validator: validateName }]}
                  >
                    <Input
                      type="text"
                      placeholder="Last Name"
                      autoComplete="off"
                      className={commonInputStyles}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setBillingInfo((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }));
                        handleChange(index, "surname", e.target.value);
                      }}
                    />
                  </Form.Item>

                  {/* Date of Birth */}
                  <div className="datePickerforDOB !block !w-full !h-14 !px-2.5 !pt-4 !pb-2.5 md:!pb-0 md:!pt-0 rounded border text-sm text-gray-900 bg-transparent">
                    <InputBoxText
                      disableNextDates={true}
                      // className="block w-full !h-14 rounded border text-sm text-gray-900 bg-transparent"
                      name="DateOfBirth"
                      disableChild={traveler.type == "Child" ? true : false}
                      disableInfant={traveler.type == "Infant" ? true : false}
                      disableAdult={traveler.type == "Adult" ? true : false}
                      minDateProp="01/01/1900"
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
                  {/* Gender Toggle */}
                  <div className="flex flex-col">
                    <ToggleButtonGroup
                      color="primary"
                      exclusive
                      value={travelersData[index]?.gender || ""}
                      onChange={(event, newValue) => {
                        if (newValue !== null) {
                          handleChange(index, "gender", newValue);
                        }
                      }}
                      aria-label="Gender"
                      className="h-14"
                    >
                      <ToggleButton
                        value="male"
                        style={{
                          width: "50%",
                          fontFamily: "Gotham",
                          fontWeight: 300,
                        }}
                      >
                        M
                      </ToggleButton>
                      <ToggleButton
                        value="female"
                        style={{
                          width: "50%",
                          fontFamily: "Gotham",
                          fontWeight: 300,
                        }}
                      >
                        F
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                  {/* Nationality Select */}
                  <div className="relative">
                    <Select
                      id="Nationality"
                      showSearch
                      placeholder="Select Your Nationality"
                      autoComplete="off"
                      optionLabelProp="label"
                      onChange={(value) => {
                        setCountry(value);
                        setBillingInfo((prev) => ({
                          ...prev,
                          country: value,
                        }));
                        handleChange(index, "issueCountry", value);
                        const selectedOption = CAFOptions.find(
                          (option) => option.label === value
                        );
                        if (selectedOption) {
                          setSelectedCountryCode(selectedOption.value);
                        }
                      }}
                      defaultValue={travelersData[index]?.issueCountry}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                      className={`${commonSelectStyles} font-gotham`}
                    >
                      {CAFOptions &&
                        CAFOptions.sort((a, b) =>
                          a.label.localeCompare(b.label)
                        ).map((option, idx) => (
                          <Option
                            key={idx}
                            value={option && option.label}
                            label={option && option.label}
                          >
                            <div className="flex items-center">
                              {/* <Image
                              src={option && option.flag}
                              alt="flag"
                              width={15}
                              height={15}
                            /> */}
                              <span className="ml-2">
                                {option && option.label}
                              </span>
                            </div>
                          </Option>
                        ))}
                    </Select>
                  </div>
                  {/* Passport Number */}
                  <div className="relative">
                    <Form.Item
                      name={[index, "docNumber"]}
                      rules={[{ validator: validatePassport }]}
                    >
                      <Input
                        type="text"
                        autoComplete="off"
                        maxLength={12}
                        placeholder="Passport Number"
                        className={commonInputStyles}
                        onChange={(e) =>
                          handleChange(index, "docNumber", e.target.value)
                        }
                      />
                    </Form.Item>
                  </div>
                  {/* Passport Expiry Date */}
                  <div className="datePickerforExpiry !block !w-full !h-14 !px-2.5 !pt-4 !pb-2.5 md:!pb-0 md:!pt-0 rounded border text-sm text-gray-900 bg-transparent">
                    <InputBoxText
                      name="DateOfPassportExpiration"
                      disableOnlyPrevDates={true}
                      minDateProp={
                        flightCriteria
                          ? flightCriteria[flightCriteria.length - 1]?.arrDate
                          : null
                      }
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
                </Form>
                {/* </div>
              </div> */}
              </div>
            </div>
            {/* Special Service section */}
            <div className="border-2 rounded-lg shadow-md">
              {/* Header */}
              <div className="h-14 bg-orange-500 flex items-center">
                <h4 className="pl-3 text-xl text-white font-semibold">
                  Select special service for{" "}
                  {`${traveler.type} ${traveler.id.split("_")[1]}`}
                </h4>
              </div>
              <div className="px-5 md:px-10 py-5">
                <Form
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-y-3 sm:gap-4"
                  form={form}
                >
                  <Form.Item
                    name={[index, "meal"]}
                    // rules={[{ validator: validateName }]}
                  >
                    <Select
                      id="meal"
                      showSearch
                      placeholder="Select a Meal (optional)"
                      autoComplete="off"
                      optionLabelProp="label"
                      onChange={(value) => {
                        console.log(value);
                      handleChange(index, "meal", value === "No Preference" ? null : value);                      
                      }}
                      filterOption={(input, option) => {
                        return option?.label
                          ?.toLowerCase()
                          .includes(input?.toLowerCase());
                      }}
                      className={`${commonSelectStyles} font-gotham`}
                    >
                      {mealOption &&
                        mealOption
                          .sort((a, b) => a.type.localeCompare(b.type))
                          .map((option, idx) => (
                            <Option
                              key={idx}
                              value={option && option.type}
                              label={option && option.desc}
                            >
                              <div className="flex items-center">
                                <span className="ml-2">
                                  {option && option.desc}
                                </span>
                              </div>
                            </Option>
                          ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name={[index, "special_service"]}
                    // rules={[{ validator: validateName }]}
                  >
                    <Select
                      id="special_service"
                      showSearch
                      placeholder="Select special service (optional)"
                      autoComplete="off"
                      optionLabelProp="label"
                      onChange={(value) => {
                        console.log(value);
                        handleChange(index, "special_service", value === "No Preference" ? null : value);        
                        }}
                      filterOption={(input, option) => {
                        return option?.label
                          ?.toLowerCase()
                          .includes(input?.toLowerCase());
                      }}
                      className={`${commonSelectStyles} font-gotham`}
                    >
                      {special_service &&
                        special_service
                          .sort((a, b) => a.value.localeCompare(b.value))
                          .map((option, idx) => (
                            <Option
                              key={idx}
                              value={option && option.value}
                              label={option && option.label}
                            >
                              <div className="flex items-center">
                                <span className="ml-2">
                                  {option && option.label}
                                </span>
                              </div>
                            </Option>
                          ))}
                    </Select>
                  </Form.Item>
                </Form>
                {/* </div>
              </div> */}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      {/* Contact Information Section */}
      <div className="w-11/12 lg:w-3/4 mx-auto border-2 rounded-lg shadow-md my-4 md:my-8">
        <div className="h-14 w-full bg-orange-500 flex items-center">
          <h4 className="pl-3 text-xl text-white font-semibold">
            Contact Information
          </h4>
        </div>
        <div className="px-5 md:px-10 py-5">
          <div className="flex flex-col gap-4">
            <Form
              className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-4 w-full"
              form={form}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input
                  placeholder="Email"
                  autoComplete="off"
                  className={commonInputStyles}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setBillingInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                    handleChange(0, "email", e.target.value);
                  }}
                />
              </Form.Item>

              <Form.Item
                name="contactPersonName"
                rules={[{ validator: validateName }]}
              >
                <Input
                  placeholder="Contact Person Name"
                  autoComplete="off"
                  className={commonInputStyles}
                  onChange={(e) =>
                    handleChange(0, "Contact Person Name", e.target.value)
                  }
                />
              </Form.Item>
              <div className="relative">
                <Input
                  placeholder="Contact Number"
                  className="block w-full !h-14 rounded text-sm text-gray-900 bg-transparent focus:outline-none focus:ring-0 peer font-gotham"
                  autoComplete="off"
                  addonBefore={selectBefore}
                  id="ContactNumber"
                  inputMode="numeric"
                  pattern="\d*"
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange(0, "phoneNumber", numericValue);
                  }}
                  onKeyDown={(e) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "Tab",
                      "Escape",
                      "Enter",
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                    ];
                    const isNumber = /^[0-9]$/.test(e.key);
                    if (!isNumber && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  value={travelersData[0]?.phoneNumber || ""}
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
      <div className={loadingTravelersId ? "inline-block" : "hidden"}>
        <LoadingAnim src="https://lottie.host/1e7e29b2-401b-406e-a731-392e6375bc4c/KtXONLJOCl.lottie"></LoadingAnim>
      </div>
    </div>
  );
};

export default ContactForm;
