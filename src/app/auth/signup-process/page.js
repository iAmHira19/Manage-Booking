"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Header from "@/app/component/(FirstPageComponents)/Header/Header";
import Footer from "@/app/component/(FirstPageComponents)/Footer/Footer";
import toast, { Toaster } from "react-hot-toast";
import getUserSignUp from "@/services/signup";
import useAirports from "@/hooks/useAirports";
import { getCurrency } from "@/utils/getCurrency";
import { useRouter } from "next/navigation";
import { useSignInContext } from "@/providers/SignInStateProvider";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export default function SignUpPage() {
  const router = useRouter();
  const { data: AirportData } = useAirports("none");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signInFn } = useSignInContext();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({
    email: "",
    title: "Mr",
    firstName: "",
    lastName: "",
    password: "",
    dateOfBirth: null,
    country: "",
  });
  
  const disabledDate = (current) => {
    if (!current) return false;
    const today = dayjs().endOf('day');
    const minDate = dayjs().subtract(100, 'year').startOf('day');
    const maxDate = dayjs().subtract(18, 'year').endOf('day');
    
    // Disable dates in the future or before 100 years ago
    return current > today || current < minDate;
  };

  // Fetch and sort countries
  useEffect(() => {
    if (AirportData && Array.isArray(AirportData)) {
      const countrySet = new Set();
      AirportData.forEach((airport) => {
        if (airport.tpAIRPORT_COUNTRYNAME) {
          countrySet.add(airport.tpAIRPORT_COUNTRYNAME);
        }
      });
      
      const sortedCountries = Array.from(countrySet).sort((a, b) => 
        a.localeCompare(b)
      );
      
      setCountries(sortedCountries);
    }
  }, [AirportData]);

  const handleChange = (key) => (e) => {
    const val = e?.target ? e.target.value : e;
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  // Date change handler is now handled directly in the Field component

  const SignUpSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email address")
      .required("Email is required")
      .when("country", {
        is: (val) => val === "Pakistan",
        then: (s) => s.matches(/^[^\s@]+@gmail\.com$/i, "For Pakistan, please use a gmail.com address"),
      }),
    title: Yup.string().required("Title is required"),
    firstName: Yup.string()
      .matches(/^[A-Za-z][A-Za-z'\-\s]{1,49}$/u, "Only letters, spaces, - and ' allowed")
      .required("First name is required"),
    lastName: Yup.string()
      .matches(/^[A-Za-z][A-Za-z'\-\s]{1,49}$/u, "Only letters, spaces, - and ' allowed")
      .required("Last name is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Za-z]/, "Must include at least one letter")
      .matches(/[0-9]/, "Must include at least one number")
      .matches(/[^A-Za-z0-9]/, "Must include at least one special character")
      .required("Password is required"),
    dateOfBirth: Yup.date()
      .nullable()
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future")
      .test("age", "You must be at least 18 years old", (value) => {
        if (!value) return false;
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 >= 18;
        }
        return age >= 18;
      }),
    country: Yup.string().required("Country is required"),
  });

  const handleFormikSubmit = async (values, { setSubmitting, setFieldError }) => {
    // Prevent multiple submissions
    if (loading || signupSuccess) {
      setSubmitting(false);
      return;
    }

    setLoading(true);
    setSubmitting(true);
    
    try {
      // Format date of birth
      let formattedDob = '';
      if (values.dateOfBirth) {
        const date = new Date(values.dateOfBirth);
        formattedDob = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }

      const payload = {
        FirstName: values.firstName.trim(),
        LastName: values.lastName.trim(),
        AgentCountry: values.country,
        Email: String(values.email).trim().toLowerCase(),
        Password: String(values.password).trim(),
        UserName: `${values.firstName}${values.lastName}`.trim().toLowerCase() || values.email,
        UserType: "CONSUMER",
        title: values.title,
        dateOfBirth: formattedDob,
        language: "ENG_UK",
        currency: "USD"
      };
      
      const res = await getUserSignUp(payload);
      const ok = !!res && (res.success === true || res.status === 200 || res.code === 200 || res.message === "Success" || Object.keys(res || {}).length > 0);
      
      if (ok) {
        setSignupSuccess(true);
        
        // Prepare user data to store in session
        const userData = {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          title: values.title,
          country: values.country,
          isAuthenticated: true
        };
        
        // Store user data in session storage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('user', JSON.stringify(userData));
          sessionStorage.setItem('signIn', 'true');
        }
        
        toast.success("Account created successfully. Logging you in...");
        
        // Auto-login the user after successful signup
        try {
          await signInFn(values.email, values.password);
          router.push('/my-account');
        } catch (loginErr) {
          console.error('Auto-login failed:', loginErr);
          // Even if auto-login fails, the account was created successfully
          toast.success("Account created successfully! Please log in.");
          router.push('/auth/signin');
        }
      } else {
        const errorMsg = res?.message || "Sign up failed, please try again";
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (!err.message.includes("Sign up failed")) {
        toast.error(err?.message || "An error occurred during signup");
      }
      setSignupSuccess(false);
      throw err; // Re-throw to let Formik know the submission failed
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Toaster />
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 w-full flex-1">
        <h1 className="text-3xl md:text-4xl font-gotham text-blue-900 text-center mb-2">Join CherryFlight</h1>
        <p className="text-center text-slate-600 font-gotham mb-8">
          Open up a world of rewards every time you travel. Enjoy deals, faster checkout, and more.
        </p>
        <div className="bg-white rounded border border-slate-200 shadow-sm p-4 md:p-8">
          {signupSuccess && (
            <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-800 text-sm font-gotham">
              Your account has been created. Please log in to continue.
            </div>
          )}
          <Formik
            initialValues={form}
            validationSchema={SignUpSchema}
            onSubmit={handleFormikSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      id="title"
                      name="title"
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-2 border ${
                        errors.title && touched.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Title</option>
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                    </Field>
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id="firstName"
                      name="firstName"
                      type="text"
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-2 border ${
                        errors.firstName && touched.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your first name"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id="lastName"
                      name="lastName"
                      type="text"
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-2 border ${
                        errors.lastName && touched.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <Field name="dateOfBirth">
                      {({ field, form }) => {
                        const handleDateChange = (date) => {
                          form.setFieldValue('dateOfBirth', date ? date.format('YYYY-MM-DD') : '');
                        };
                        
                        return (
                          <DatePicker
                            className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Select date of birth"
                            format="DD/MM/YYYY"
                            disabledDate={disabledDate}
                            onChange={handleDateChange}
                            value={field.value ? dayjs(field.value) : null}
                            suffixIcon={
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-400"
                              >
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                            }
                            allowClear={false}
                            style={{ width: '100%' }}
                          />
                        );
                      }}
                    </Field>
                    <ErrorMessage
                      name="dateOfBirth"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      id="country"
                      name="country"
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-2 border ${
                        errors.country && touched.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`block w-full rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-2 border pr-10 ${
                          errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        tabIndex="-1"
                      >
                        {showPassword ? (
                          <IoEyeOffOutline className="h-5 w-5" />
                        ) : (
                          <IoEyeOutline className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters long and include:
                      <ul className="list-disc pl-5 mt-1">
                        <li>At least one letter</li>
                        <li>At least one number</li>
                        <li>At least one special character</li>
                      </ul>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || loading}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isSubmitting || loading
                          ? "bg-orange-400"
                          : "bg-orange-600 hover:bg-orange-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200`}
                    >
                      {isSubmitting || loading ? "Creating Account..." : "Create Account"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/auth/signin")}
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Sign in
                </button>
              </p>
            </div>
            <div className="mt-4 text-center">
              <button type="button" onClick={() => router.push("/auth/signin")} className="w-full text-blue-900 hover:text-blue-700 underline font-gotham text-sm">
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer showPaymentImages={true} />
    </>
  );
}
