"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Script from "next/script";
import { Button, Select } from "antd";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { createPaymentSession } from "@/utils/createPaymentSession";
import toast from "react-hot-toast";
import LoadingAnim from "../loadingAnim/LoadingAnim";
const CreditCardForm = ({
  currentStep,
  handleCreditCardSubmit,
  flightsReviewJsonFinal,
  GetReservation,
  priceStructure,
  currency,
  flightsReviewData,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  country,
  setCountry,
  city,
  setCity,
  billingAddress,
  setBillingAddress,
  cardDetails,
  setCardDetails,
  phone,
  setPhone,
  postalCode,
  setPostalCode,
  email,
  setEmail,
  billingInfo,
  setBillingInfo,
  TAC,
  setTAC,
  cities,
  CAFOptions,
  loadingTicket,
}) => {
  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };
  // const [payNowLoading, setPayNowLoading] = useState(false);
  const [payAniLoading, setPayAniLoading] = useState(false);
  const [isButtonHidden, setIsButtonHidden] = useState(false);
  const [reservationError, setReservationError] = useState(null);
  const embedRef = useRef(null);
  useEffect(() => {
    setIsButtonHidden(false);
    setSessionId(null);
    configured.current = false;
    if (embedRef.current) {
      embedRef.current.innerHTML = "";
    }
  }, [currentStep]);

  // useEffect(() => {
  //   setPayNowLoading(false);
  //   setPayAniLoading(false);
  // }, []);
  const handleBillingInfoChange = (e) => {
    setBillingInfo({
      ...billingInfo,
      priceStructure, // keep if backend needs it
      [e.target.name]: e.target.value, // only update the field that changed
    });
  };
  // let [apiCallCheck, setApiCallCheck] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  // const makeReservationCall = async () => {
  //   const newData = handleCreditCardSubmit();
  //   if (!newData) return;
  //   setReservationError(null);
  //   try {
  //     // sessionId(null);
  //     let response = await GetReservation(newData);
  //     try{
  //       data = JSON.parse(response);
  //     console.log("data from GetReservation: ", data);
  //     }
  //     catch (parseError) {
  //     // If not JSON, treat as plain text error
  //     throw new Error(response); // Use the raw text as error message
  //   }
  //     // let data = JSON.parse(response);
  //     // console.log("data from GetReservation: ", data);

  //     // Extract PNR from Receipt where source === "1G"
  //     const gdsReceipt = data?.ReservationResponse?.Reservation?.Receipt?.find(
  //       (receipt) => receipt?.Confirmation?.Locator?.source === "1G"
  //     );
  //     const pnr = gdsReceipt?.Confirmation?.Locator?.value || null;

  //     if (pnr) {
  //       sessionStorage.setItem("reservationPNR", pnr);
  //     } else {
  //       console.warn("PNR not found in GetReservation response");
  //     }

  //     setSessionId(data.sessionId);
  //   } catch (error) {
  //     // console.error("Error fetching reservation:", error.message, error);
  //     setReservationError(error.message); // Set error message
  //     setIsButtonHidden(false);
  //     setPayAniLoading(false);
  //   }
  // };

  // Update makeReservationCall to handle both JSON and text responses
// const makeReservationCall = async () => {
//   // Validate and prepare data first
//   const newData = handleCreditCardSubmit();
//   console.log("Payload to backend: " , JSON.stringify(newData,null,2));
//   if (!newData) {
//     // Validation failed; ensure UI remains enabled
//     setIsButtonHidden(false);
//     setPayAniLoading(false);
//     return;
//   }

//   // Only hide the button and show animation after validation passes
//   setIsButtonHidden(true);
//   setPayAniLoading(true);
//   setReservationError(null);

//   // Preflight: ensure WBKey and Traveler IDs exist to avoid backend errors
//   const missingReasons = [];
//   if (!hasWBKey) missingReasons.push("WBKey");
//   if (!hasTravelerIds) missingReasons.push("traveler IDs");
//   if (missingReasons.length) {
//     setReservationError(
//       `Missing ${missingReasons.join(", ")}. Please complete the Passengers step and try again.`
//     );
//     setIsButtonHidden(false);
//     setPayAniLoading(false);
//     return;
//   }

//   try {
//     // 1) Create or confirm reservation as before (kept for PNR extraction)
//     const reservationData = await GetReservation(newData);
//     console.log("data from GetReservation: ", reservationData);
//     const gdsReceipt = reservationData?.ReservationResponse?.Reservation?.Receipt?.find(
//       (receipt) => receipt?.Confirmation?.Locator?.source === "1G"
//     );
//     const pnr = gdsReceipt?.Confirmation?.Locator?.value || null;
//     if (pnr) sessionStorage.setItem("reservationPNR", pnr);

//     // 2) If reservation already returned a session id, use it directly
//     let session =
//       reservationData?.sessionId ||
//       reservationData?.SessionId ||
//       reservationData?.session?.id ||
//       null;

