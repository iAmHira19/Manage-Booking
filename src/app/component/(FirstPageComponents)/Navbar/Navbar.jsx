"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Third Party Imports
import { Modal, Button, Select } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";

// Api Imports
import { getCurrency } from "@/utils/getCurrency";
import useAuthenticateUser from "@/hooks/useAuthenticateUser";
// import { useAuth enticateUser } from "@/utils/authenticateUser";
import useAirports from "@/hooks/useAirports";
import getUserSignUp from "@/services/signup";

// Providers Imports
import { useSignInContext } from "@/providers/SignInStateProvider";
import { cleanupUsername } from "@/utils/cleanupUsername";

// Icon Imports
import { MdArrowDropDown } from "react-icons/md";
import { FaPhoneAlt, FaSignInAlt } from "react-icons/fa";
import { GrUserNew } from "react-icons/gr";
import { FaFacebookF, FaGoogle } from "react-icons/fa6";
import { IoEyeOffOutline, IoEyeOutline, IoLogoWhatsapp } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = ({ isMobile }) => {
  const router = useRouter();
  let { data: session } = useSession();
  const { data: AirportData } = useAirports("none");
  const { getAuthenticationResponse } = useAuthenticateUser();
  const {
    signInFn: signInContext,
    signOutFn: signOutContext,
    clearAllStorage,
    username: usernameContext,
    setUsername: setUsernameContext,
    setUserId: setUserIdContext,
    userGroup: userGroupContext,
    setUserGroup: setUserGroupContext,
    isSignedIn,
    setIsSignedIn,
    setSearchCurrencyCode: setSearchCurrencyCodeContext,
    searchCurrencyCode: searchCurrencyCodeContext,
    handleCurrencyChangeFn: handleCurrencyChangeContext,
    isModalVisible,
    setIsModalVisible,
    modalType,
    setModalType,
  } = useSignInContext();

  // State Variables
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [modalType, setModalType] = useState("");
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [searchedCurrency, setSearchedCurrency] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [checkSessionStorage, setCheckSessionStorage] = useState(true);
  const [currencyExchange, setCurrencyExchange] = useState([]);
  const [filteredCurrencyExchange, setFilteredCurrencyExchange] = useState([]);
  const [countries, setCountries] = useState([]);
  const dropdownRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  let googleWasUsed = false;
  // useEffects
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Derive a clean display name using centralized cleanup
  const displayUsername = React.useMemo(() => {
    return cleanupUsername(usernameContext || "");
  }, [usernameContext]);

  // Ensure currency list is available when opening the modal
  const ensureCurrenciesLoaded = async () => {
    try {
      if (!currencyExchange || currencyExchange.length === 0) {
        const list = await getCurrency();
        // normalize result to array
        const arr = Array.isArray(list) ? list : [];
        if (arr.length === 0) {
          console.debug("ensureCurrenciesLoaded: no currencies returned", list);
        }
        setCurrencyExchange(arr);
        setFilteredCurrencyExchange(arr);
      }
    } catch (e) {
      console.error("Failed to load currencies:", e);
      // Keep modal usable even if fetch fails
      setCurrencyExchange([]);
      setFilteredCurrencyExchange([]);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        let currency = await getCurrency();
        let countries = AirportData;
        setCountries(countries);
        const arr = Array.isArray(currency) ? currency : [];
        if (arr.length === 0) console.debug("Navbar initial currency fetch returned:", currency);
        setCurrencyExchange(arr);
        setFilteredCurrencyExchange(arr);
      } catch (err) {
        console.error("Navbar currency initial fetch failed:", err);
        setCurrencyExchange([]);
        setFilteredCurrencyExchange([]);
      }
    };
    fetchData();
  }, [AirportData]);
  useEffect(() => {
    if (checkSessionStorage) {
      const IssignedInLoc = sessionStorage.getItem("signIn") === "true";
      setCheckSessionStorage(false);
      setIsSignedIn(IssignedInLoc);
      if (IssignedInLoc) {
        // Get the username from sessionStorage and ensure it's cleaned immediately
        const storedUsername = sessionStorage.getItem("username");
        const cleanedStored = cleanupUsername(storedUsername || "");
        // Persist cleaned value back to storage to avoid stale duplicates
        sessionStorage.setItem("username", cleanedStored);
        setUsernameContext(cleanedStored);
        setUserIdContext(sessionStorage.getItem("userId"));
        setUserGroupContext(sessionStorage.getItem("userGroup"));
      }
    }
  }, [checkSessionStorage, setCheckSessionStorage, setIsSignedIn, setUsernameContext, setUserIdContext, setUserGroupContext]);
  useEffect(() => {
    if (session && session.user?.name && session.user?.usr_Group) {
      const originalName = session.user.name;
      const cleaned = cleanupUsername(originalName);
      setUsernameContext(cleaned);
      sessionStorage.setItem("username", cleaned);
      setUserIdContext(session?.user?.user_ID || "Public");
      sessionStorage.setItem("userId", session?.user?.user_ID || "Public");
      setUserGroupContext(session?.user?.usr_Group || null);
      sessionStorage.setItem("userGroup", session?.user?.usr_Group || null);
      setIsSignedIn(true);
      signInContext();
    }
  }, [session, setUsernameContext, setUserIdContext, setUserGroupContext, setIsSignedIn, signInContext]);

  // Formiks
  const signInFormik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: (values) => {
      if (values.email !== "" && values.password !== "") {
        const fetchData = async (email, password) => {
          try {
            const user = await getAuthenticationResponse(email, password);
            if (!user) {
              toast.error("Something went wrong, Please try again later");
              return;
            } else if (user.length === 0) {
              toast.error("Invalid credentials");
              return;
            }
            // Set the username - use original name if available, otherwise clean the database name
            const originalName = user?.[0]?.user_Name || "";
            // For regular sign-in, we need to clean the database name since it might be corrupted
            const cleanedUsername = cleanupUsername(originalName);
            setUsernameContext(cleanedUsername);
            sessionStorage.setItem("username", cleanedUsername);
            setUserIdContext(user?.[0]?.user_ID);
            sessionStorage.setItem("userId", user?.[0]?.user_ID);
            setUserGroupContext(user?.[0]?.usr_Group);
            sessionStorage.setItem("userGroup", user?.[0]?.usr_Group);
            setCheckSessionStorage(true);
            signInContext();
            toast.success("Access granted");
            handleCancel();
          } catch (error) {
            console.log("error is: ", error);
            console.error("Error fetching user:", error.message);
          }
        };
        fetchData(values.email, values.password);
      } else alert("Something went wrong. Please try again");
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
  });
  const signUpFormik = useFormik({
    initialValues: {
      FirstName: "",
      LastName: "",
      AgentCountry: "",
      Currency: "",
      Email: "",
      Password: "",
      UserName: "",
      UserType: "CONSUMER",
    },
    onSubmit: (values) => {
      if (
        values.Email &&
        values.Password &&
        values.FirstName &&
        values.LastName &&
        values.AgentCountry &&
        values.Currency
      ) {
        const fetchData = async (signUpData) => {
          try {
            const user = await getUserSignUp(signUpData);
            if (user) {
              toast.success("User registered Successfully");
            } else if (!!user) {
              toast.error("Sign Up Failed", user);
              return;
            }
            handleCancel();
          } catch (error) {
            console.error("Error sign up:", error.message);
          }
        };
        fetchData(values);
      } else alert("Something went wrong. Please try again");
    },
    validationSchema: yup.object({
      FirstName: yup.string().required("First name is required"),
      LastName: yup.string().required("Last name is required"),
      Email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      Password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
  });

  // Other functions
  const showModal = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    signInFormik.resetForm();
    signUpFormik.resetForm();
    setIsModalVisible(false);
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    await signInFormik.validateForm();
    if (Object.keys(signInFormik.errors).length === 0) {
      signInFormik.handleSubmit();
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    await signUpFormik.validateForm();
    if (Object.keys(signUpFormik.errors).length === 0) {
      signUpFormik.handleSubmit();
    }
  };
  const handleLogout = () => {
    if (googleWasUsed) {
      signOut();
      googleWasUsed = false;
    }
    signOutContext();
    setCheckSessionStorage(true);
    setUsernameContext("");
    setUserIdContext("Public");
    setUserGroupContext(null);
    sessionStorage.setItem("username", "");
    sessionStorage.setItem("userId", "Public");
    sessionStorage.setItem("userGroup", null);
  };
  const getUniqueCountries = (airportsData) => {
    if (!Array.isArray(airportsData)) return [];
    const uniqueCountries = new Map();

    airportsData.forEach((airport) => {
      const countryName = airport.tpAIRPORT_COUNTRYNAME;
      if (!uniqueCountries.has(countryName)) {
        uniqueCountries.set(countryName, {
          value: countryName,
          label: countryName,
        });
      }
    });
    return Array.from(uniqueCountries.values());
  };
  const handleToggle = (key, e) => {
    e.preventDefault();
    setOpenDropdown((prev) => (prev === key ? null : key));
  };



  return (
    <>
      <Toaster />
      <ul
        className={`list-none ${
          isMobile ? "flex flex-col gap-4" : "flex gap-8"
        } font-gotham`}
      >
        <li >
          <Link
            href={isSignedIn ? "/manage-booking" : "/manage_booking"}
            className="text-blue-900 text-base font-gotham uppercase"
          >
            Manage Booking
          </Link>
        </li>
        <li className="hidden">
          <Link
            href="/"
            className="text-blue-900 text-base font-gotham uppercase"
          >
            ENG
          </Link>
        </li>
        <li
          className="text-blue-900 text-base font-gotham uppercase cursor-pointer"
          onClick={() => {
            ensureCurrenciesLoaded().finally(() => setShowCurrencyModal(true));
          }}
        >
          {/* Show Currency (ISO) in the navbar regardless of underlying storage code */}
          {(() => {
            // Attempt to find the selected currency by code OR symbol to handle numeric codes
            const scel = String(searchCurrencyCodeContext || "").trim();
            const lower = scel.toLowerCase();
            const found = (currencyExchange || []).find((c) => {
              const code = String(c?.tpCUR_CODE || "").toLowerCase();
              const symbol = String(c?.tpCUR_SYMBOL || "").toLowerCase();
              return code === lower || symbol === lower;
            });

            // Derive a 3-letter ISO-like display code
            const isIso = (val) => /^[A-Za-z]{3}$/.test(String(val || ""));
            let display = "";
            if (found) {
              if (isIso(found.tpCUR_SYMBOL)) display = String(found.tpCUR_SYMBOL).toUpperCase();
              else if (isIso(found.tpCUR_CODE)) display = String(found.tpCUR_CODE).toUpperCase();
              else if (found.tpCUR_DESCRIPTION) {
                // Try to extract '(XYZ)' from description
                const m = String(found.tpCUR_DESCRIPTION).match(/\(([A-Za-z]{3})\)/);
                if (m && isIso(m[1])) display = m[1].toUpperCase();
              }
            }
            if (!display && isIso(scel)) display = scel.toUpperCase();
            if (!display) display = "PKR"; // final fallback
            return `Currency (${display})`;
          })()}
        </li>
        <li className="hidden">
          <Link
            href="/"
            className="text-blue-900 text-base font-gotham uppercase"
          >
            Welcoming Suggestion
          </Link>
        </li>
        <li className="relative group" ref={dropdownRef}>
          <Link
            href="/customer-support"
            // onClick={(e) => handleToggle("support", e)}
            className="text-blue-900 text-base flex items-center font-gotham uppercase"
          >
            Support
            {/* <MdArrowDropDown /> */}
          </Link>
          {/* <ul
            className={`absolute bg-blue-900 gap-2 py-2 rounded top-8 -left-auto lg:-left-8 min-w-52 items-center ${
              openDropdown && openDropdown === "support"
                ? "opacity-100 visible flex"
                : "opacity-0 invisible"
            } justify-center flex-col shadow-md transition-all duration-300 z-50`}
          >
            <li className="w-full text-center block hover:bg-orange-500  py-2 px-1">
              <Link
                href="/contact_us"
                className="text-base text-white font-gotham"
              >
                Customer Support
              </Link>
            </li>
          </ul> */}
        </li>
        <li
          className={`relative group ${isSignedIn ? "hidden" : "inline-block"}`}
          ref={dropdownRef}
        >
          <Link
            href="#"
            onClick={(e) => handleToggle("Account", e)}
            className="text-blue-900 text-base flex items-center font-gotham uppercase"
          >
            Account <MdArrowDropDown />
          </Link>
          <ul
            className={`absolute bg-blue-900 gap-2 py-2 rounded top-8 -left-auto lg:-left-8 min-w-40 items-center ${
              openDropdown === "Account"
                ? "opacity-100 visible flex"
                : "opacity-0 invisible"
            } justify-center flex-col shadow-md transition-all duration-300`}
          >
            <li
              className="w-full text-center block hover:bg-orange-500"
              onClick={() => showModal("Sign In")}
            >
              <span className="text-base font-gotham flex items-center justify-center cursor-pointer text-white px-1 py-2 uppercase">
                <FaSignInAlt />{" "}
                <span className="pl-2 font-gotham">Sign In</span>
              </span>
            </li>
            <li
              className="w-full text-center block hover:bg-orange-500 uppercase"
              onClick={() => showModal("Sign Up")}
            >
              <span className="text-base font-gotham flex items-center justify-center cursor-pointer text-white px-1 py-2">
                <GrUserNew /> <span className="pl-2 font-gotham">Sign Up</span>
              </span>
            </li>
          </ul>
        </li>
        <li
          className={`relative group ${isSignedIn ? "inline-block" : "hidden"}`}
          ref={dropdownRef}
        >
          <Link
            href="#"
            onClick={(e) => handleToggle("Username", e)}
            className="text-blue-900 text-base flex items-center font-gotham uppercase"
          >
            {displayUsername} <MdArrowDropDown />
          </Link>
          <ul
            className={`absolute bg-blue-900 gap-2 py-2 rounded top-8 left-auto lg:-left-5 min-w-48 items-center ${
              openDropdown === "Username"
                ? "opacity-100 visible flex"
                : "opacity-0 invisible"
            } justify-center flex-col shadow-md transition-all duration-300 z-50 uppercase`}
          >
            <li
              className="w-full text-center block hover:bg-orange-500 px-1 py-2"
              onClick={() => router.push("/my-account")}
            >
              <span className="text-sm font-gotham flex items-center justify-center cursor-pointer text-white">
                <span className="pl-2 font-gotham font-bold uppercase">
                  My Account
                </span>
              </span>
            </li>
            <li
              className="w-full text-center block hover:bg-orange-500 px-1 py-2"
              onClick={handleLogout}
            >
              <span className="text-sm font-gotham flex items-center justify-center cursor-pointer text-white">
                <span className="pl-2 font-gotham font-bold uppercase">
                  Logout
                </span>
              </span>
            </li>
            <li
              className="w-full text-center block hover:bg-red-500 px-1 py-2"
              onClick={() => {
                // Clear username specifically and force refresh
                sessionStorage.removeItem("username");
                setUsernameContext("");
                clearAllStorage();
                toast.success("Username cleared! Please refresh the page to see the fix.");
                // Force page refresh after a short delay
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }}
            >
              <span className="text-xs font-gotham flex items-center justify-center cursor-pointer text-white">
                <span className="pl-2 font-gotham font-bold">
                  Fix Username
                </span>
              </span>
            </li>
          </ul>
        </li>
        <li
          className={`relative group ${
            isSignedIn
              ? userGroupContext === "OWNER"
                ? "inline-block"
                : "hidden"
              : "hidden"
          }`}
          ref={dropdownRef}
        >
          <Link
            href="#"
            onClick={(e) => handleToggle("Setups", e)}
            className="text-blue-900 text-base flex items-center font-gotham uppercase"
          >
            Setups <MdArrowDropDown />
          </Link>
          <ul
            className={`absolute bg-blue-900 gap-2 py-2 rounded top-8 left-auto lg:-left-14 min-w-56 items-center ${
              openDropdown === "Setups"
                ? "opacity-100 visible flex"
                : "opacity-0 invisible"
            } justify-center flex-col shadow-md transition-all duration-300 z-50`}
          >
            <li className="w-full text-center block hover:bg-orange-500 px-1 py-2">
              <span className="text-sm font-gotham flex items-center justify-center cursor-pointer text-white">
                <span className="pl-2 font-gotham font-bold">
                  <Link href="/PriceCalculation" className="uppercase">
                    {" "}
                    Price Calculation Setup
                  </Link>
                </span>
              </span>
            </li>
            <li className="w-full text-center block hover:bg-orange-500 px-1 py-2">
              <span className="text-sm font-gotham flex items-center justify-center cursor-pointer text-white">
                <span className="pl-2 font-gotham font-bold">
                  <Link href="/currencyExchange" className="uppercase">
                    Currency Setup
                  </Link>
                </span>
              </span>
            </li>
            <li className="w-full text-center block hover:bg-orange-500 px-1 py-2">
              <span className="text-sm font-gotham flex items-center justify-center cursor-pointer text-white">
                <span className="pl-2 font-gotham font-bold">
                  <Link href="/prioritySetup" className="uppercase">
                    Priority Setup
                  </Link>
                </span>
              </span>
            </li>
            <li className="w-full text-center block hover:bg-orange-500 px-1 py-2">
              <span className="text-sm font-gotham flex items-center justify-center cursor-pointer text-white">
                <span className="pl-2 font-gotham font-bold">
                  <Link href="/ApiSupplier" className="uppercase">
                    API Supplier Setup
                  </Link>
                </span>
              </span>
            </li>
            <li className="w-full text-center block hover:bg-orange-500 px-1 py-2">
              <span className="text-sm font-gotham flex items-center justify-center cursor-pointer text-white">
                <span className="pl-2 font-gotham font-bold">
                  <Link href="/customerSetup" className="uppercase">
                    Customer Setup
                  </Link>
                </span>
              </span>
            </li>
            <li className="w-full text-center hidden hover:bg-orange-500 px-1 py-2">
              <span className="text-sm font-gotham flex items-center justify-center cursor-pointer text-white">
                <span className="pl-2 font-gotham font-bold">
                  <Link href="/StockSetup" className="uppercase">
                    Stock Setup
                  </Link>
                </span>
              </span>
            </li>
            <li className="w-full text-center block hover:bg-orange-500 px-1 py-2">
              <span className="text-sm font-gotham flex items-center justify-center cursor-pointer text-white">
                <span className="pl-2 font-gotham font-bold">
                  <Link href="/AirlineSetup" className="uppercase">
                    Airline Setup
                  </Link>
                </span>
              </span>
            </li>
            <li className="w-full text-center block hover:bg-orange-500 px-1 py-2">
              <span className="text-sm font-gotham flex items-center justify-center cursor-pointer text-white">
                <span className="pl-2 font-gotham font-bold">
                  <Link href="/AirportSetup" className="uppercase">
                    Airport Setup
                  </Link>
                </span>
              </span>
            </li>
          </ul>
        </li>
        <li>
          <Link
            href="#"
            onClick={(e) => handleToggle("Helpline", e)}
            className="text-blue-900 text-base flex items-center font-gotham uppercase"
          >
            Helpline <MdArrowDropDown />
          </Link>
          <ul
            className={`absolute bg-blue-900 gap-2 py-2 rounded top-16  lg:right-1 min-w-48 items-center ${
              openDropdown === "Helpline"
                ? "opacity-100 visible flex"
                : "opacity-0 invisible"
            } justify-center flex-col shadow-md transition-all duration-300`}
          >
            <li className="w-full text-center block hover:bg-orange-500">
              <span className="text-base font-gotham flex items-center justify-center cursor-pointer text-white px-1 py-2 gap-x-2">
                <FaPhoneAlt className="text-sm" />{" "}
                <span className="pl-2 font-gotham">+9243-23232323</span>
              </span>
            </li>
            <li className="w-full text-center block hover:bg-orange-500">
              <span className="text-base font-gotham flex items-center justify-center cursor-pointer text-white px-1 py-2 gap-x-2">
                <FaPhoneAlt className="text-sm" />
                <span className="pl-2 font-gotham">+9241-97980923</span>
              </span>
            </li>
            <li className="w-full text-center block hover:bg-orange-500">
              <span className="text-base font-gotham flex items-center justify-center cursor-pointer text-white px-1 py-2 gap-x-2">
                <FaPhoneAlt className="text-sm" />
                <span className="pl-2 font-gotham">+9242-53209873</span>
              </span>
            </li>
            <li className="w-full text-center block hover:bg-orange-500">
              <span className="text-base font-gotham flex items-center justify-center cursor-pointer text-white px-1 py-2">
                <IoLogoWhatsapp className="text-xl" />
                <span className="pl-2 font-gotham">+923008408068 </span>
              </span>
            </li>
          </ul>
        </li>
      </ul>

      {/* =================================================== Modals ====================================================== */}

      {/* Auth */}
      <Modal
        title={
          <h2 className="text-center w-full text-lg text-blue-900 font-gotham">
            {modalType} with
          </h2>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {modalType === "Sign In" && (
          <div className="!my-6">
            <div className="btns w-full flex items-center justify-center gap-2">
              {/* <button
                className="px-6 py-3 font-gotham bg-[#3b5998] text-white rounded-lg shadow-lg hover:bg-[#2d4373] transition-all flex items-center justify-center gap-1"
                onClick={async () => {
                  await signIn("facebook", { callbackUrl: "/" });
                }}
              >
                <FaFacebookF /> <span>Facebook</span>
              </button> */}
              <button
                className="px-6 py-3 font-gotham rounded-lg shadow-lg bg-white hover:bg-gray-100 transition-all flex items-center justify-center gap-1 text-orange-400"
                onClick={async () => {
                  googleWasUsed = true;
                  await signIn("google", { callbackUrl: "/" });
                }}
              >
                <FaGoogle /> <span>Google</span>
              </button>
            </div>
            <div>
              <form
                action="/"
                method="post"
                className="mt-7 flex flex-col gap-1"
                onSubmit={handleSignIn}
              >
                <div>
                  <input
                    type="email"
                    name="email"
                    autoComplete="off"
                    onChange={signInFormik.handleChange}
                    value={signInFormik.values.email}
                    onBlur={signInFormik.handleBlur}
                    placeholder="Email"
                    className="block w-full p-2 border rounded my-2 outline-none"
                  />
                </div>
                {signInFormik.touched.email && signInFormik.errors.email ? (
                  <p className="text-red-500 font-gotham font-light">
                    {signInFormik.errors.email}
                  </p>
                ) : null}
                <div className="flex items-center border rounded my-2 pr-2">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    autoComplete="off"
                    onChange={signInFormik.handleChange}
                    onBlur={signInFormik.handleBlur}
                    value={signInFormik.values.password}
                    placeholder="Password"
                    className="block w-full p-2 outline-none"
                  />
                  {!showPass ? (
                    <IoEyeOutline
                      className="cursor-pointer text-base"
                      onClick={() => setShowPass(true)}
                    />
                  ) : (
                    <IoEyeOffOutline
                      className="cursor-pointer text-base"
                      onClick={() => setShowPass(false)}
                    />
                  )}
                </div>
                {signInFormik.touched.password &&
                signInFormik.errors.password ? (
                  <p className="text-red-500 font-gotham font-light">
                    {signInFormik.errors.password}
                  </p>
                ) : null}
                <div className="flex items-center justify-between">
                  <Link
                    href="/forgot-password"
                    className="text-blue-900 capitalize font-gotham font-light"
                  >
                    Forgot password?
                  </Link>
                  <p
                    className="text-blue-900 hover:text-blue-700 capitalize font-gotham font-light cursor-pointer"
                    onClick={() => showModal("Sign Up")}
                  >
                    Don&apos;t have an account? Sign Up
                  </p>
                </div>

                <Button
                  type="primary"
                  className="mt-2 w-full"
                  htmlType="submit"
                >
                  Sign In
                </Button>
              </form>
            </div>
          </div>
        )}

        {modalType === "Sign Up" && (
          <div className="!mt-6">
            <div className="btns w-full flex items-center justify-center gap-2">
              {/* <button className="px-6 py-3 font-gotham bg-[#3b5998] text-white rounded-lg shadow-lg hover:bg-[#2d4373] transition-all flex items-center justify-center gap-1">
                <FaFacebookF /> <span>Facebook</span>
              </button> */}
              <button
                className="px-6 py-3 font-gotham rounded-lg shadow-lg bg-white hover:bg-gray-100 transition-all flex items-center justify-center gap-1 text-orange-400"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <FaGoogle />
                <span>Google</span>
              </button>
            </div>
            <div>
              <form
                action="/"
                method="post"
                className="mt-7 flex flex-col gap-1"
                onSubmit={handleSignUp}
              >
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="First Name"
                  name="FirstName"
                  value={signUpFormik.values.FirstName}
                  onBlur={signUpFormik.handleBlur}
                  onChange={signUpFormik.handleChange}
                  className="block w-full p-2 border rounded my-2 outline-none"
                />
                {signUpFormik.touched.FirstName &&
                signUpFormik.errors.FirstName ? (
                  <p className="text-red-500 font-gotham font-light">
                    {signUpFormik.errors.FirstName}
                  </p>
                ) : null}
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Last Name"
                  value={signUpFormik.values.LastName}
                  name="LastName"
                  onBlur={signUpFormik.handleBlur}
                  onChange={signUpFormik.handleChange}
                  className="block w-full p-2 border rounded my-2 outline-none"
                />
                {signUpFormik.touched.LastName &&
                signUpFormik.errors.LastName ? (
                  <p className="text-red-500 font-gotham font-light">
                    {signUpFormik.errors.LastName}
                  </p>
                ) : null}
                <input
                  type="email"
                  autoComplete="off"
                  placeholder="Email"
                  value={signUpFormik.values.Email}
                  name="Email"
                  onBlur={signUpFormik.handleBlur}
                  onChange={signUpFormik.handleChange}
                  className="block w-full p-2 border rounded my-2 outline-none"
                />
                {signUpFormik.touched.Email && signUpFormik.errors.Email ? (
                  <p className="text-red-500 font-gotham font-light">
                    {signUpFormik.errors.Email}
                  </p>
                ) : null}
                <div className="flex items-center border rounded my-2 pr-2">
                  <input
                    type={showPass ? "text" : "password"}
                    name="Password"
                    autoComplete="off"
                    value={signUpFormik.values.Password}
                    onBlur={signUpFormik.handleBlur}
                    onChange={signUpFormik.handleChange}
                    placeholder="Password"
                    className="block w-full p-2 outline-none"
                  />
                  {!showPass ? (
                    <IoEyeOutline
                      className="cursor-pointer text-base"
                      onClick={() => setShowPass(true)}
                    />
                  ) : (
                    <IoEyeOffOutline
                      className="cursor-pointer text-base"
                      onClick={() => setShowPass(false)}
                    />
                  )}
                </div>
                {signUpFormik.touched.Password &&
                signUpFormik.errors.Password ? (
                  <p className="text-red-500 font-gotham font-light">
                    {signUpFormik.errors.Password}
                  </p>
                ) : null}
                <Select
                  type="currency"
                  placeholder="Select Currency"
                  value={signUpFormik.values.Currency || null}
                  // Use tpCUR_CODE as the value so forms store the canonical code, and show symbol/description to the user
                  options={currencyExchange.map((currency) => ({
                    value: currency.tpCUR_CODE,
                    label: `${currency.tpCUR_SYMBOL || currency.tpCUR_CODE} - ${currency.tpCUR_DESCRIPTION || ""}`,
                  }))}
                  name="Currency"
                  onBlur={() => signUpFormik.setFieldTouched("Currency", true)}
                  onChange={(value) =>
                    signUpFormik.setFieldValue("Currency", value)
                  }
                  className="block w-full p-2 rounded !my-2"
                />
                <Select
                  type="AgentCountry"
                  placeholder="Agent Country"
                  showSearch
                  value={signUpFormik.values.AgentCountry || null}
                  onChange={(value) =>
                    signUpFormik.setFieldValue(
                      "AgentCountry",
                      value.split("~")[0]
                    )
                  }
                  options={getUniqueCountries(countries)}
                  className="block w-full p-2 rounded !my-2"
                />
                <p
                  className="text-blue-900 hover:text-blue-700 capitalize font-gotham font-light cursor-pointer text-end"
                  onClick={() => showModal("Sign In")}
                >
                  Already have an account? Sign In
                </p>
                <Button
                  type="primary"
                  className="mt-2 w-full"
                  htmlType="submit"
                >
                  Sign Up
                </Button>
              </form>
            </div>
          </div>
        )}
      </Modal>

      {/* Currency */}
      <Modal
        title={
          <h2 className="text-lg font-gotham text-blue-900">Select Currency</h2>
        }
        open={showCurrencyModal}
        onCancel={() => {
          setShowCurrencyModal(false);
        }}
        footer={null}
      >
        <div className="container py-5 flex flex-col gap-y-4">
          <div className="searchPart flex gap-x-2">
            <input
              type="text"
              name=""
              value={searchedCurrency}
              onChange={(e) => setSearchedCurrency(e.target.value)}
              id=""
              placeholder="Search Currency"
              className="w-full border border-slate-300 outline-none rounded font-gotham font-light p-2"
            />
            <button
              className="p-2 rounded outline-none text-white font-gotham bg-orange-500 cursor-pointer"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (!searchedCurrency) {
                  setFilteredCurrencyExchange(currencyExchange);
                  return;
                }
                let newData = currencyExchange.find((item) => {
                  if (!item) return false;
                  const codeMatch =
                    String(item.tpCUR_CODE || "").toLowerCase() ===
                    searchedCurrency.toLowerCase();
                  const symbolMatch =
                    String(item.tpCUR_SYMBOL || "").toLowerCase() ===
                    searchedCurrency.toLowerCase();
                  const descMatch = String(item.tpCUR_DESCRIPTION || "")
                    .toLowerCase()
                    .includes(searchedCurrency.toLowerCase());
                  return codeMatch || symbolMatch || descMatch;
                });
                if (!newData) {
                  // if not found, filter by include so partial matches show multiple results
                  const fallback = currencyExchange.filter((item) => {
                    if (!item) return false;
                    return (
                      String(item.tpCUR_DESCRIPTION || "")
                        .toLowerCase()
                        .includes(searchedCurrency.toLowerCase()) ||
                      String(item.tpCUR_SYMBOL || "")
                        .toLowerCase()
                        .includes(searchedCurrency.toLowerCase()) ||
                      String(item.tpCUR_CODE || "")
                        .toLowerCase()
                        .includes(searchedCurrency.toLowerCase())
                    );
                  });
                  setFilteredCurrencyExchange(fallback);
                } else {
                  setFilteredCurrencyExchange([newData]);
                }
                setSearchedCurrency("");
              }}
            >
              Search
            </button>
          </div>
          <div className="currencies flex flex-col w-full max-h-56 overflow-y-auto py-6">
            {!filteredCurrencyExchange || filteredCurrencyExchange.length === 0 ? (
              <div className="text-center text-sm text-slate-500 font-gotham">
                No currencies available yet. Please try again.
              </div>
            ) : (
              filteredCurrencyExchange
                .filter(Boolean)
                .map((currency) => (
                <div
                  key={currency.tpCUR_CODE}
                  className="border-b border-slate-200 p-2 rounded cursor-pointer font-gotham font-light text-base py-3 hover:text-blue-900 transition-all duration-150 ease-in-out flex justify-between items-center"
                  onClick={() => {
                    setShowCurrencyModal(false);
                    // Use currency code (e.g., 'USD', 'PKR') as the provider expects a code to fetch exchange rates
                    // Update provider with both code and a human-friendly symbol so UI updates instantly
                    handleCurrencyChangeContext(
                      currency.tpCUR_CODE || currency.tpCUR_SYMBOL,
                      currency.tpCUR_SYMBOL || currency.tpCUR_DESCRIPTION || currency.tpCUR_CODE
                    );
                    // Show a small confirmation toast with symbol/description for clarity
                    toast.success(`Currency set to ${currency.tpCUR_SYMBOL || currency.tpCUR_DESCRIPTION || currency.tpCUR_CODE}`, {
                      duration: 2000,
                    });
                  }}
                >
                  <span>{currency.tpCUR_DESCRIPTION}</span>
                  <span>({currency.tpCUR_SYMBOL})</span>
                </div>
                ))
            )}
          </div>
          <button
            type="button"
            className="border rounded outline-none cursor-pointer p-2 bg-orange-500 text-white font-gotham"
            onClick={() => {
              setShowCurrencyModal(false);
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};
export default Navbar;
