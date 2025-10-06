import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { getCountries } from "@/utils/getCountries";

const EmergencyContact = () => {
  const [genderSelected, setGenderSelected] = useState(false);
  const [country, setCountry] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const countries = await getCountries();
      setCountry(countries);
    };
    fetchData();
  }, []);
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters"),

    lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters"),

    gender: Yup.string()
      .required("Gender is required")
      .oneOf(["male", "female", "other"], "Invalid gender"),

    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    country: Yup.string().required("Country is required"),

    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{10,15}$/, "Phone number must be 10 to 15 digits"),

    address: Yup.string()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters"),
  });

  return (
    <div className="w-full">
      <div className="title bg-blue-900 w-full py-4 px-6">
        <h3 className="text-orange-500 font-gotham font-semibold text-lg">
          Emergency Contact Information
        </h3>
      </div>
      <div className="form bg-white py-2 px-6 border">
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            gender: "",
            email: "",
            country: "",
            phone: "",
            address: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            // console.log(values);
            // console.log("countries: ", country);
          }}
        >
          {({
            values,
            errors,
            touched,
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
                className="flex flex-col gap-4 py-8 items-start"
              >
                <div className="w-full pb-5">
                  <div className="formFields grid grid-cols-[1fr_1fr_200px] gap-5 w-full pb-3">
                    <div className="flex flex-col firstName gap-y-2">
                      <label htmlFor="firstName" className="font-gotham">
                        First Name*
                      </label>
                      <input
                        type="text"
                        className="border rounded p-3 focus:outline-none text-sm font-gotham font-light"
                        placeholder="Enter first name"
                        id="firstName"
                        name="firstName"
                        onChange={handleChange}
                        value={values.firstName}
                      />
                      {touched.firstName && errors.firstName && (
                        <div className="text-sm text-red-500 font-gotham font-light">
                          {errors.firstName}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col lastName gap-y-2">
                      <label htmlFor="lastName" className="font-gotham">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        className="border rounded p-3 focus:outline-none text-sm font-gotham font-light"
                        placeholder="Enter last name"
                        id="lastName"
                        name="lastName"
                        onChange={handleChange}
                        value={values.lastName}
                      />
                      {touched.lastName && errors.lastName && (
                        <div className="text-sm text-red-500 font-gotham font-light">
                          {errors.lastName}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gender gap-y-2 w-full h-full">
                      <label htmlFor="gender" className="font-gotham">
                        Gender*
                      </label>
                      <div className="flex items-center justify-center w-full h-full">
                        <span
                          className={`border w-full h-full flex items-center justify-center cursor-pointer font-gotham rounded rounded-r-none ${
                            genderSelected ? "bg-white" : "bg-blue-200"
                          }`}
                          onClick={() => {
                            setGenderSelected(!genderSelected);
                            handleGenderClick("male");
                          }}
                        >
                          M
                        </span>
                        <span
                          className={`border border-l-0 w-full h-full flex items-center justify-center cursor-pointer font-gotham rounded rounded-l-none ${
                            genderSelected ? "bg-blue-200" : "bg-white"
                          }`}
                          onClick={() => {
                            setGenderSelected(!genderSelected);
                            handleGenderClick("female");
                          }}
                        >
                          F
                        </span>
                      </div>
                      {touched.gender && errors.gender && (
                        <div className="text-sm text-red-500">
                          {errors.gender}
                        </div>
                      )}
                    </div>
                    {/* Lower fields */}
                    <div className="flex flex-col email gap-y-2">
                      <label htmlFor="email" className="font-gotham">
                        Email*
                      </label>
                      <input
                        type="text"
                        className="border rounded p-3 focus:outline-none text-sm font-gotham font-light"
                        placeholder="Enter your email"
                        id="email"
                        name="email"
                        onChange={handleChange}
                        value={values.email}
                      />
                      {touched.email && errors.email && (
                        <div className="text-sm text-red-500 font-gotham font-light">
                          {errors.email}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col phone gap-y-2 w-full h-full">
                      <label htmlFor="phone" className="font-gotham">
                        Phone*
                      </label>
                      <input
                        type="text"
                        className="border rounded p-3 focus:outline-none text-sm font-gotham font-light"
                        placeholder="Enter your phone"
                        id="phone"
                        name="phone"
                        onChange={handleChange}
                        value={values.phone}
                      />
                      {touched.phone && errors.phone && (
                        <div className="text-sm text-red-500 font-gotham font-light">
                          {errors.phone}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col country gap-y-2">
                      <label htmlFor="country" className="font-gotham">
                        Country*
                      </label>
                      <select
                        id="country"
                        className="border rounded p-3 focus:outline-none text-sm font-gotham font-light bg-white"
                        value={values.country}
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
                            name="country"
                            className="font-gotham font-light"
                          >
                            {coun.tpCC_COUNTRY}
                          </option>
                        ))}
                      </select>
                      {touched.country && errors.country && (
                        <div className="text-sm text-red-500 font-gotham font-light">
                          {errors.country}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col address gap-y-2">
                    <label htmlFor="address" className="font-gotham">
                      Address*
                    </label>
                    <input
                      type="text"
                      className="border rounded p-3 focus:outline-none text-sm font-gotham font-light"
                      placeholder="Enter your Address"
                      id="address"
                      name="address"
                      onChange={handleChange}
                      value={values.address}
                    />
                    {touched.address && errors.address && (
                      <div className="text-sm text-red-500 font-gotham font-light">
                        {errors.address}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="border px-4 py-2 bg-orange-500 cursor-pointer text-white font-gotham rounded-sm"
                >
                  Add Information
                </button>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default EmergencyContact;
