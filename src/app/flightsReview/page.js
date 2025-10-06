"use client";
import React, { useState } from "react";
import { Form, Select, Steps, Tooltip } from "antd";
import { useEffect } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "@/app/flightsReview/page.css";
import { Modal, Button } from "antd";
import { RiFlightTakeoffFill } from "react-icons/ri";
import { useSearchParams } from "next/navigation";
import {
  MdFlightLand,
  MdOutlineConnectingAirports,
  MdPayment,
} from "react-icons/md";
import Image from "next/image";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Printer } from "lucide-react";
import { IoIosPerson } from "react-icons/io";
import { GiConfirmed } from "react-icons/gi";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { formatTime } from "@/utils/formatTime";
import { useFlightsReviewData } from "@/utils/getReviewFlightsData";
import FlightSeatMap from "@/app/component/(ThirdPageComponents)/FlightSeatMap/flightSeatMap";
import CreditCardForm from "../component/(ThirdPageComponents)/CreditCardForm/CreditCardForm";
import Card from "../component/(FirstPageComponents)/HeroSectionCard/Card";
import MealSelection from "../component/(ThirdPageComponents)/MealSelection/MealSelection";
import FlightReviewCard from "../component/(ThirdPageComponents)/FlightReviewCard/FlightReviewCard";
import GetTicketCompo from "../component/(ThirdPageComponents)/GetTicket/GetTicket";
import ContactForm from "../component/(ThirdPageComponents)/ContactForm/ContactForm";
import {
  extractBaggageAllowance,
  extractFlightSegments,
  extractPriceDetails,
} from "@/utils/flightReviewUtility";
import { convertMinutesToHours } from "@/utils/convertMinutesToHours";
import { useTravelersID } from "@/utils/getTravelersId";
import { useGetTicket } from "@/utils/getTicket";
import { getCountries } from "@/utils/getCountries";
import { useSignInContext } from "@/providers/SignInStateProvider";
import { getCity } from "@/utils/getCity";
import useAirports from "@/hooks/useAirports";
import { useGetReservation } from "@/utils/getReservation";
const { Step } = Steps;