//     if (!session) {
//       // Try to create a payment session via dedicated endpoint(s)
//       const baseUri = process.env.NEXT_PUBLIC_BASE_URI;
//       const paymentPayload = {
//         PNR: pnr,
//         amount: newData?.Payment?.amount,
//         currency: newData?.Payment?.currency,
//         orderId: newData?.Payment?.orderId,
//         orderHint: newData?.Payment?.orderHint,
//         description: newData?.Payment?.description,
//         Customer: newData?.Customer,
//         Billing: newData?.billingInfo,
//         Travelers: newData?.travelers,
//         WBKey:
//           newData?.WBKey ||
//           (typeof window !== 'undefined'
//             ? sessionStorage.getItem('WBKey')
//             : undefined),
//         UserId: newData?.UserID,
//         ReturnURL: newData?.ReturnURL,
//       };

//       const sessionResp = await createPaymentSession(paymentPayload, baseUri);
//       if (!sessionResp.success) {
//         const attempted = sessionResp.attempted?.join(', ') || '';
//         const suggestion = sessionResp.suggestion || '';
//         throw new Error(
//           `${sessionResp.error}${attempted ? ` | Tried: ${attempted}` : ''}${
//             suggestion ? ` | ${suggestion}` : ''
//           }`
//         );
//       }
//       session = sessionResp.sessionId;
//     }

//     setSessionId(session);
//   } catch (error) {
//     console.error("Error fetching reservation:", error?.message || error, error);
//     setReservationError(error?.message || String(error));
//     // Reset UI so user can try again
//     setIsButtonHidden(false);
//     setPayAniLoading(false);
//   }
// };
// const makeReservationCall = async () => {
//   const newData = handleCreditCardSubmit();
//   if (!newData) return;
//   setReservationError(null);
//   setPayAniLoading(true);
//   setIsButtonHidden(true);

//   try {
//     console.log("Payload to backend:", JSON.stringify(newData, null, 2));
//     const response = await GetReservation(newData);

//     // Handle both JSON and plain text responses
//     let data;
//     try {
//       data = typeof response === "string" ? JSON.parse(response) : response;
//       console.log("Parsed GetReservation response:", JSON.stringify(data, null, 2));
//     } catch (parseError) {
//       console.error("Failed to parse GetReservation response:", parseError, response);
//       throw new Error("Invalid response from server: " + (response || "Empty response"));
//     }

//     // Check for backend errors
//     const backendErrors =
//       data?.ReservationResponse?.Result?.Error ||
//       data?.Result?.Error ||
//       data?.error ||
//       null;
//     if (backendErrors) {
//       const errorMessage = Array.isArray(backendErrors)
//         ? backendErrors.map((e) => e?.Message || e).join(" | ")
//         : typeof backendErrors === "string"
//         ? backendErrors
//         : backendErrors?.Message || "Reservation failed";
//       console.error("Reservation error:", errorMessage, backendErrors);
//       toast.error(errorMessage, {
//         duration: 4000,
//         style: { backgroundColor: "#f8312f", color: "#fff" },
//       });
//       setReservationError(errorMessage);
//       setPayAniLoading(false);
//       setIsButtonHidden(false);
//       return;
//     }

//     // Extract PNR from Receipt where source === "1G"
//     const receipts = data?.ReservationResponse?.Reservation?.Receipt;
//     let pnr = null;
//     if (Array.isArray(receipts)) {
//       console.log("Receipts found:", JSON.stringify(receipts, null, 2));
//       const gdsReceipt = receipts.find(
//         (receipt) => receipt?.Confirmation?.Locator?.source === "1G"
//       );
//       pnr = gdsReceipt?.Confirmation?.Locator?.value || null;
//     } else {
//       console.warn(
//         "Receipts not found or not an array in GetReservation response:",
//         JSON.stringify(receipts, null, 2)
//       );
//     }

//     if (pnr) {
//       sessionStorage.setItem("reservationPNR", pnr);
//       console.log("PNR stored in sessionStorage:", pnr);
//     } else {
//       console.warn("PNR not found for source '1G'. Attempting fallback PNR extraction.");
//       // Fallback: Try to find any valid PNR in receipts
//       const anyReceipt = Array.isArray(receipts)
//         ? receipts.find((receipt) => receipt?.Confirmation?.Locator?.value)
//         : null;
//       pnr = anyReceipt?.Confirmation?.Locator?.value || null;
//       if (pnr) {
//         sessionStorage.setItem("reservationPNR", pnr);
//         console.log("Fallback PNR stored in sessionStorage:", pnr);
//       } else {
//         console.error("No valid PNR found in any receipt. Response:", JSON.stringify(data, null, 2));
//         toast.error("Unable to retrieve booking reference (PNR). Please try again or contact support.", {
//           duration: 4000,
//           style: { backgroundColor: "#f8312f", color: "#fff" },
//         });
//         setReservationError("Unable to retrieve booking reference (PNR).");
//         setPayAniLoading(false);
//         setIsButtonHidden(false);
//         return;
//       }
//     }

//     // Extract session ID with fallback for different response structures
//     const resolvedSessionId =
//       data?.sessionId ||
//       data?.session_id ||
//       data?.session?.id ||
//       data?.Result?.sessionId ||
//       data?.result?.sessionId ||
//       null;

//     if (!resolvedSessionId) {
//       console.error("No sessionId found in reservation response:", JSON.stringify(data, null, 2));
//       toast.error("Payment session could not be created. Please try again.", {
//         duration: 4000,
//         style: { backgroundColor: "#f8312f", color: "#fff" },
//       });
//       setReservationError("Payment session could not be created. Please try again.");
//       setPayAniLoading(false);
//       setIsButtonHidden(false);
//       return;
//     }

