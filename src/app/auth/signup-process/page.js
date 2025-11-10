"use client";
import React, { useMemo, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
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

export default function SignUpPage() {
  const router = useRouter();
  const { data: AirportData } = useAirports("none");
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const { signInFn, setUsername: setUsernameContext, setUserId: setUserIdContext, setUserGroup: setUserGroupContext } = useSignInContext();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [roEmail, setRoEmail] = useState(false);
  const [roPass, setRoPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    email: "",
    title: "Mr",
    firstName: "",
    lastName: "",
    password: "",
    day: "",
    month: "",
    year: "",
    country: "",
    language: "ENG_UK",
    countryCode: "+92",
    mobile: "",
    invite: "",
    currency: "PKR",
  });
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const firstNameRef = React.useRef(null);
  const lastNameRef = React.useRef(null);
  const dayRef = React.useRef(null);
  const monthRef = React.useRef(null);
  const yearRef = React.useRef(null);
  const countryRef = React.useRef(null);
  const mobileRef = React.useRef(null);

  React.useEffect(() => {
    (async () => {
      try {
        const list = await getCurrency();
        setCurrencies(Array.isArray(list) ? list : []);
      } catch (e) {
        setCurrencies([]);
      }
    })();
  }, []);

  // Clear any prefilled values for security
  React.useEffect(() => {
    setForm({
      email: "",
      title: "Mr",
      firstName: "",
      lastName: "",
      password: "",
      day: "",
      month: "",
      year: "",
      country: "",
      language: "ENG_UK",
      countryCode: "+92",
      mobile: "",
      invite: "",
      currency: "PKR",
    });
  }, []);

  const countries = useMemo(() => {
    if (!Array.isArray(AirportData)) return [];
    const map = new Map();
    AirportData.forEach((a) => {
      const name = a.tpAIRPORT_COUNTRYNAME;
      if (name && !map.has(name)) map.set(name, name);
    });
    return Array.from(map.values());
  }, [AirportData]);

  const handleChange = (key) => (e) => {
    const val = e?.target ? e.target.value : e;
    setForm((s) => ({ ...s, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const SignUpSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email address")
      .required("Email is required")
      .when("country", {
        is: (val) => val === "Pakistan",
        then: (s) => s.matches(/^[^\s@]+@gmail\.com$/i, "For Pakistan, please use a gmail.com address"),
      }),
    title: Yup.string().required("Required"),
    firstName: Yup.string()
      .matches(/^[A-Za-z][A-Za-z'\-\s]{1,49}$/u, "Only letters, spaces, - and ' allowed")
      .required("First name is required"),
    lastName: Yup.string()
      .matches(/^[A-Za-z][A-Za-z'\-\s]{1,49}$/u, "Only letters, spaces, - and ' allowed")
      .required("Last name is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Za-z]/, "Include a letter")
      .matches(/[0-9]/, "Include a number")
      .matches(/[^A-Za-z0-9]/, "Include a special character")
      .required("Password is required"),
    day: Yup.number().typeError("Enter a valid day").min(1).max(31).required("Required"),
    month: Yup.number().typeError("Enter a valid month").min(1).max(12).required("Required"),
    year: Yup.number()
      .typeError("Enter a valid year")
      .min(1900)
      .max(new Date().getFullYear())
      .required("Required"),
    country: Yup.string().required("Country is required"),
    language: Yup.string().required("Required"),
    currency: Yup.string().required("Required"),
    countryCode: Yup.string(),
    mobile: Yup.string().matches(/^[0-9+()\-\s]{0,20}$/u, "Enter a valid mobile number"),
    invite: Yup.string(),
  });

  const handleFormikSubmit = async (values, { setSubmitting }) => {
    // Prevent multiple submissions
    if (loading || signupSuccess) {
      setSubmitting(false);
      return;
    }

    setLoading(true);
    setSubmitting(true);
    
    try {
      const payload = {
        FirstName: values.firstName,
        LastName: values.lastName,
        AgentCountry: values.country,
        Currency: values.currency,
        Email: String(values.email || "").trim(),
        Password: String(values.password || "").trim(),
        UserName: `${values.firstName}${values.lastName}`.trim() || values.email,
        UserType: "CONSUMER",
        title: values.title,
        day: values.day,
        month: values.month,
        year: values.year,
        language: values.language,
        countryCode: values.countryCode,
        mobile: values.mobile,
        invite: values.invite
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
          countryCode: values.countryCode,
          mobile: values.mobile,
          currency: values.currency,
          language: values.language,
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
            initialValues={{
              email: "",
              title: "Mr",
              firstName: "",
              lastName: "",
              password: "",
              day: "",
              month: "",
              year: "",
              country: "",
              language: "ENG_UK",
              countryCode: "+92",
              mobile: "",
              invite: "",
              currency: "PKR",
            }}
            validationSchema={SignUpSchema}
            validateOnChange
            validateOnBlur
            onSubmit={handleFormikSubmit}
          >
            {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
              <Form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4" autoComplete="off">
                <div className="md:col-span-3">
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Email <span className="text-red-600">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="off"
                    readOnly={false}
                    ref={emailRef}
                    className="w-full border border-slate-300 rounded px-3 py-2"
                  />
                  <ErrorMessage name="email" component="p" className="text-red-600 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Title</label>
                  <select name="title" value={values.title} onChange={handleChange} onBlur={handleBlur} className="w-full border border-slate-300 rounded px-3 py-2">
                    {['Mr','Mrs','Ms','Dr'].map((t)=> <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-gotham text-blue-900 mb-1">First name <span className="text-red-600">*</span></label>
                  <input ref={firstNameRef} name="firstName" value={values.firstName} onChange={handleChange} onBlur={handleBlur} required className="w-full border border-slate-300 rounded px-3 py-2" />
                  <ErrorMessage name="firstName" component="p" className="text-red-600 text-xs mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Last name <span className="text-red-600">*</span></label>
                  <input ref={lastNameRef} name="lastName" value={values.lastName} onChange={handleChange} onBlur={handleBlur} required className="w-full border border-slate-300 rounded px-3 py-2" />
                  <ErrorMessage name="lastName" component="p" className="text-red-600 text-xs mt-1" />
                </div>

                <div className="md:col-span-3">
                  <p className="text-xs text-slate-500">Your name must be entered in English as it appears on your passport.</p>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Password <span className="text-red-600">*</span></label>
                  <div className="flex items-center border border-slate-300 rounded pr-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      autoComplete="new-password"
                      readOnly={false}
                      ref={passwordRef}
                      className="w-full rounded px-3 py-2 outline-none border-0"
                    />
                    {showPassword ? (
                      <IoEyeOffOutline className="cursor-pointer text-base" onClick={() => setShowPassword(false)} />
                    ) : (
                      <IoEyeOutline className="cursor-pointer text-base" onClick={() => setShowPassword(true)} />
                    )}
                  </div>
                  <ErrorMessage name="password" component="p" className="text-red-600 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Day <span className="text-red-600">*</span></label>
                  <input ref={dayRef} name="day" type="number" min="1" max="31" value={values.day} onChange={handleChange} onBlur={handleBlur} className="w-full border border-slate-300 rounded px-3 py-2" />
                  <ErrorMessage name="day" component="p" className="text-red-600 text-xs mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Month <span className="text-red-600">*</span></label>
                  <input ref={monthRef} name="month" type="number" min="1" max="12" value={values.month} onChange={handleChange} onBlur={handleBlur} className="w-full border border-slate-300 rounded px-3 py-2" />
                  <ErrorMessage name="month" component="p" className="text-red-600 text-xs mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Year <span className="text-red-600">*</span></label>
                  <input ref={yearRef} name="year" type="number" min="1900" max="2100" value={values.year} onChange={handleChange} onBlur={handleBlur} className="w-full border border-slate-300 rounded px-3 py-2" />
                  <ErrorMessage name="year" component="p" className="text-red-600 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Country/territory of residence <span className="text-red-600">*</span></label>
                  <select name="country" value={values.country} onChange={(e)=>{handleChange(e);}} onBlur={handleBlur} required className="w-full border border-slate-300 rounded px-3 py-2" ref={countryRef}>
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ErrorMessage name="country" component="p" className="text-red-600 text-xs mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Preferred Language</label>
                  <select name="language" value={values.language} onChange={handleChange} onBlur={handleBlur} className="w-full border border-slate-300 rounded px-3 py-2">
                    <option value="ENG_UK">English (UK)</option>
                    <option value="ENG_US">English (US)</option>
                    <option value="ENG_PK">English (PK)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Currency <span className="text-red-600">*</span></label>
                  <select name="currency" value={values.currency} onChange={handleChange} onBlur={handleBlur} required className="w-full border border-slate-300 rounded px-3 py-2">
                    {currencies.map((cur) => (
                      <option key={cur.tpCUR_CODE} value={cur.tpCUR_CODE}>
                        {cur.tpCUR_SYMBOL || cur.tpCUR_CODE} - {cur.tpCUR_DESCRIPTION || cur.tpCUR_CODE}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Country code</label>
                  <input name="countryCode" value={values.countryCode} onChange={handleChange} onBlur={handleBlur} className="w-full border border-slate-300 rounded px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Mobile number</label>
                  <input ref={mobileRef} name="mobile" value={values.mobile} onChange={handleChange} onBlur={handleBlur} className="w-full border border-slate-300 rounded px-3 py-2" />
                  <ErrorMessage name="mobile" component="p" className="text-red-600 text-xs mt-1" />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-gotham text-blue-900 mb-1">Invite code (optional)</label>
                  <input name="invite" value={values.invite} onChange={handleChange} onBlur={handleBlur} className="w-full border border-slate-300 rounded px-3 py-2" />
                </div>

                <div className="md:col-span-3 mt-2 flex flex-col gap-2">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" />
                    Sign up to receive CherryFlight newsletters and special offers.
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" />
                    I agree to the CherryFlight programme rules and privacy policy.
                  </label>
                </div>

                <div className="md:col-span-3 mt-4 space-y-3">
                  <button 
                    type="submit" 
                    disabled={loading || signupSuccess || isSubmitting} 
                    className={`w-full bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 font-gotham transition-colors duration-200 ${
                      loading || signupSuccess || isSubmitting 
                        ? "opacity-70 cursor-not-allowed" 
                        : "hover:bg-orange-600"
                    }`}
                  >
                    {loading ? "Creating account..." : signupSuccess ? "Account created!" : "Create an account"}
                  </button>
                  <button type="button" onClick={() => router.push("/auth/signin")} className="w-full text-blue-900 hover:text-blue-700 underline font-gotham text-sm">
                    Back to login
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Footer showPaymentImages={true} />
    </div>
  );
}