const Page = () => {
  // let flightsReviewDataJSON = [];
    //const UI_URI = process.env.NEXT_PUBLIC_UI_URI;
  const [flightsReviewDataJSON, setFlightsReviewDataJSON] = useState([]);
  const [flightsReviewJsonFinal, setFlightsReviewJsonFinal] = useState([]);
  const [generatePDFBase64, setGeneratedPDFBase64] = useState(null);
  const { data, GetReservation, loadingReservation, error } =
    useGetReservation();
  const searchParams = useSearchParams();
  const [cities, setCities] = useState(null);
  const { userId, searchCurrencyCode } = useSignInContext();
  const [reactToPrintFn, setReactToPrintFn] = useState(null);
  const [airports, setAirports] = useState([]);
  const { data: AirportData } = useAirports("none");
  const [currency, setCurrency] = useState("PKR");
  const [priceStructure, setPriceStructure] = useState({});
  const [flightReviewData, setFlightReviewData] = useState(null);
  const [travelersData, setTravelersData] = useState({});
  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [flightSegments, setFlightSegments] = useState([]);
  const [baggageAllowance, setBaggageAllowance] = useState([]);
  const [priceDetails, setPriceDetails] = useState([]);
  const [seatMapOpen, setSeatMapOpen] = useState(false);
  const [confirmSeatMapLoading, setConfirmSeatMapLoading] = useState(false);
  const [seatMapModalLayout, setSeatMapModalLayout] = useState("");
  const [mealOpen, setMealOpen] = useState(false);
  const [confirmMealLoading, setConfirmMealLoading] = useState(false);
  const [mealModalLayout, setMealModalLayout] = useState("");
  const [confirmDisabilityLoading, setConfirmDisabilityLoading] =
    useState(false);
  const [disabilityModalLayout, setDisabilityModalLayout] = useState("");
  const [disabilityOpen, setDisabilityOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [showFlightDetails, setShowFlightDetails] = useState(false);
  const [showWarnings, setShowWarnings] = useState(true);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  // TAC = Terms and Conditions
  const [TAC, setTAC] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    state: "",
    postalCode: "",
    phone: "",
    currencyInfo: "",
    priceInfo: "",
    email: "",
    address: "",
  });
  const [makeFormAPICall, setMakeFormAPICall] = useState(false);
  const [makeTicketAPICall, setMakeTicketAPICall] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [flightLegs, setFlightLegs] = useState([]);
  const [countries, setCountries] = useState([]);
  const [COptions, setCOptions] = useState([]);
  // CAF options:
  const [selectBefore, setSelectBefore] = useState();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [TicketResponse, setTicketResponse] = useState(null);
  const router = useRouter();
  const { Option } = Select;
  const [form] = Form.useForm();
  const { getFlightsReviewData, loading } = useFlightsReviewData(); // API data extraction
  const {
    getTravelerIds,
    error: travelersError,
    loadingTravelersId,
  } = useTravelersID(); // API data extraction
  const { GetTicket, loadingTicket } = useGetTicket();

  const nextStep = () => {
    let checkCurrentStage = sessionStorage.getItem("currentStage");
    if (!!checkCurrentStage) sessionStorage.removeItem("currentStage");
    setCurrentStep((prev) => {
      if (prev === 0) {
        setShowWarnings(true);
      }
      return Math.min(prev + 1, 4);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setCurrentStep((prev) => {
      return Math.max(prev - 1, 0);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getFLegsTimelineArray = (depLoc, arrLoc) => {
    const letFLegObject = flightLegs.find(
      (fLeg) =>
        fLeg[0].Departure.location === depLoc &&
        fLeg[fLeg.length - 1].Arrival.location === arrLoc
    );
    const myfLegsTimelineArray =
      letFLegObject &&
      letFLegObject.map((segment, index) => {
        const departureItem = {
          children: (
            <div className="parentTimelineItems relative" key={index}>
              <div className="w-full">
                <div className="left min-h-6">
                  <div className="font-bold text-xs lg:text-lg">
                    {formatTime(segment?.Departure.time)}{" "}
                    <span className="text-blue-600">
                      {segment?.Departure.location}
                    </span>{" "}
                    <span className="font-normal lg:w-36">
                      {segment?.Departure.locationDescription}
                    </span>
                  </div>
                </div>
                <div className="right absolute right-3 top-0 flex flex-col gap-y-3">
                  <div className="font-bold text-md flex items-end flex-col gap-y-2">
                    <Image
                      unoptimized
                      alt="Logo"
                      src={`/img/AirlineLogo/${segment && segment.carrier}.png`}
                      width={95}
                      height={95}
                    />
                    <span>
                      <span className="font-normal text-md font-gotham text-slate-400 ml-3">
                        {segment.carrier}
                      </span>{" "}
                      -{" "}
                      <span className="font-bold text-md font-gotham">
                        {segment.number}
                      </span>
                    </span>
                  </div>
                  <div className="text-gray-600 font-gotham text-sm w-32 text-end">
                    {segment.operatingCarrierName.split("(")[0]}
                  </div>
                </div>
              </div>
            </div>
          ),
          dot: (
            <RiFlightTakeoffFill size={24} color="black"></RiFlightTakeoffFill>
          ),
        };

        const durationItem = {
          children: (
            <div className="text-gray-500 text-lg relative -left-24 min-h-6">
              {convertMinutesToHours(segment?.durationInMinutes)}
            </div>
          ),
          dot: <span></span>,
        };

        const arrivalItem = {
          children: (
            <div className="parentTimelineItems" key={index + "A"}>
              <div className="w-full flex justify-between items-start">
                <div className="left min-h-16">
                  <div className="font-bold text-lg">
                    {formatTime(segment?.Arrival.time)}{" "}
                    <span className="text-blue-600">
                      {segment?.Arrival.location}
                    </span>{" "}
                    <span className="font-normal">
                      {segment?.Arrival.locationDescription}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ),
          dot: <MdFlightLand size={24} color="black"></MdFlightLand>,
        };

        const stopTime = segment.stopTime !== "0" && {
          children: (
            <div className="transit w-full font-bold min-h-16">
              <div className="bg-slate-300 text-black text-lg py-2 px-4">
                Transit {convertMinutesToHours(Number(segment.stopTime))}
              </div>
            </div>
          ),
          dot: <MdOutlineConnectingAirports size={35} color="black" />,
        };

        return [departureItem, durationItem, arrivalItem, stopTime].filter(
          Boolean
        );
      });
    return myfLegsTimelineArray;
  };

  const handleSelect = (title) => {
    setSelectedMeal(title);
  };

  const travelersArray = [
    ...Array.from(
      { length: Number(flightsReviewDataJSON && flightsReviewDataJSON.adults) },
      (_, index) => ({
        Identifier: {
          authority: "Travelport",
          value: "",
        },
        id: `ADT_${index + 1}`,
        type: "Adult",
        passengerTypeCode: "ADT",
      })
    ),
    ...Array.from(
      {
        length: Number(flightsReviewDataJSON && flightsReviewDataJSON.children),
      },
      (_, index) => ({
        Identifier: {
          authority: "Travelport",
          value: "",
        },
        id: `CNN_${index + 1}`,
        type: "Child",
        passengerTypeCode: "CNN",
      })
    ),
    ...Array.from(
      {
        length: Number(flightsReviewDataJSON && flightsReviewDataJSON.infants),
      },
      (_, index) => ({
        Identifier: {
          authority: "Travelport",
          value: "",
        },
        id: `INF_${index + 1}`,
        type: "Infant",
        passengerTypeCode: "INF",
      })
    ),
  ];

  const handleChange = (index, field, value) => {
    setTravelersData((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleFormSubmit = async () => {
    try {
      await form.validateFields();
      if (travelersArray.length === 0) return;

      const firstTravelerData = travelersData[0] || {};
      const contactDetails = {
        countryAccessCode:
          firstTravelerData.countryAccessCode ??
          selectedCountryCode.split("~")[0],
        phoneNumber: firstTravelerData.phoneNumber ?? "",
        email: firstTravelerData.email ?? "",
      };
      const isEmpty = (value) => !value || value.trim() === "";
      
      for (let index = 0; index < travelersArray.length; index++) {
        const travelerData = travelersData[index] || {};
        const requiredFields = [
          travelerData.gender,
          travelerData.birthDate,
          travelerData.givenName,
          travelerData.surname,
          travelerData.docNumber,
          travelerData.expireDate,
          travelerData.issueCountry,
          //travelerData.meal,
          //travelerData.special_service
        ];

        if (requiredFields.some(isEmpty)) {
          toast("Please fill all the fields for each traveler.", {
            duration: 2000,
            style: {
              backgroundColor: "#f8312f",
              color: "#fff",
            },
          });
          return;
        }
      }
      if (
        isEmpty(contactDetails.countryAccessCode) ||
        isEmpty(contactDetails.phoneNumber) ||
        isEmpty(contactDetails.email)
      ) {
        toast("Please fill all the contact information fields.", {
          duration: 2000,
          style: {
            backgroundColor: "#f8312f",
            color: "#fff",
          },
        });
        return;
      }
      setPhone(
        `${contactDetails.countryAccessCode}${contactDetails.phoneNumber}`
      );
      setBillingInfo((prev) => ({
        ...prev,
        phone: `${contactDetails.countryAccessCode}${contactDetails.phoneNumber}`,
      }));
      const jsonOutput = travelersArray.map((traveler, index) => {
        const travelerData = travelersData[index] || {};
        return {
          Traveler: {
            gender: travelerData.gender ?? "Male",
            birthDate: travelerData.birthDate ?? "",
            id: traveler.id,
            specialServiceType: travelerData.special_service,
            specialMealType: travelerData.meal,
            Identifier: {
              authority: "Travelport",
              value: "",
            },
            passengerTypeCode: traveler.passengerTypeCode,
            PersonName: {
              "@type": "PersonNameDetail",
              Prefix: travelerData.prefix ?? "Mr",
              Given: travelerData.givenName ?? "",
              Surname: travelerData.surname ?? "",
            },
            Telephone: [
              {
                "@type": "Telephone",
                countryAccessCode: contactDetails.countryAccessCode ?? "93",
                phoneNumber: contactDetails.phoneNumber,
                id: "4",
                cityCode: "ORD",
                role: "Home",
              },
            ],
            Email: [{ value: contactDetails.email }],
            TravelDocument: [
              {
                "@type": "TravelDocumentDetail",
                docNumber: travelerData.docNumber ?? "",
                Gender: capitalizeFirstLetter(travelerData.gender) ?? "Male",
                birthDate: travelerData.birthDate ?? "",
                docType: "Passport",
                expireDate: travelerData.expireDate ?? "",
                issueCountry: travelerData.issueCountry ?? "",
                birthCountry: travelerData.issueCountry ?? "",
                PersonName: {
                  "@type": "PersonName",
                  Given: travelerData.givenName ?? "",
                  Surname: travelerData.surname ?? "",
                },
              },
            ],
          },
        };
      });

      setFlightsReviewJsonFinal((prev) =>
        JSON.parse(
          JSON.stringify({
            ...prev,
            travelers: jsonOutput,
          })
        )
      );
      setMakeFormAPICall(!makeFormAPICall);
    } catch (error) {
      toast("Invalid data entered.", {
        duration: 3000,
        style: {
          backgroundColor: "#f8312f",
          color: "#fff",
        },
      });
    }
  };

  const handleCreditCardSubmit = () => {
    if (billingInfo.firstName === "") {
      toast.error("Firstname cannot be empty.", {
        duration: 2000,
        style: {
          backgroundColor: "#f8312f",
          color: "#fff",
        },
      });
      return null;
    }
    if (billingInfo.lastName === "") {
      toast.error("Lastname cannot be empty.", {
        duration: 2000,
        style: {
          backgroundColor: "#f8312f",
          color: "#fff",
        },
      });
      return null;
    }
    if (billingInfo.country === "") {
      toast.error("Country cannot be empty.", {
        duration: 2000,
        style: {
          backgroundColor: "#f8312f",
          color: "#fff",
        },
      });
      return null;
    }
    if (billingInfo.addressLine1 === "") {
      toast.error("Billing Address cannot be empty.", {
        duration: 2000,
        style: {
          backgroundColor: "#f8312f",
          color: "#fff",
        },
      });
      return null;
    }
    if (billingInfo.postalCode === "") {
      toast.error("Postal Address cannot be empty.", {
        duration: 2000,
        style: {
          backgroundColor: "#f8312f",
          color: "#fff",
        },
      });
      return null;
    }
    if (billingInfo.phone === "") {
      toast.error("Phone Number cannot be empty.", {
        duration: 2000,
        style: {
          backgroundColor: "#f8312f",
          color: "#fff",
        },
      });
      return null;
    }
    if (billingInfo.email === "") {
      toast.error("Email cannot be empty.", {
        duration: 2000,
        style: {
          backgroundColor: "#f8312f",
          color: "#fff",
        },
      });
      return null;
    }
    let newData = null;
    setFlightsReviewJsonFinal((prev) => {
      newData = {
        ...prev,
        billingInfo,
        UserID: userId,
        ReturnURL: "http://localhost:3000/flightsReview",
      };
      sessionStorage.setItem("UserID", userId);
      sessionStorage.setItem("flightsReviewJsonFinal", JSON.stringify(newData));
      sessionStorage.setItem("currentStage", currentStep + 1);
      return newData;
    });
    if (!TAC) {
      toast.error("Please accept Terms and Conditions to proceed", {
        duration: 2000,
        style: {
          backgroundColor: "#f8312f",
          color: "#fff",
        },
      });
      return null;
    }
    setIsPaymentInitiated(true);
    return newData;
  };

  const showSeatMapModal = () => {
    setSeatMapOpen(true);
  };

  const handleSeatMapOk = () => {
    setConfirmSeatMapLoading(true);
    setTimeout(() => {
      setSeatMapOpen(false);
      setConfirmSeatMapLoading(false);
    }, 2000);
  };

  const handleSeatMapCancel = () => {
    setSeatMapOpen(false);
  };

  const showMealModal = () => {
    setMealOpen(true);
  };

  const handleMealOk = () => {
    setConfirmMealLoading(true);
    setTimeout(() => {
      setMealOpen(false);
      setMealLoading(false);
    }, 2000);
  };

  const handleMealCancel = () => {
    setMealOpen(false);
  };

  const showDisabilityModal = () => {
    setDisabilityOpen(true);
  };

  const handleDisabilityOk = () => {
    setConfirmDisabilityLoading(true);
    setTimeout(() => {
      setDisabilityOpen(false);
      setConfirmDisabilityLoading(false);
    }, 2000);
  };

  const handleDisabilityCancel = () => {
    setDisabilityOpen(false);
  };

  const handleBookAnotherFlight = () => {
    router.push("/");
  };

  useEffect(() => {
    const abortController = new AbortController();
    const getCityData = async () => {
      const data = await getCity();
      setCities(data);
    };
    const getCountriesData = async () => {
      let response = await getCountries();
      setCountries(response);
    };
    getCityData();
    getCountriesData();

  // Initialize currency from global context (SignInStateProvider)
  setCurrency(searchCurrencyCode || sessionStorage.getItem("currency") || "PKR");
    const flightsReviewData =
      sessionStorage.getItem("flightReviewPageData") &&
      sessionStorage.getItem("flightReviewPageData").split("___");
    let flightsReviewDataForParsing =
      flightsReviewData &&
      flightsReviewData.length > 0 &&
      flightsReviewData.reduce((acc, curr, idx) => {
        return idx === 0 ? acc : acc + curr;
      }, "");

    let flightsReviewDataJSON = flightsReviewDataForParsing
      ? JSON.parse(flightsReviewDataForParsing)
      : [];

    let currentStage = sessionStorage.getItem("currentStage");
    let flightsReviewDataJsonSession = JSON.parse(
      sessionStorage.getItem("flightsReviewJsonFinal")
    );
    if (currentStage && flightsReviewDataJsonSession) {
      setCurrentStep(parseInt(currentStage, 10));
      setFlightsReviewJsonFinal(flightsReviewDataJsonSession);
      setMakeTicketAPICall(true);
    }

    const fetchFlightsReviewData = async () => {
      try {
        const response = await getFlightsReviewData(flightsReviewDataJSON);
        const flightReviewDataJsonAPI = await JSON.parse(response);
        setFlightReviewData(JSON.parse(flightReviewDataJsonAPI));
      } catch (error) {
        console.log("Error fecthing review data");
      }
    };

    if (flightsReviewDataJSON.length !== 0 && currentStep === 0) {
      fetchFlightsReviewData();
      setFlightsReviewDataJSON(flightsReviewDataJSON);
      setFlightsReviewJsonFinal(flightsReviewDataJSON);
    }

    return () => {
      abortController.abort();
    };
  }, []);

  // Keep local currency state in sync with global selection
  useEffect(() => {
    if (searchCurrencyCode) setCurrency(searchCurrencyCode);
  }, [searchCurrencyCode]);

  useEffect(() => {
    const resultIndicator = searchParams.get("resultIndicator");
    if (currentStep === 3) {
      if (resultIndicator) {
        if (Object.keys(flightsReviewJsonFinal).length === 0) return;

        // Retrieve PNR from sessionStorage (stored during GetReservation)
        const pnr = sessionStorage.getItem("reservationPNR");
        const wbKey =
          sessionStorage.getItem("WBKey") || flightsReviewJsonFinal.WBKey;
        const userIdStored =
          sessionStorage.getItem("UserID") || flightsReviewJsonFinal.UserID;

        const updatedPayload = {
          PNR: pnr,
          UserId: userIdStored,
          WBKey: wbKey,
          TransactionID: resultIndicator,
        };
        setFlightsReviewJsonFinal(updatedPayload);
        async function fetchTicket() {
          try {
            const response = await GetTicket(updatedPayload);
            const data = JSON.parse(response);
            setTicketResponse(data);
          } catch (error) {
            console.log(error.message);
          } finally {
            // Optional: Clear sessionStorage after use
            sessionStorage.removeItem("reservationPNR");
            sessionStorage.removeItem("WBKey");
            sessionStorage.removeItem("UserID");
          }
        }
        fetchTicket();
      }
    }
  }, [currentStep, searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setAirports(AirportData);
    };
    fetchData();
  }, [AirportData]);

  useEffect(() => {
    let flightSegments = extractFlightSegments(flightReviewData);
    setFlightSegments(flightSegments && flightSegments[0]);
    let baggageAllowance = extractBaggageAllowance(flightReviewData);
    setBaggageAllowance(baggageAllowance);
    let priceDetails = extractPriceDetails(flightReviewData);
    setPriceDetails(priceDetails);
    setPriceStructure(
      flightReviewData?.OfferListResponse?.OfferID?.[0]?.priceStructure
    );
  }, [flightReviewData]); // Data extraction

  useEffect(() => {
    if (flightSegments) {
      setFlightLegs((prevLegs) => [
        ...prevLegs,
        ...flightSegments.map((fSegment) =>
          fSegment.Segments.map((fs) => {
            let myFlight = fs.Flight;
            let stopTime = fs.connectionDurationInMinutes;
            let productId = fSegment.productId;
            return { ...myFlight, stopTime, productId };
          })
        ),
      ]);
    }
    return () => setFlightLegs([]);
  }, [flightSegments]);

  useEffect(() => {
    if (countries) {
      const COption = countries.map((CAF, idx) => {
        return {
          label: CAF.tpCC_COUNTRY,
          value: `${CAF?.tpCC_TERRITORY_CODE ? CAF?.tpCC_TERRITORY_CODE : 93}`,
          countryCode: CAF?.tpCC_TERRITORY_CODE ? CAF?.tpCC_TERRITORY_CODE : 93,
        };
      });
      setCOptions(COption);
    }
  }, [countries]);

  useEffect(() => {
    if (COptions) {
      setSelectBefore(
        <Select
          onSelect={(value) => {
            setSelectedCountryCode(value);
          }}
          value={selectedCountryCode ? selectedCountryCode : COptions[0]?.value}
          dropdownStyle={{ width: "100px" }}
          style={{ minWidth: "90px" }}
          className="w-full h-14 md:h-14 !rounded-l-lg text-sm focus:outline-none focus:ring-0"
        >
          {COptions.sort((a, b) => a.value - b.value).map((option, idx) => (
            <Option key={idx} value={option.value}>
              <div className="flex items-center">
                {/* <Image src={option.flag} alt="flag" width={15} height={15} /> */}
                {/* &nbsp;+{option.value.split("~")[0]} */}+{option.value}
              </div>
            </Option>
          ))}
        </Select>
      );
    }
  }, [countries, selectedCountryCode]);

  useEffect(() => {
    if (currentStep == 1 && flightsReviewJsonFinal.travelers) {
      async function TravelID() {
        try {
          const response = await getTravelerIds(flightsReviewJsonFinal);

          let ids = JSON.parse(response);
          let idsArray = typeof ids === "string" ? JSON.parse(ids) : ids;
          let travelDataIssues =
            idsArray?.OfferListResponse?.Result?.Error?.length > 0
              ? "Show Error"
              : idsArray.filter((item) => item.Value?.includes("Error"));
          if (
            travelDataIssues.length > 0 &&
            (travelDataIssues === "Show Error" ||
              travelDataIssues?.[0]?.Value.includes("Error"))
          ) {
            if (travelDataIssues === "Show Error") {
              toast(idsArray?.OfferListResponse?.Result?.Error?.[0]?.Message, {
                duration: 4000,
                style: {
                  backgroundColor: "#f8312f",
                  color: "#fff",
                },
              });
            } else if (travelDataIssues?.[0]?.Value.includes("Error")) {
              travelDataIssues?.forEach((item) => {
                toast(item.Value, {
                  duration: 4000,
                  style: {
                    backgroundColor: "#f8312f",
                    color: "#fff",
                  },
                });
              });
            }
            return;
          }
          const updatedTravelers = flightsReviewJsonFinal.travelers.map(
            (traveler) => {
              const matching = idsArray.find(
                (item) => item.Key === traveler.Traveler.id
              );
              return matching
                ? {
                    ...traveler,
                    Traveler: {
                      ...traveler.Traveler,
                      Identifier: {
                        ...traveler.Traveler.Identifier,
                        value: matching?.Value || "",
                      },
                    },
                  }
                : traveler;
            }
          );

          // Extract wbKey and store in sessionStorage
          const wbKey = idsArray?.find((item) => item.Key == "WBKey")?.Value;
          sessionStorage.setItem("WBKey", wbKey);

          // Updated state setting (this is the snippet you provided)
          const newFinal = JSON.parse(
            JSON.stringify({
              ...flightsReviewJsonFinal,
              travelers: updatedTravelers,
              WBKey: wbKey,
            })
          );
          setFlightsReviewJsonFinal(newFinal);

          nextStep();
        } catch (error) {
          toast.error("Service unavailable", {
            duration: 2000,
            style: {
              backgroundColor: "#f8312f",
              color: "#fff",
            },
          });
        }
      }
      TravelID();
    }
  }, [makeFormAPICall]);

  useEffect(() => {
    let seatMapLayout = (
      <table className="w-full m-auto mt-16">
        <thead className="Travelers">
          <tr className=" w-full">
            <th
              className="text-md"
              style={{ fontFamily: "Gotham", fontWeight: 500 }}
            >
              Travelers
            </th>
            <th
              className="text-md w-[50%]"
              style={{ fontFamily: "Gotham", fontWeight: 500 }}
            >
              Seat Map
            </th>
            <th
              className="text-md"
              style={{ fontFamily: "Gotham", fontWeight: 500 }}
            >
              Seat Description
            </th>
          </tr>
        </thead>
        <tbody className="SeatMap">
          {flightsReviewJsonFinal &&
            flightsReviewJsonFinal.travelers &&
            flightsReviewJsonFinal.travelers.map((traveler, idx) => {
              return (
                <tr key={idx} className="">
                  <td
                    style={{ fontFamily: "Gotham", fontWeight: 300 }}
                    className="text-center"
                  >
                    {traveler.Traveler.PersonName.Given}
                  </td>
                  <td className="w-[50%]">
                    <FlightSeatMap />
                  </td>
                  <td className="text-center">Lahore</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
    let mealLayout = (
      <>
        <div className="flex">
          <div className="h-14 mx-auto w-3/4 mb-5 rounded bg-orange-500 font-bold text-lg p-3 text-center text-white">
            {selectedMeal
              ? `Selected Meal: selectedMeal`
              : "Please select a Complementry Meal"}
          </div>
        </div>
        {/* // Show Selected Meal */}
        <div className="parent_div">
          <div className="grid grid-cols-3 w-3/4 mx-auto gap-6 gap-x-6 mb-5">
            <MealSelection
              Title="Chicken Biryani"
              ToolTip="Baby Meal"
              isSelected={selectedMeal === "Baby"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Child"
              ToolTip="Children Meal"
              isSelected={selectedMeal === "Child"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Diabetic"
              ToolTip="Diabetic Meal"
              isSelected={selectedMeal === "Diabetic"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Fruit Platter"
              ToolTip="Seasonal fresh fruit"
              isSelected={selectedMeal === "Fruit Platter"}
              onSelect={handleSelect}
            />
          </div>

          {/* <div className="flex w-3/4 mx-auto gap-2 mb-5">
            <MealSelection
              Title="Kosher"
              ToolTip="Jewish Kosher Meal"
              isSelected={selectedMeal === "Kosher"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Low Calories"
              ToolTip="Low-Calorie Meal"
              isSelected={selectedMeal === "Low Calories"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Low Fat"
              ToolTip="Low Fat Meal"
              isSelected={selectedMeal === "Low Fat"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Low Salt"
              ToolTip="Low Salt Meal"
              isSelected={selectedMeal === "Low Salt"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Muslim"
              ToolTip="Muslim Meal"
              isSelected={selectedMeal === "Muslim"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Non-Lactos"
              ToolTip="Meal Without Dairy Products"
              isSelected={selectedMeal === "Non-Lactos"}
              onSelect={handleSelect}
            />
          </div>

          <div className="flex w-3/4 mx-auto gap-2 mb-5">
            <MealSelection
              Title="Sea Food"
              ToolTip="Seafood Meal"
              isSelected={selectedMeal === "Sea Food"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Vegan"
              ToolTip="Vegetarian Vegan Meal"
              isSelected={selectedMeal === "Vegan"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Veg Hindu"
              ToolTip="Asian Vegetarian Meal"
              isSelected={selectedMeal === "Veg Hindu"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Veg Lacto Ovo"
              ToolTip="Vegetarian Lacto-Ovo Meal"
              isSelected={selectedMeal === "Veg Lacto Ovo"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Veg Oriental"
              ToolTip="Vegetarian Oriental Meal"
              isSelected={selectedMeal === "Veg Oriental"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Veg Raw"
              ToolTip="Raw Vegetables and Salads"
              isSelected={selectedMeal === "Veg Raw"}
              onSelect={handleSelect}
            />
          </div> */}
        </div>
      </>
    );
    let disabilityLayout = (
      <>
        <div className="flex">
          <div className="h-14 mx-auto w-3/4 mb-5 rounded bg-orange-500 font-bold text-lg p-3 text-center text-white">
            {selectedMeal
              ? `Selected Meal: selectedMeal`
              : "Please select a Complementry Meal"}
          </div>
        </div>
        {/* // Show Selected Meal */}
        <div className="parent_div">
          <div className="flex w-3/4 mx-auto gap-2 mb-5">
            <MealSelection
              Title="Baby"
              ToolTip="Baby Meal"
              isSelected={selectedMeal === "Baby"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Child"
              ToolTip="Children Meal"
              isSelected={selectedMeal === "Child"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Diabetic"
              ToolTip="Diabetic Meal"
              isSelected={selectedMeal === "Diabetic"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Fruit Platter"
              ToolTip="Seasonal fresh fruit"
              isSelected={selectedMeal === "Fruit Platter"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Hindu"
              ToolTip="Hindu Non-Vegetarian Meal"
              isSelected={selectedMeal === "Hindu"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Jain"
              ToolTip="Vegetarian Jain Meal"
              isSelected={selectedMeal === "Jain"}
              onSelect={handleSelect}
            />
          </div>
          <div className="flex w-3/4 mx-auto gap-2 mb-5">
            <MealSelection
              Title="Kosher"
              ToolTip="Jewish Kosher Meal"
              isSelected={selectedMeal === "Kosher"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Low Calories"
              ToolTip="Low-Calorie Meal"
              isSelected={selectedMeal === "Low Calories"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Low Fat"
              ToolTip="Low Fat Meal"
              isSelected={selectedMeal === "Low Fat"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Low Salt"
              ToolTip="Low Salt Meal"
              isSelected={selectedMeal === "Low Salt"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Muslim"
              ToolTip="Muslim Meal"
              isSelected={selectedMeal === "Muslim"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Non-Lactos"
              ToolTip="Meal Without Dairy Products"
              isSelected={selectedMeal === "Non-Lactos"}
              onSelect={handleSelect}
            />
          </div>

          <div className="flex w-3/4 mx-auto gap-2 mb-5">
            <MealSelection
              Title="Sea Food"
              ToolTip="Seafood Meal"
              isSelected={selectedMeal === "Sea Food"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Vegan"
              ToolTip="Vegetarian Vegan Meal"
              isSelected={selectedMeal === "Vegan"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Veg Hindu"
              ToolTip="Asian Vegetarian Meal"
              isSelected={selectedMeal === "Veg Hindu"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Veg Lacto Ovo"
              ToolTip="Vegetarian Lacto-Ovo Meal"
              isSelected={selectedMeal === "Veg Lacto Ovo"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Veg Oriental"
              ToolTip="Vegetarian Oriental Meal"
              isSelected={selectedMeal === "Veg Oriental"}
              onSelect={handleSelect}
            />
            <MealSelection
              Title="Veg Raw"
              ToolTip="Raw Vegetables and Salads"
              isSelected={selectedMeal === "Veg Raw"}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </>
    );
    if (seatMapLayout) setSeatMapModalLayout(seatMapLayout);
    if (mealLayout) setMealModalLayout(mealLayout);
    if (disabilityLayout) setDisabilityModalLayout(disabilityLayout);
  }, [flightsReviewJsonFinal]);

  useEffect(() => {
    const abortController = new AbortController();
    async function GetTicketResponse() {
      setMakeTicketAPICall(false);
      try {
        const response = await GetTicket(flightsReviewJsonFinal);
        const data = JSON.parse(response);
        setTicketResponse(data);
        nextStep();
      } catch (error) {
        console.log(error.message);
      }
    }
    if (makeTicketAPICall && currentStep !== 0 && currentStep !== 3)
      GetTicketResponse();
    return () => {
      abortController.abort();
    };
  }, [makeTicketAPICall]);

  useEffect(() => {
    const shouldLockScroll =
      loadingTravelersId || loadingTicket || showFlightDetails;

    if (shouldLockScroll) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [loadingTravelersId, loadingTicket, showFlightDetails]);

  // useEffect(() => {
  //   const abortController = new AbortController();
  //   const fetchData = async () => {
  //     try {
  //       const response = await getFlightsReviewData(
  //         flightsReviewDataJSON && flightsReviewDataJSON
  //       );
  //       const flightReviewDataJsonAPI = await JSON.parse(response);
  //       setFlightReviewData(JSON.parse(flightReviewDataJsonAPI));
  //     } catch (error) {
  //       console.log("Error fecthing review data");
  //     }
  //   };
  //   if (flightsReviewDataJSON.length !== 0) {
  //     fetchData();
  //   }
  //   return () => {
  //     abortController.abort();
  //   };
  // }, [flightsReviewDataJSON.length]);

  // BREAK

  // useEffect(() => {
  //   const abortController = new AbortController();
  //   async function countries() {
  //     let response = await getCountries();
  //     setCountries(response);
  //   }
  //   countries();
  //   return () => {
  //     abortController.abort();
  //   };
  // }, []);

  // console.log("flightsReview was rendered");
  return (
    <>
      <div
        className="overflow-x-hidden"
        // onClick={() =>
        //   console.log("flightreviewData: ", flightsReviewJsonFinal)
        // }
      >
        <div className="pt-4 w-full max-w-full lg:w-[70%] sm:my-5 mx-auto font-gotham px-4">
          <Steps
            current={currentStep}
            labelPlacement="vertical"
            responsive
            direction="horizontal"
            className="flex gap-2 flex-wrap max-w-full"
          >
            <Step
              title={
                <span
                  className={`font-gotham text-light text-sm flex items-center gap-x-2 ${
                    currentStep === 0 ? "text-blue-500" : "text-slate-500"
                  }`}
                  onClick={()=>{
                    console.log(priceStructure)
                  }}
                >
                  <RiFlightTakeoffFill className="text-base" /> Flights
                </span>
              }
              status={currentStep > 0 ? "finish" : "process"}
            />
            <Step
              title={
                <span
                  className={`font-gotham text-light flex items-center gap-x-2 text-sm ${
                    currentStep === 1 ? "text-blue-500" : "text-slate-500"
                  }`}
                >
                  <IoIosPerson className="text-base" /> Passengers
                </span>
              }
              status={
                currentStep > 1
                  ? "finish"
                  : currentStep === 1
                  ? "process"
                  : "wait"
              }
            />
            <Step
              title={
                <span
                  className={`font-gotham text-light text-sm flex items-center gap-x-2`}
                  onClick={() => console.log("currentStep: ", currentStep)}
                >
                  <MdPayment className="text-base" /> Payment
                </span>
              }
              status={
                currentStep === 2
                  ? "process"
                  : currentStep > 2
                  ? "finish"
                  : "wait"
              }
              description=""
            />
            <Step
              title={
                <span
                  className={`font-gotham text-light text-sm flex items-center gap-x-2`}
                  onClick={() =>
                    console.log("flightreviewData: ", flightsReviewJsonFinal)
                  }
                >
                  <GiConfirmed className="text-base" /> Confirm
                </span>
              }
              status={
                currentStep === 3
                  ? "process"
                  : currentStep > 3
                  ? "finish"
                  : "wait"
              }
              description=""
            />
          </Steps>
        </div>
        <div className={`${currentStep === 0 ? "block" : "hidden"}`}>
          {flightLegs && flightLegs.length > 0 ? (
            <FlightReviewCard
              priceStructure={priceStructure}
              currency={currency}
              showFlightDetails={showFlightDetails}
              setShowFlightDetails={setShowFlightDetails}
              loading={loading}
              flightReviewData={flightReviewData}
              flightLegs={flightLegs}
              flattenedDepartingItems={getFLegsTimelineArray}
              baggageAllowance={baggageAllowance}
              priceDetails={priceDetails}
              Airports={airports}
              currentStep={currentStep}
              prevStep={prevStep}
              nextStep={nextStep}
              searchCurrencyCode={searchCurrencyCode}
            />
          ) : null}
          {loading ? (
            <div className="loading min-h-52 flex items-center justify-center">
              <div className="min-w-[32rem]">
                <DotLottieReact
                  src="https://lottie.host/48d9afe0-2a91-4613-821d-a50977ca8c85/t4tK9PM1IR.lottie"
                  loop
                  autoplay
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          ) : flightsReviewDataJSON.length === 0 ? (
            <div className="w-full h-full py-10 flex items-center justify-center">
              <p className="font-gotham font-bold">No Data was found</p>
            </div>
          ) : null}
          {!loading && flightLegs && flightLegs.length === 0 ? (
            <div className="loading min-h-56 flex items-center justify-center">
              <p className="block text-[#656565] font-gotham font-normal">
                {flightReviewData?.OfferListResponse?.Result?.Error &&
                  flightReviewData?.OfferListResponse?.Result?.Error[0].Message}
              </p>
            </div>
          ) : null}
        </div>
        <div
          className={`${
            currentStep === 1 ? "flex" : "hidden"
          } lg:px-9 mt-20 flex-col gap-5`}
        >
          <ContactForm
            travelersArray={travelersArray}
            handleChange={handleChange}
            travelersData={travelersData}
            CAFOptions={COptions}
            selectBefore={selectBefore}
            setSelectedCountryCode={setSelectedCountryCode}
            selectedCountryCode={selectedCountryCode}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setCountry={setCountry}
            setPhone={setPhone}
            setEmail={setEmail}
            setBillingInfo={setBillingInfo}
            billingInfo={billingInfo}
            form={form}
            loadingTravelersId={loadingTravelersId}
            flightCriteria={flightsReviewJsonFinal?.flightCriteria}
          ></ContactForm>
        </div>
        <div className={`hidden p-4 {currentStep === 2 ? "block" : "hidden"}`}>
          <div className="optionsPart w-full px-10 pt-16">
            <h2 className="text-4xl pl-3 font-gotham font-normal hidden">
              Enhance your travel experience
            </h2>
            <div className="cardsPart grid grid-cols-4 justify-center items-center gap-5">
              <div className="cursor-pointer" onClick={showSeatMapModal}>
                <Card
                  Title="Select Seat"
                  Fare="Fares Starting PKR 233,434/-"
                  Image="/img/FirstImg.jpg"
                  cardWidth="w-full"
                />
              </div>
              <div className="cursor-pointer" onClick={showMealModal}>
                <Card
                  Title="Select Meal"
                  Fare="Fares Starting PKR 233,434/-"
                  Image="/img/FirstImg.jpg"
                  cardWidth="w-full"
                />
              </div>
              <div className="cursor-pointer" onClick={showDisabilityModal}>
                <Card
                  Title="Special disability services"
                  Fare="Fares Starting PKR 233,434/-"
                  Image="/img/FirstImg.jpg"
                  cardWidth="w-full"
                />
              </div>
            </div>
          </div>
          {/* FlightSeatMap */}
          <Modal
            title="Select Your Seat"
            open={seatMapOpen}
            onOk={handleSeatMapOk}
            loading={confirmSeatMapLoading}
            width={"90%"}
            onCancel={handleSeatMapCancel}
          >
            <div>{seatMapModalLayout}</div>
          </Modal>
          {/* <Meal Options /> */}
          <Modal
            title="Select Your Meal"
            open={mealOpen}
            onOk={handleMealOk}
            loading={confirmMealLoading}
            width={"90%"}
            onCancel={handleMealCancel}
          >
            <div>{mealModalLayout}</div>
          </Modal>
          <Modal
            title="Select Your Disability Service"
            open={disabilityOpen}
            onOk={handleDisabilityOk}
            loading={confirmDisabilityLoading}
            width={"90%"}
            onCancel={handleDisabilityCancel}
          >
            <div>{disabilityModalLayout}</div>
          </Modal>
          <Modal
            title="Select Your Disability Service"
            open={disabilityOpen}
            onOk={handleDisabilityOk}
            loading={confirmDisabilityLoading}
            width={"90%"}
            onCancel={handleDisabilityCancel}
          >
            <div>{disabilityModalLayout}</div>
          </Modal>
        </div>
        <div className={`p-4 ${currentStep === 2 ? "block" : "hidden"}`}>
          <CreditCardForm
            isPaymentInitiated={isPaymentInitiated}
            flightsReviewJsonFinal={flightsReviewJsonFinal}
            handleCreditCardSubmit={handleCreditCardSubmit}
            priceStructure={priceStructure}
            currency={currency}
            currentStep={currentStep}
            GetReservation={GetReservation}
            loadingTicket={loadingTicket}
            flightsReviewData={flightReviewData}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            billingAddress={billingAddress}
            setBillingAddress={setBillingAddress}
            cardDetails={cardDetails}
            setCardDetails={setCardDetails}
            postalCode={postalCode}
            setPostalCode={setPostalCode}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            billingInfo={billingInfo}
            setBillingInfo={setBillingInfo}
            COptions={COptions}
            TAC={TAC}
            setTAC={setTAC}
            cities={cities}
            CAFOptions={COptions}
          ></CreditCardForm>
        </div>
        <div
          className={`p-4 ${
            currentStep === 3
              ? "block overflow-x-scroll lg:overflow-x-auto"
              : "hidden"
          }`}
        >
          <div className="tickerContainer w-full lg:w-9/12 block mx-auto overflow-x-scroll lg:overflow-x-auto">
            <GetTicketCompo
              TicketResponse={TicketResponse}
              setReactToPrintFn={setReactToPrintFn}
              setGeneratedPDFBase64={setGeneratedPDFBase64}
              priceStructure={priceStructure}
              onPdfBase64Ready={(base64) => {
                // console.log("base64: ", base64);
              }}
            ></GetTicketCompo>
          </div>
        </div>
        {/* Button */}
        <div
          className={`button w-full ${
            currentStep === 0 ? "hidden" : "flex"
          } items-center justify-center flex-col md:flex-row gap-y-2 md:gap-5 mb-11 mt-14 lg:mt-20 font-gotham`}
        >
          <Button
            className={`${
              currentStep > 0 ? "!inline-flex" : "!hidden"
            } !py-2 !h-10 !rounded !items-center !justify-center !text-xs md:!text-sm !bg-white !text-orange-500 !border-2 !border-orange-500 !font-bold !cursor-pointer !font-gotham`}
            onClick={
              currentStep === 3 && !!reactToPrintFn
                ? () => {
                    reactToPrintFn?.();
                  }
                : prevStep
            }
          >
            {currentStep === 3 ? (
              <div className="flex items-center">
                <Printer className="w-4 h-4 mr-2" />
                Print this ticket
              </div>
            ) : (
              "Move to Previous Step"
            )}
          </Button>
          <Tooltip
            title={
              currentStep == 0 &&
              flightReviewData?.OfferListResponse?.Result?.Error &&
              flightReviewData?.OfferListResponse?.Result?.Error[0]?.Message &&
              "Please select your flight again"
            }
          >
            {/* <div className="flex gap-2 flex-wrap w-full items-center justify-center button-flight-section"> */}
            <Button
              className={`
                ${
                  flightReviewData?.OfferListResponse?.Result?.Error?.[0]
                    ?.Message || currentStep === 0
                    ? "!inline-flex"
                    : "!hidden"
                }
                !items-center !justify-center !py-2 md:!py-5 !align-middle !rounded 
                ${
                  flightReviewData?.OfferListResponse?.Result?.Error?.[0]
                    ?.Message
                    ? "!bg-orange-500 !text-white"
                    : "!bg-white !text-orange-500 !border-2 !border-orange-500"
                } !cursor-pointer !font-gotham !font-bold bookFlightAgain mr-4
                 `}
              onClick={() => router.push("/")}
            >
              Book your flight again
            </Button>
            <Button
              // loading={isLoading}
              className={`${
                flightReviewData?.OfferListResponse?.Result?.Error?.[0]?.Message
                  ? "!hidden"
                  : "!inline-flex"
              } ${currentStep === 2?"!hidden":"!inline-flex"} !items-center !justify-center !py-2 md:!py-5 !text-xs md:!text-sm !align-middle !rounded !bg-orange-500 !text-white !font-bold !cursor-pointer hover:!border-2 !font-gotham`}
              disabled={
                flightReviewData?.OfferListResponse?.Result?.Error &&
                flightReviewData?.OfferListResponse?.Result?.Error[0]?.Message
              }
              onClick={
                currentStep === 1
                  ? handleFormSubmit
                  : currentStep === 2
                  ? handleCreditCardSubmit
                  : currentStep === 3
                  ? handleBookAnotherFlight
                  : nextStep
              }
            >
              {currentStep === 0
                ? "Continue to Passenger"
                : currentStep === 1
                ? "Continue to Payment"
                : currentStep === 3 && "Book another flight"}
            </Button>
            {/* </div> */}
          </Tooltip>
          <Toaster
            toastOptions={{
              success: {
                iconTheme: {
                  primary: "green",
                  secondary: "black",
                },
              },
            }}
          ></Toaster>
        </div>
      </div>
      {currentStep === 1 && showWarnings && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-[1500]">
          <div className="max-w-[60%] lg:min-w-[50%] sm:py-10 p-5 sm:px-10 rounded bg-white flex flex-col gap-y-4">
            <div>
              <h2 className="font-gotham font-bold text-base sm:text-2xl whitespace-nowrap">
                Important Notice
              </h2>
              <ul className="list-disc pl-5 mt-4">
                <li className="font-gotham font-light text-sm sm:text-base text-justify">
                  Flight Price is not guaranteed until ticket is booked.
                </li>
                <li className="font-gotham font-light text-sm sm:text-base text-justify">
                  Traveler&apos;s names must match with government issued travel
                  document.
                </li>
              </ul>
            </div>
            <button
              className="mt-2 sm:mt-4 sm:px-4 p-1 sm:py-2 bg-orange-500 text-white rounded cursor-pointer w-fit text-end font-gotham font-light"
              onClick={() => setShowWarnings(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default Page;