//     setSessionId(resolvedSessionId);
//     console.log("Session ID set:", resolvedSessionId);
//   } catch (error) {
//     console.error("Error fetching reservation:", error.message, error);
//     const errorMessage = error.message || "Failed to create payment session";
//     toast.error(errorMessage, {
//       duration: 4000,
//       style: { backgroundColor: "#f8312f", color: "#fff" },
//     });
//     setReservationError(errorMessage);
//     setPayAniLoading(false);
//     setIsButtonHidden(false);
//   }
// };
const makeReservationCall = async () => {
  const newData = handleCreditCardSubmit();
  if (!newData) {
    setPayAniLoading(false);
    setIsButtonHidden(false);
    return;
  }

  // Additional payload validation
  if (!newData.WBKey) {
    toast.error("Session key (WBKey) is missing. Please complete the Passengers step.", {
      duration: 4000,
      style: { backgroundColor: "#f8312f", color: "#fff" },
    });
    setPayAniLoading(false);
    setIsButtonHidden(false);
    return;
  }
  if (!newData.travelers?.every(t => t.Traveler?.Identifier?.value)) {
    toast.error("Traveler IDs are missing. Please complete the Passengers step.", {
      duration: 4000,
      style: { backgroundColor: "#f8312f", color: "#fff" },
    });
    setPayAniLoading(false);
    setIsButtonHidden(false);
    return;
  }

  setReservationError(null);
  setPayAniLoading(true);
  setIsButtonHidden(true);

  try {
    console.log("Payload to backend:", JSON.stringify(newData, null, 2));
    const response = await GetReservation(newData);

    let data;
    if (typeof response === "string") {
      // Check for plain text error responses
      if (response.startsWith("ERROR:") || response.includes("technical issue")) {
        console.error("Server returned plain text error:", response);
        toast.error(response, {
          duration: 4000,
          style: { backgroundColor: "#f8312f", color: "#fff" },
        });
        setReservationError(response);
        setPayAniLoading(false);
        setIsButtonHidden(false);
        return;
      }
      // Attempt to parse as JSON
      try {
        data = JSON.parse(response);
        console.log("Parsed GetReservation response:", JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error("Failed to parse GetReservation response:", parseError, response);
        throw new Error("Invalid response from server: " + (response || "Empty response"));
      }
    } else {
      data = response; // Already parsed by useGetReservation
    }

    // Handle backend errors
    const backendErrors =
      data?.ReservationResponse?.Result?.Error ||
      data?.Result?.Error ||
      data?.error ||
      null;
    if (backendErrors) {
      const errorMessage = Array.isArray(backendErrors)
        ? backendErrors.map((e) => e?.Message || e).join(" | ")
        : typeof backendErrors === "string"
        ? backendErrors
        : backendErrors?.Message || "Reservation failed";
      console.error("Reservation error:", errorMessage, backendErrors);
      toast.error(errorMessage, {
        duration: 4000,
        style: { backgroundColor: "#f8312f", color: "#fff" },
      });
      setReservationError(errorMessage);
      setPayAniLoading(false);
      setIsButtonHidden(false);
      return;
    }

    // Extract PNR
    const receipts = data?.ReservationResponse?.Reservation?.Receipt;
    let pnr = null;
    if (Array.isArray(receipts)) {
      console.log("Receipts found:", JSON.stringify(receipts, null, 2));
      const gdsReceipt = receipts.find(
        (receipt) => receipt?.Confirmation?.Locator?.source === "1G"
      );
      pnr = gdsReceipt?.Confirmation?.Locator?.value || null;
    }

    if (pnr) {
      sessionStorage.setItem("reservationPNR", pnr);
      console.log("PNR stored in sessionStorage:", pnr);
    } else {
      console.warn("PNR not found for source '1G'. Attempting fallback.");
      const anyReceipt = Array.isArray(receipts)
        ? receipts.find((receipt) => receipt?.Confirmation?.Locator?.value)
        : null;
      pnr = anyReceipt?.Confirmation?.Locator?.value || null;
      if (pnr) {
        sessionStorage.setItem("reservationPNR", pnr);
        console.log("Fallback PNR stored in sessionStorage:", pnr);
      } else {
        console.error("No valid PNR found:", JSON.stringify(data, null, 2));
        toast.error("Unable to retrieve booking reference (PNR). Please try again or contact support.", {
          duration: 4000,
          style: { backgroundColor: "#f8312f", color: "#fff" },
        });
        setReservationError("Unable to retrieve booking reference (PNR).");
        setPayAniLoading(false);
        setIsButtonHidden(false);
        return;
      }
    }

    // Extract session ID
    const resolvedSessionId =
      data?.sessionId ||
      data?.session_id ||
      data?.session?.id ||
      data?.Result?.sessionId ||
      data?.result?.sessionId ||
      null;

    if (!resolvedSessionId) {
      console.error("No sessionId found:", JSON.stringify(data, null, 2));
      toast.error("Payment session could not be created. Please try again.", {
        duration: 4000,
        style: { backgroundColor: "#f8312f", color: "#fff" },
      });
      setReservationError("Payment session could not be created.");
      setPayAniLoading(false);
      setIsButtonHidden(false);
      return;
    }

    setSessionId(resolvedSessionId);
    console.log("Session ID set:", resolvedSessionId);
  } catch (error) {
    console.error("Error fetching reservation:", error.message, error);
    const errorMessage = error.message || "Failed to create payment session";
    toast.error(errorMessage, {
      duration: 4000,
      style: { backgroundColor: "#f8312f", color: "#fff" },
    });
    setReservationError(errorMessage);
    setPayAniLoading(false);
    setIsButtonHidden(false);
  }
};
  const scriptLoaded = useRef(false);
  const configured = useRef(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     let response = await GetReservation(flightsReviewJsonFinal);
  //     console.log("response is: ", response);
  //     let data = JSON.parse(response);
  //     console.log("data from GetReservation: ", data);
  //     setSessionId(data.sessionId);
  //     // setApiCallCheck(false);
  //   };
  //   if (apiCallCheck) fetchData();
  // }, [apiCallCheck]);

  useEffect(() => {
    if (sessionId && window.Checkout && !configured.current) {
      window.Checkout.configure({
        session: {
          id: sessionId,
        },
      });
      window.Checkout.showEmbeddedPage("#embed-target");
      configured.current = true;
    }
  }, [sessionId]);

  useEffect(() => {
    // Define global callbacks
    window.errorCallback = (error) => {
      console.error("Payment error:", JSON.stringify(error));
      setIsButtonHidden(false);
      setPayAniLoading(false);
      setSessionId(null);
      configured.current = false;
      if (embedRef.current) embedRef.current.innerHTML = "";
    };
    window.cancelCallback = () => {
      console.log("Payment cancelled");
      setIsButtonHidden(false);
      setPayAniLoading(false);
      setSessionId(null);
      configured.current = false;
      if (embedRef.current) embedRef.current.innerHTML = "";
    };
    window.completeCallback = (response) => {
      console.log("Payment complete:", response);
      // Handle successful payment here
    };

    return () => {
      delete window.errorCallback;
      delete window.cancelCallback;
      delete window.completeCallback;
    };
  }, [embedRef]);

  useEffect(() => {
    let id;
    if (payAniLoading) {
      id = setTimeout(() => {
        setPayAniLoading(false);
      }, 7000);
    }
    return () => {
      clearTimeout(id);
    };
  }, [payAniLoading]);

  const { Option } = Select;
  const isFormValid = Boolean(
    firstName?.trim() &&
      lastName?.trim() &&
      country?.trim() &&
      city?.trim() &&
      billingAddress?.trim() &&
      postalCode?.trim() &&
      phone?.trim() &&
      email?.trim() &&
      TAC
  );

  // Ensure required reservation prerequisites exist before enabling Pay Now
  const hasWBKey = Boolean(flightsReviewJsonFinal?.WBKey);
  const hasTravelerIds = Array.isArray(flightsReviewJsonFinal?.travelers)
    && flightsReviewJsonFinal.travelers.every((t) => t?.Traveler?.Identifier?.value);
  const isReservationReady = hasWBKey && hasTravelerIds;

  useEffect(() => {
    console.log("Form values:", {
      firstName,
      lastName,
      country,
      city,
      billingAddress,
      postalCode,
      phone,
      email,
      TAC,
      isFormValid,
    });
  }, [
    firstName,
    lastName,
    country,
    city,
    billingAddress,
    postalCode,
    phone,
    email,
    TAC,
  ]);
  const isTestEnv = process.env.NEXT_PUBLIC_CHECKOUT_ENV === "test";
  const scriptSrc = isTestEnv
    ? "https://test-bankalfalah.gateway.mastercard.com/static/checkout/checkout.min.js"
    : "https://bankalfalah.gateway.mastercard.com/static/checkout/checkout.min.js";
  return (
    <>
      <Script
        src={scriptSrc}
        strategy="afterInteractive"
        data-error="errorCallback"
        data-cancel="cancelCallback"
        data-complete="completeCallback"
        onLoad={() => {
          console.log("Checkout script loaded successfully");
          scriptLoaded.current = true;
        }}
        onError={(e) => {
          console.error("Failed to load Checkout script:", e);
        }}
      />
      <div
        className="flex flex-col items-center justify-center lg:p-4 relative w-full"
        onClick={() => console.log(sessionId)}
      >
        <div className=" mx-auto lg:p-3">
          <div className="mx-auto bg-orange-500 rounded">
            <h4 className="py-3 pl-3 text-sm md:text-base lg:text-lg xl:text-xl text-white font-gotham">
              Billing Information
            </h4>
          </div>
          <div className="userform pt-5 gap-10 flex">
            <div className="userformheader flex flex-col gap-5 lg:gap-10">
              <div className="flex flex-col gap-5 lg:gap-7">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-y-4 gap-x-2">
                  <div className="relative w-full">
                    <input
                      type="text"
                      autoComplete="off"
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        handleBillingInfoChange(e);
                      }}
                      className="block px-2.5 pb-2.5 pt-4 w-full lg:w-56 h-14 text-sm rounded border focus:outline-none focus:border-inherit font-gotham font-light"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="relative w-full">
                    <input
                      type="text"
                      autoComplete="off"
                      id="lastName"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        handleBillingInfoChange(e);
                      }}
                      className="block px-2.5 pb-2.5 pt-4 w-full lg:w-56 h-14 text-sm text-gray-900 bg-transparent rounded !border focus:outline-none focus:border-inherit font-gotham font-light"
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="relative City w-full">
                    <Select
                      showSearch
                      placeholder="Select City"
                      className="!w-full lg:w-[90%] font-gotham font-light"
                      optionFilterProp="children"
                      style={{
                        width: "90%",
                        height: "56px",
                      }}
                      value={city || null}
                      onChange={(value) => {
                        setCity(value);
                        handleBillingInfoChange({
                          target: { name: "city", value },
                        });
                      }}
                      filterOption={(input, option) => {
                        return option.children
                          .toLowerCase()
                          .includes(input.toLowerCase());
                      }}
                    >
                      {cities?.map((c) => (
                        <Select.Option key={c.tpCC_CODE} value={c.tpCC_CODE}>
                          {`${c.tpCC_CITY} (${c.tpCC_COUNTRY_CODE})`}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  <div className="relative Country w-full">
                    <Select
                      className="!w-full lg:w-[90%] font-gotham font-light"
                      style={{
                        width: "90%",
                        height: "56px",
                      }}
                      id="Country"
                      showSearch
                      placeholder="Select Your Country"
                      optionLabelProp="label"
                      onChange={(value) => {
                        setCountry(value);
                        handleBillingInfoChange({
                          target: { name: "country", value },
                        });
                      }}
                      value={country || null}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
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
                              <span className="ml-2">
                                {option && option.label}
                              </span>
                            </div>
                          </Option>
                        ))}
                    </Select>
                  </div>
                  <div className="relative postalCode w-full">
                    <input
                      type="text"
                      autoComplete="off"
                      id="postalCode"
                      name="postalCode"
                      value={postalCode}
                      onChange={(e) => {
                        setPostalCode(e.target.value);
                        handleBillingInfoChange(e);
                      }}
                      className="block px-2.5 pb-2.5 pt-4 w-full lg:w-56 h-14 text-sm text-gray-900 bg-transparent rounded !border focus:outline-none focus:border-inherit font-gotham font-light"
                      placeholder="Postal Code"
                    />
                  </div>
                  <div className="relative PostCode w-full">
                    <input
                      type="text"
                      autoComplete="off"
                      id="Phone"
                      name="phone"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        handleBillingInfoChange(e);
                      }}
                      className="block px-2.5 pb-2.5 pt-4 w-full lg:w-56 h-14 text-sm text-gray-900 bg-transparent rounded !border focus:outline-none focus:border-inherit font-gotham font-light"
                      placeholder="Phone"
                    />
                  </div>
                  <div className="relative PostCode w-full">
                    <input
                      type="email"
                      autoComplete="off"
                      id="Email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        handleBillingInfoChange(e);
                      }}
                      className="block px-2.5 pb-2.5 pt-4 w-full lg:w-56 h-14 text-sm text-gray-900 bg-transparent rounded !border focus:outline-none focus:border-inherit font-gotham font-light"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    autoComplete="off"
                    value={billingAddress}
                    name="addressLine1"
                    onChange={(e) => {
                      setBillingAddress(e.target.value);
                      handleBillingInfoChange(e);
                    }}
                    id="Billing Address"
                    className="block px-2.5 pb-2.5 pt-4 w-full h-14 text-sm text-gray-900 bg-transparent rounded !border focus:outline-none focus:border-inherit font-gotham font-light"
                    placeholder="Billing Address"
                  />
                </div>
                <div className="flex items-center ">
                  <input
                    type="checkbox"
                    checked={TAC}
                    onChange={(e) => setTAC(e.target.checked)}
                  />
                  <span className="ml-2 font-gotham font-light text-xs sm:text-sm md:text-base">
                    Accept{" "}
                    <a
                      href="/T&C"
                      target="_blank"
                      className="text-blue-500 font-gotham font-normal text-xs sm:text-sm md:text-base"
                    >
                      Terms & Conditions
                    </a>
                  </span>
                </div>
              </div>
              <div className="flex border border-slate-500 w-full lg:w-1/2 gap-1 lg:gap-5 rounded py-1 items-center justify-between">
                <div className="staticpart flex p-1 lg:p-2 items-center gap-1 lg:gap-3 h-full">
                  <div>
                    <Image
                      unoptimized
                      src="/img/pay-credit-card.png"
                      alt="Card Image"
                      width={80}
                      height={56}
                      className="w-12 h-8"
                    />
                  </div>
                  <div className="text-xs sm:text-base md:text-base font-gotham font-light w-full">
                    Credit or Debit Card Payment
                  </div>
                </div>
                <div className="text-xs sm:text-sm md:text-base md:hover:text-[16.5px] font-normal md:font-bold pr-1 lg:pr-2 font-gotham">
                  {Math.ceil(
                    Number(priceStructure?.totalPriceFC ?? 0)
                  ).toLocaleString("en-US")}{" "}
                  <span className="text-blue-900 font-gotham font-normal text-xs sm:text-sm md:text-base">
                    {currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div
          ref={embedRef}
          id="embed-target"
          className="relative mt-10 w-full min-h-[50px]"
        ></div> */}
        {reservationError ? (
          <div
            className="relative mt-10 w-full min-h-[50px] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {reservationError}</span>
          </div>
        ) : (
          <div
            ref={embedRef}
            id="embed-target"
            className="relative mt-10 w-full min-h-[50px]"
          ></div>
        )}
        <div className="flex items-center justify-center">
          {!isButtonHidden && (
            <Button
              type="primary"
              disabled={!isFormValid || !isReservationReady}
              className={
                "!bg-orange-500 text-white font-gotham font-medium px-6 py-3 rounded"
              }
              onClick={async () => {
                // Delegate validation and UI state management to makeReservationCall
                await makeReservationCall();
              }}
            >
              Pay Now
            </Button>
          )}
          {!isReservationReady && (
            <div className="mt-2 text-xs text-red-600 text-center">
              Please complete the Passengers step to generate traveler IDs and session (WBKey).
            </div>
          )}
          <DotLottieReact
            src="https://lottie.host/749564f5-bb57-42ee-a7af-b27d3b0226af/SO1a5GkcWE.lottie"
            loop
            autoplay
            className={`${payAniLoading ? "inline-block" : "hidden"}`}
          />
        </div>
        <div
          className={`flex flex-wrap justify-center items-center text-center gap-x-12 px-4 sm:px-8 pt-8 pb-8 md:pt-20 md:pb-12`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="130"
            height="130"
            viewBox="0 0 141.732 141.732"
            id="visa"
            className="w-24 md:w-28 lg:w-32"
          >
            <g fill="#2566af">
              <path d="M62.935 89.571h-9.733l6.083-37.384h9.734zM45.014 52.187L35.735 77.9l-1.098-5.537.001.002-3.275-16.812s-.396-3.366-4.617-3.366h-15.34l-.18.633s4.691.976 10.181 4.273l8.456 32.479h10.141l15.485-37.385H45.014zM121.569 89.571h8.937l-7.792-37.385h-7.824c-3.613 0-4.493 2.786-4.493 2.786L95.881 89.571h10.146l2.029-5.553h12.373l1.14 5.553zm-10.71-13.224l5.114-13.99 2.877 13.99h-7.991zM96.642 61.177l1.389-8.028s-4.286-1.63-8.754-1.63c-4.83 0-16.3 2.111-16.3 12.376 0 9.658 13.462 9.778 13.462 14.851s-12.075 4.164-16.06.965l-1.447 8.394s4.346 2.111 10.986 2.111c6.642 0 16.662-3.439 16.662-12.799 0-9.72-13.583-10.625-13.583-14.851.001-4.227 9.48-3.684 13.645-1.389z"></path>
            </g>
            <path
              fill="#e6a540"
              d="M34.638 72.364l-3.275-16.812s-.396-3.366-4.617-3.366h-15.34l-.18.633s7.373 1.528 14.445 7.253c6.762 5.472 8.967 12.292 8.967 12.292z"
            ></path>
            <path fill="none" d="M0 0h141.732v141.732H0z"></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="110"
            height="110"
            id="google-pay"
            className="w-18 md:w-20 lg:w-24"
          >
            <path
              fill="#5F6368"
              d="M10.917 11.496V14.4h-.922V7.227h2.444a2.206 2.206 0 0 1 1.583.621c.429.386.67.938.661 1.514a1.985 1.985 0 0 1-.661 1.523c-.428.408-.956.612-1.583.611h-1.522zm0-3.386v2.505h1.545c.343.01.673-.124.912-.371.484-.47.496-1.245.024-1.729l-.024-.024a1.204 1.204 0 0 0-.912-.381h-1.545zm5.89 1.222c.682 0 1.219.182 1.613.546.394.364.591.864.591 1.497v3.026h-.881v-.682h-.04c-.382.561-.89.842-1.523.842-.541 0-.993-.16-1.357-.481a1.538 1.538 0 0 1-.546-1.202c0-.508.192-.912.576-1.212.384-.3.896-.451 1.538-.451.547 0 .998.1 1.352.3v-.211a1.046 1.046 0 0 0-.381-.815 1.304 1.304 0 0 0-.89-.336c-.514 0-.922.217-1.222.651l-.811-.511c.445-.641 1.106-.961 1.981-.961zm-1.193 3.566a.739.739 0 0 0 .305.601c.204.16.457.246.716.24a1.472 1.472 0 0 0 1.037-.431c.305-.288.458-.624.458-1.012-.288-.229-.688-.344-1.202-.344-.374 0-.687.09-.937.271-.251.185-.377.408-.377.675zm8.457-3.406-3.077 7.073h-.951l1.142-2.475-2.025-4.598h1.002l1.463 3.526h.02l1.423-3.526h1.003z"
            ></path>
            <path
              fill="#4285F4"
              d="M8.079 11.7c0-.281-.023-.561-.071-.838H4.121v1.587h2.226a1.905 1.905 0 0 1-.823 1.252v1.031h1.329c.778-.716 1.226-1.777 1.226-3.032z"
            ></path>
            <path
              fill="#34A853"
              d="M4.121 15.728c1.112 0 2.049-.365 2.732-.995l-1.329-1.031c-.37.251-.846.394-1.403.394-1.075 0-1.987-.725-2.314-1.701H.439v1.062a4.12 4.12 0 0 0 3.682 2.271z"
            ></path>
            <path
              fill="#FBBC04"
              d="M1.808 12.395a2.464 2.464 0 0 1 0-1.578V9.756H.439a4.124 4.124 0 0 0 0 3.702l1.369-1.063z"
            ></path>
            <path
              fill="#EA4335"
              d="M4.121 9.117a2.24 2.24 0 0 1 1.581.618l1.177-1.176a3.968 3.968 0 0 0-2.758-1.074A4.12 4.12 0 0 0 .439 9.756l1.369 1.062c.326-.977 1.238-1.701 2.313-1.701z"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            id="mastercard"
            width="90"
            height="90"
            className="w-16 md:w-20 lg:w-24"
          >
            <path
              fill="#FF5F00"
              d="M15.245 17.831h-6.49V6.168h6.49v11.663z"
            ></path>
            <path
              fill="#EB001B"
              d="M9.167 12A7.404 7.404 0 0 1 12 6.169 7.417 7.417 0 0 0 0 12a7.417 7.417 0 0 0 11.999 5.831A7.406 7.406 0 0 1 9.167 12z"
            ></path>
            <path
              fill="#F79E1B"
              d="M24 12a7.417 7.417 0 0 1-12 5.831c1.725-1.358 2.833-3.465 2.833-5.831S13.725 7.527 12 6.169A7.417 7.417 0 0 1 24 12z"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="90"
            height="80"
            viewBox="0 0 192.756 192.756"
            id="american"
          >
            <g fillRule="evenodd" clipRule="evenodd">
              <path fill="#fff" d="M0 0h192.756v192.756H0V0z"></path>
              <path
                fill="#0077a6"
                d="M8.484 177.699h-.551c0-.275-.138-.689-.138-.828 0-.137 0-.412-.414-.412h-.828v1.24h-.414v-2.896h1.242c.552 0 .965.139.965.689 0 .414-.138.553-.275.689.138.139.275.277.275.553v.551c0 .139 0 .139.138.139v.275zm-.551-2.068c0-.414-.276-.414-.414-.414h-.966v.828h.828c.276 0 .552-.139.552-.414zm2.345.551c0-1.654-1.379-3.035-3.173-3.035-1.655 0-3.035 1.381-3.035 3.035 0 1.793 1.38 3.174 3.035 3.174 1.793-.001 3.173-1.381 3.173-3.174zm-.414 0c0 1.518-1.241 2.621-2.759 2.621s-2.621-1.104-2.621-2.621c0-1.379 1.104-2.621 2.621-2.621s2.759 1.242 2.759 2.621zM179.818 120.451c0 4.139-2.621 6.068-7.312 6.068h-8.965v-4.139h8.965c.828 0 1.518-.137 1.795-.412.275-.277.551-.691.551-1.242 0-.553-.275-1.104-.551-1.379-.277-.277-.828-.414-1.656-.414-4.275-.139-9.656.137-9.656-5.932 0-2.76 1.793-5.795 6.621-5.795h9.242v4.139h-8.553c-.826 0-1.379 0-1.793.275-.414.414-.689.828-.689 1.518s.414 1.104.965 1.381c.553.137 1.105.275 1.795.275h2.482c2.621 0 4.277.551 5.381 1.518.826.965 1.378 2.208 1.378 4.139zm-19.451-4.139c-1.104-.967-2.76-1.518-5.381-1.518h-2.482c-.689 0-1.242-.139-1.793-.275-.553-.277-.965-.691-.965-1.381s.137-1.104.689-1.518c.414-.275.965-.275 1.793-.275h8.553v-4.139h-9.242c-4.967 0-6.623 3.035-6.623 5.795 0 6.068 5.381 5.793 9.658 5.932.826 0 1.379.137 1.654.414.275.275.553.826.553 1.379 0 .551-.277.965-.553 1.242-.414.275-.965.412-1.793.412h-8.967v4.139h8.967c4.689 0 7.311-1.93 7.311-6.068 0-1.931-.551-3.174-1.379-4.139zm-17.658 6.208h-10.896v-3.863h10.621v-3.861h-10.621v-3.588h10.896v-4H127.26v19.312h15.449v-4zm-20.416-14.346c-1.518-.828-3.311-.967-5.656-.967h-10.621v19.312h4.689v-7.035h4.967c1.654 0 2.621.139 3.311.828.828.965.828 2.621.828 3.863v2.344h4.551v-3.725c0-1.793-.137-2.621-.689-3.586-.414-.553-1.24-1.242-2.344-1.656 1.24-.412 3.311-2.068 3.311-5.104-.001-2.206-.829-3.448-2.347-4.274zm-26.21-.967H81.322l-5.932 6.346-5.656-6.346H51.111v19.312h18.348l5.932-6.346 5.656 6.346h8.967v-6.482h5.794c4 0 8.002-1.104 8.002-6.484-.001-5.242-4.14-6.346-7.727-6.346zm22.485 8.002c-.689.275-1.379.275-2.207.275l-5.656.139v-4.416h5.656c.828 0 1.656 0 2.207.414.553.277.965.828.965 1.656s-.412 1.518-.965 1.932zm-22.485.965h-6.07v-4.967h6.07c1.656 0 2.759.691 2.759 2.346 0 1.656-1.104 2.621-2.759 2.621zm-17.796.689l7.173-7.586v15.588l-7.173-8.002zm-11.174 5.657h-11.45v-3.863h10.208v-3.861H55.663v-3.588h11.588l5.104 5.656-5.242 5.656zm99.875-29.246h-6.621l-8.691-14.485v14.485h-9.379l-1.795-4.277h-9.656l-1.793 4.277h-5.381c-2.207 0-5.104-.552-6.758-2.208-1.518-1.655-2.346-3.862-2.346-7.311 0-2.897.414-5.518 2.482-7.587 1.379-1.518 3.863-2.207 7.035-2.207h4.414V78.1h-4.414c-1.654 0-2.621.276-3.586 1.104-.828.828-1.242 2.345-1.242 4.414s.414 3.587 1.242 4.553c.689.689 1.932.965 3.172.965h2.07l6.621-15.174h6.898l7.725 18.209v-18.21h7.174l8.139 13.381V73.961h4.689v19.313h.001zm-54.765-19.313h-4.689v19.313h4.689V73.961zm-9.795.828c-1.518-.828-3.172-.828-5.517-.828H86.288v19.313h4.552v-7.036h4.966c1.656 0 2.76.138 3.449.828.828.966.689 2.622.689 3.725v2.483h4.689v-3.863c0-1.655-.137-2.483-.826-3.449-.414-.552-1.242-1.242-2.207-1.655 1.24-.552 3.311-2.069 3.311-5.104.001-2.207-.966-3.449-2.483-4.414zM82.977 89.274h-10.76v-3.863h10.622v-4H72.217v-3.449h10.76v-4h-15.45v19.313h15.45v-4.001zM64.078 73.961h-7.587l-5.656 13.105-6.07-13.105h-7.449V92.17l-7.863-18.209h-6.897l-8.277 19.313h4.966l1.793-4.277h9.656l1.793 4.277h9.381V78.1l6.759 15.174h4l6.76-15.174v15.174h4.69V73.961h.001zm74.77 10.898l-3.174-7.587-3.172 7.587h6.346zm-40.006-3.034c-.689.414-1.379.414-2.345.414H90.84v-4.276h5.656c.828 0 1.792 0 2.345.276.551.414.828.966.828 1.793s-.276 1.516-.827 1.793zm-76.149 3.034l3.173-7.587 3.173 7.587h-6.346zm156.022-71.458H14.14v69.527l5.656-12.829h12.001l1.656 3.173v-3.173h14.071l3.173 6.897 3.035-6.897h44.834c2.068 0 3.861.414 5.242 1.517v-1.517h12.277v1.517c2.068-1.104 4.689-1.517 7.725-1.517h17.795l1.656 3.173v-3.173h13.105l1.932 3.173v-3.173h12.828v27.038H158.16l-2.482-4.138v4.138h-16.141l-1.793-4.414h-4.002l-1.793 4.414h-8.414c-3.311 0-5.795-.828-7.449-1.655v1.655H96.083v-6.208c0-.828-.138-.966-.69-.966h-.689v7.173H56.077v-3.449l-1.379 3.449h-8.139l-1.379-3.311v3.311H29.591l-1.655-4.414h-4.001l-1.793 4.414H14.14v81.529h164.575V129.14c-1.793.828-4.277 1.242-6.76 1.242h-12.002v-1.656c-1.379 1.105-3.863 1.656-6.207 1.656h-37.799v-6.207c0-.828-.137-.828-.828-.828h-.689v7.035h-12.416v-7.311c-2.068.965-4.414.965-6.483.965h-1.38v6.346H78.977l-3.586-4.139-4 4.139H46.972v-27.037h24.831l3.587 4.137 3.863-4.137h16.692c1.93 0 5.104.275 6.483 1.654v-1.654h14.898c1.518 0 4.416.275 6.346 1.654v-1.654h22.486V105c1.242-1.104 3.588-1.654 5.656-1.654h12.553V105c1.381-.965 3.311-1.654 5.795-1.654h8.553V13.401z"
              ></path>
            </g>
          </svg>
          <Image
            width={90}
            height={90}
            src="/img/Jazzcash.png"
            alt="Jazzcash"
            className="w-20 md:w-24 lg:w-28"
          ></Image>
          <Image
            width={90}
            height={90}
            src="/svg/easypaisa2.svg"
            alt="Easypaisa"
            className="w-20 md:w-24 lg:w-28"
          ></Image>
        </div>

        <div className="gap-0 md:gap-2 py-2 mt-12">
          <div className="w-28">
            <Image
              unoptimized
              src="/img/shield.png"
              alt="Card Image"
              width={80}
              height={80}
              className="w-14 h-14 md:w-full md:h-full"
            />
          </div>
          <div className="w-full flex flex-col md:gap-2">
            <div>
              <p className="text-sm font-gotham font-normal text-justify">
                Your Bank card details are Processed by the center and Protected
                by 128-bit encryption provided by COMODO SECURE (SSL)
              </p>
            </div>
            <div className="flex mt-3 md:mt-1 items-center gap-7">
              <Image
                unoptimized
                src="/img/PCI.svg"
                alt="Card Image"
                width={80}
                height={70}
                className="w-32 md:w-40"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={loadingTicket ? "inline-block" : "hidden"}>
        <LoadingAnim src="https://lottie.host/2c5f5274-d9b0-4448-9134-367b5aceea64/uApKyr9qkP.lottie"></LoadingAnim>
      </div>
    </>
  );
};

export default CreditCardForm;
