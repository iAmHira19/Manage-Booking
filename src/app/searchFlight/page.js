"use client";
import React, { useEffect, useMemo, useState } from "react";
import FlightCard from "@/app/component/(SecondPageComponents)/FlightCard/FlightCard";
import Filterbox from "@/app/component/(SecondPageComponents)/Filters/FilterBox/Filterbox";
import FilterTabs from "@/app/component/(SecondPageComponents)/FilterTabs/FilterTabs";
import { components } from "@/constants/components";
import { FaLocationDot, FaPersonWalkingLuggage } from "react-icons/fa6";
import { RiArrowDropDownLine, RiCloseLine } from "react-icons/ri";
import { RxCross1, RxCrossCircled } from "react-icons/rx";
import { SlCalender } from "react-icons/sl";
import { FaSearch } from "react-icons/fa";
import { DatePicker } from "antd";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useOneWayApi } from "@/utils/getOneWayapi";
import { useSecondLegApi } from "@/utils/getSecondLegApi";
import useAirline from "@/hooks/useAirline";
import useAirports from "@/hooks/useAirports";
import dayjs from "dayjs";
import { updateCookie } from "@/utils/cookieManager";
import { useCookiesContext } from "@/providers/CookieProvider";
import { v4 as uuidv4, v4 } from "uuid";
import styles from "@/app/searchFlight/page.module.css";
import { useSignInContext } from "@/providers/SignInStateProvider";
import "./page.css";
// handlers
import toast, { Toaster } from "react-hot-toast";
import { IoFilterOutline } from "react-icons/io5";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { IoIosArrowUp } from "react-icons/io";

const Page = () => {
  const { RangePicker } = DatePicker;
  const { MiniButton, Travel, TravelersCompo, ClassCompo, InputBoxText } =
    components;
  const { searchCurrencyCode, exchangeRate } = useSignInContext();
  // const [showFlightDetails, setShowFlightDetails] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showMiniFilters, setShowMiniFilters] = useState(false);
  const [usersSelectedPrice, setUsersSelectedPrice] = useState(0);
  const [oneWayApi, setOneWayAPI] = useState(null);
  const [secondLegApi, setSecondLegApi] = useState(null);
  const [reRender, setReRender] = useState(false);
  const { getOneWayApi, loading } = useOneWayApi();
  const { getSecondLegApi, loadingSecondLeg } = useSecondLegApi();
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [selectedFilterTab, setSelectedFilterTab] = useState("");
  const { data: AirportData } = useAirports("none");
  const { data: AirlineData } = useAirline();

  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  const [userData, setUserData] = useState("");
  useEffect(() => {
    isClientLoaded &&
      sessionStorage.getItem("flightReviewPageData") &&
      sessionStorage.removeItem("flightReviewPageData");
    let searchPageData =
      isClientLoaded && sessionStorage.getItem("searchPageData").split("___");
    isClientLoaded &&
      sessionStorage.getItem("currentStage") &&
      sessionStorage.removeItem("currentStage");
    const searchPageDataString =
      searchPageData && searchPageData.length > 0
        ? searchPageData.reduce((acc, curr, idx) => {
            return idx === 0 ? acc : acc + curr;
          }, "")
        : [];
    try {
      const userData = searchPageDataString
        ? JSON.parse(searchPageDataString)
        : [];
      setUserData(userData);
    } catch (error) {
      console.log("Error while parsing userData");
    }
  }, [isClientLoaded]);

  // Setting up states
  const [isOneWay, setIsOneWay] = useState("");
  const [isReturn, setIsReturn] = useState("");
  const [isMultiCity, setIsMultiCity] = useState("");
  const [isEnableTravel, setIsEnableTravel] = useState(null);
  const [isEnableEconomy, setIsEnableEconomy] = useState(null);
  const [economy, setEconomy] = useState("");
  const [premiumEconomy, setPremiumEconomy] = useState("");
  const [first, setFirst] = useState("");
  const [business, setBusiness] = useState("");
  const [isNoPreference, setIsNoPreference] = useState();
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");
  const [infants, setInfants] = useState("");
  const [arrivingLocation, setArrivingLocation] = useState("");
  const [departingLocation, setDepartingLocation] = useState("");
  const [MCData, setMCData] = useState([
    {
      id: v4(),
      search_LocFrom: "",
      show_LocFrom: "",
      search_Mode: "",
      search_LocTo: "",
      show_LocTo: "",
      search_DepartingDate: "",
      show_DepartingDate: "",
    },
    {
      id: v4(),
      search_LocFrom: "",
      show_LocFrom: "",
      search_Mode: "",
      search_LocTo: "",
      show_LocTo: "",
      search_DepartingDate: "",
      show_DepartingDate: "",
    },
  ]);
  const [MCDataLength, setMCDataLength] = useState("");
  const [prefered_Airline, setPreferedAirline] = useState("");
  const [nonStop, setNonStop] = useState("");
  const [refundable, setRefundable] = useState("");
  // For checking whether the page has been loaded or not.
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  // For initial api call
  const [searchTriggered, setSearchTriggered] = useState(false);
  useEffect(() => {
    if (userData) {
      setIsOneWay(userData && userData.search_flightType == "1" ? true : false);
      setIsReturn(userData && userData.search_flightType == "2" ? true : false);
      setIsMultiCity(
        userData && userData.search_flightType == "3" ? true : false
      );
      setEconomy(userData && userData.search_Class == "Y" ? true : false);
      setPremiumEconomy(
        userData && userData.search_Class == "P" ? true : false
      );
      setFirst(userData && userData.search_Class == "F" ? true : false);
      setBusiness(userData && userData.search_Class == "C" ? true : false);
      setIsNoPreference(userData && userData.search_Class == "" ? true : false);
      setAdults((userData && Number(userData.search_Adults)) || 1);
      setChildren((userData && Number(userData.search_Children)) || 0);
      setInfants((userData && Number(userData.search_Infants)) || 0);
      setArrivingLocation({
        show_LocTo:
          `${
            (userData && userData.show_LocTo?.split("~")?.[0]) ||
            userData.show_LocTo
          } (${
            (userData && userData.search_LocTo?.split("~")?.[0]) ||
            userData?.show_LocTo
          })` || "fetching",
        search_LocTo: userData && userData.search_LocTo?.split("~")?.[0],
      });
      setDepartingLocation({
        show_LocFrom:
          `${
            (userData && userData.show_LocFrom?.split("~")?.[0]) ||
            userData.show_LocFrom
          } (${
            (userData && userData.search_LocFrom?.split("~")?.[0]) ||
            userData.search_LocFrom
          })` || "fetching",
        search_LocFrom: userData && userData.search_LocFrom?.split("~")?.[0],
      });
      const isMultiCity = userData?.search_flightType === "3";
      if (isMultiCity) {
        const fromArr = userData?.search_LocFrom?.split("~") || [];
        const showFromArr = userData?.show_LocFrom?.split("~") || [];
        const modeArr = userData?.search_Mode?.split("~") || [];
        const toArr = userData?.search_LocTo?.split("~") || [];
        const showToArr = userData?.show_LocTo?.split("~") || [];
        const depArr = userData?.search_DepartingDate?.split("~") || [];
        const showDepArr = userData?.show_DepartingDate?.split("~") || [];

        const maxLength = Math.max(
          fromArr.length,
          showFromArr.length,
          modeArr.length,
          toArr.length,
          showToArr.length,
          depArr.length,
          showDepArr.length
        );

        setMCData(
          Array.from({ length: maxLength }).map((_, index) => ({
            id: v4(),
            search_LocFrom: fromArr[index] || "",
            show_LocFrom: showFromArr[index] || "",
            search_Mode: modeArr[index] || "",
            search_LocTo: toArr[index] || "",
            show_LocTo: showToArr[index] || "",
            search_DepartingDate: depArr[index] || "",
            show_DepartingDate: showDepArr[index] || "",
          }))
        );
      } else {
        setMCData([
          {
            id: v4(),
            search_LocFrom: userData?.search_LocFrom || "",
            show_LocFrom: userData?.show_LocFrom || "",
            search_Mode: userData?.search_Mode || "",
            search_LocTo: userData?.search_LocTo || "",
            show_LocTo: userData?.show_LocTo || "",
            search_DepartingDate: userData?.search_DepartingDate || "",
            show_DepartingDate: userData?.show_DepartingDate || "",
          },
        ]);
      }
      setPreferedAirline(userData && userData.search_Airline);
      setNonStop(userData && userData.search_NonStop == "1" ? true : false);
      setRefundable(
        userData && userData.search_Refundable == "1" ? true : false
      );
      setSearchDepartingDate(
        (userData && userData.search_DepartingDate?.split("~")?.[0]) ||
          userData.search_DepartingDate
      );
      setShowDepartingDate(
        (userData && userData.show_DepartingDate?.split("~")?.[0]) ||
          userData?.show_DepartingDate
      );
      setSearchArrivingDate(
        (userData && userData?.search_ArrivingDate?.split("~")?.[0]) ||
          userData?.search_ArrivingDate
      );
      setShowArrivingDate(
        (userData && userData?.show_ArrivingDate?.split("~")?.[0]) ||
          userData?.show_ArrivingDate
      );
      setSearchMode(
        userData && userData.search_Mode?.includes("~")
          ? userData.search_Mode?.split("~")?.[0]
          : userData.search_Mode
      );
    }
  }, [userData]);
  useEffect(() => {
    if (userData && !initialLoadComplete) {
      setInitialLoadComplete(true);
      setSearchTriggered(true);
    }
  }, [userData]);
  // DATES
  const [searchDepartingDate, setSearchDepartingDate] = useState("");
  const [showDepartingDate, setShowDepartingDate] = useState("");
  const [search_ArrivingDate, setSearchArrivingDate] = useState("");
  const [show_ArrivingDate, setShowArrivingDate] = useState("");
  const [searchMode, setSearchMode] = useState("");

  const handleSetDepartingLocation = (name, value, cityName) => {
    setDepartingLocation({
      search_LocFrom: value?.split("~")[0],
      show_LocFrom: `${cityName} (${value?.split("~")[0]})`,
    });
  };

  const handleSetArrivingLocation = (name, value, cityName) => {
    setArrivingLocation({
      search_LocTo: value?.split("~")[0],
      show_LocTo: `${cityName} (${value?.split("~")[0]})`,
    });
    setSearchMode(value?.split("~")[1]);
  };
  // Airlines
  const [options, setOption] = useState([]);
  useEffect(() => {
    if (AirlineData) {
      const newOptions = AirlineData.map((airline) => ({
        label: airline.tpAL_DISPLAYNAME,
        value: `${airline.tpAL_IATA}~${airline.tpAL_DISPLAYNAME}`,
      }));
      let userSelectedAirline = prefered_Airline
        ? newOptions?.find((opt) => {
            return opt.value.split("~")[0] == prefered_Airline;
          })
        : null;
      userSelectedAirline && setPreferedAirline(userSelectedAirline?.label);
      setOption([...newOptions]);
    }
  }, [AirlineData]);
  // Airports
  const [airportOptions, setAirportOption] = useState([]);
  let [airports, setAirports] = useState(null);
  useEffect(() => {
    const abortController = new AbortController();
    const fetchAirports = async () => {
      setAirports(AirportData);
    };
    fetchAirports();
    return () => {
      abortController.abort();
    };
  }, [AirportData]);
  useEffect(() => {
    if (airports) {
      const newOptions = airports.map((airport, index) => ({
        label: airport.tpDescription,
        value: airport.tpAIRPORT_CODE,
        airportName: airport.tpAIRPORT_NAME,
        cityName: airport.tpAIRPORT_CITYNAME,
        countryName: airport.tpAIRPORT_COUNTRYNAME,
        key: `${airport.tpAIRPORT_CITYNAME}-${index}`,
      }));
      setAirportOption([...newOptions]);
    }
  }, [airports]);
  const [legsCount, setLegsCount] = useState(1);
  const cookies = useCookiesContext();
  const generateMCDataSignature = (MCData) => {
    let response =
      MCData &&
      MCData?.map(
        (item) =>
          `${item.search_LocFrom}-${item.search_LocTo}-${item.search_Mode}-${item.search_DepartingDate}`
      ).join("|");
    return response;
  };

  const mcDataSignature = useMemo(
    () => generateMCDataSignature(MCData),
    [MCData]
  );
  const userData2 = useMemo(() => {
    const flightType = isReturn ? "2" : isOneWay ? "1" : isMultiCity && "3";
    return {
      search_LocFrom:
        flightType === "3"
          ? MCData && MCData?.map((item) => item.search_LocFrom).join("~")
          : departingLocation.search_LocFrom,
      search_LocTo:
        flightType === "3"
          ? MCData && MCData?.map((item) => item.search_LocTo).join("~")
          : arrivingLocation.search_LocTo,
      ...(flightType == "2" && {
        search_ReturningDate: search_ArrivingDate,
      }),
      search_DepartingDate:
        flightType === "3"
          ? MCData && MCData?.map((item) => item.search_DepartingDate).join("~")
          : searchDepartingDate,
      search_Mode:
        flightType === "3"
          ? MCData && MCData?.map((item) => item.search_Mode).join("~")
          : searchMode,
      search_flightType: flightType,
      search_Adults: adults.toString(),
      search_Children: children.toString(),
      search_Infants: infants.toString(),
      search_Token: cookies.tokenId,
      search_Class: economy
        ? "Y"
        : premiumEconomy
        ? "P"
        : business
        ? "C"
        : first
        ? "F"
        : isNoPreference
        ? ""
        : "",
      search_NonStop: nonStop ? "1" : "0",
      search_Refundable: refundable ? "1" : "0",
      search_Airline: prefered_Airline ?? "",
      search_CurrencyCode: searchCurrencyCode,
    };
  }, [
    isNoPreference,
    economy,
    premiumEconomy,
    business,
    first,
    adults,
    children,
    infants,
    searchDepartingDate,
    search_ArrivingDate,
    arrivingLocation.search_LocTo,
    departingLocation.search_LocFrom,
    prefered_Airline,
    nonStop,
    refundable,
    isOneWay,
    isReturn,
    isMultiCity,
    mcDataSignature,
    searchCurrencyCode,
  ]);
  const isUserData2Valid = () => {
    if (!userData2) return false;

    // Check for empty required fields
    const requiredFields = [
      "search_LocFrom",
      "search_LocTo",
      "search_DepartingDate",
      "search_flightType",
    ];

    // Add search_ReturningDate to required fields if it's a return flight
    if (
      userData2.search_flightType === "2" &&
      !userData2.search_ReturningDate
    ) {
      return false;
    }

    // Check if any required field is empty
    return !requiredFields.some(
      (field) =>
        !userData2[field] ||
        userData2[field] === "" ||
        userData2[field] === undefined
    );
  };
  // APIs being called

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      if (!searchTriggered || !isUserData2Valid) return;
      setSearchTriggered(false);
      if (legsCount === 1) {
        try {
          let response = await getOneWayApi(userData2);
          searchFuncWasCalled && setSearchFuncWasCalled(false);
          setOneWayAPI(response);
        } catch (error) {
          console.error("Error fetching or parsing one-way data:", error);
        }
      }
      if (legsCount !== 1 && !searchFuncWasCalled) {
        try {
          let response = await getSecondLegApi(firstLegData);
          setSecondLegApi(response);
          setUserFilters([]);
        } catch (error) {
          console.error("Error fetching or parsing second leg data:", error);
        }
        return;
      }
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [searchTriggered]);
  let dataJson = oneWayApi && JSON.parse(oneWayApi);
  let dataJsonForSecondLeg = secondLegApi && JSON.parse(secondLegApi);
  const [firstLegData, setFirstLegData] = useState({
    Criteria: "",
    SearchId: "",
    FlightId: "",
    TokenId: "",
    ProductId: "",
    uGUID: uuidv4(),
    FlightType: "",
    LegNo: legsCount + 1,
    FlightCriteria: [],
  });
  const [flightsReview, setFlightsReview] = useState({
    travelers: [
      {
        Traveler: {
          gender: "",
          birthDate: "",
          id: "",
          Identifier: {
            authority: "Travelport",
            value: "",
          },
          passengerTypeCode: "",
          PersonName: {
            "@type": "PersonNameDetail",
            Prefix: "",
            Given: "",
            Surname: "",
          },
          Telephone: [
            {
              "@type": "Telephone",
              countryAccessCode: "",
              phoneNumber: "",
              id: "",
              cityCode: "",
              role: "",
            },
          ],
          Email: [
            {
              value: "",
            },
          ],
          TravelDocument: [
            {
              "@type": "TravelDocumentDetail",
              docNumber: "",
              docType: "",
              expireDate: "",
              issueCountry: "",
              birthDate: "",
              Gender: "",
              PersonName: {
                "@type": "PersonName",
                Given: "",
                Surname: "",
              },
            },
          ],
        },
      },
    ],
    tokenId: "",
    adults: adults.toString(),
    children: children.toString(),
    infants: infants.toString(),
    flightCriteria: [],
  });
  // TOKEN LOGIC
  useEffect(() => {
    if (dataJson) {
      updateCookie("tokenId", dataJson.flightSummary[0].tokenId, {
        maxAge: 60 * 60 * 10, // 10 hours in seconds
        secure: true,
        sameSite: "Strict",
      });
    }
  }, [dataJson]);
  const [searchFuncWasCalled, setSearchFuncWasCalled] = useState(false);
  const handleSearch = (e) => {
    e.stopPropagation();
    if (
      userData2.search_LocFrom == "" ||
      userData2.search_LocFrom == null ||
      userData2.search_LocFrom == undefined
    ) {
      toast.error("Departing Location cannot be empty");
      return;
    }
    if (
      userData2.search_LocTo == "" ||
      userData2.search_LocTo == null ||
      userData2.search_LocTo == undefined
    ) {
      toast.error("Arriving Location cannot be empty");
      return;
    }
    if (userData2.search_LocTo == userData2.search_LocFrom) {
      toast.error("Departing and Arriving Location cannot be same");
      return;
    }
    if (
      userData2.search_DepartingDate == "" ||
      userData2.search_DepartingDate == null ||
      userData2.search_DepartingDate == undefined
    ) {
      toast.error("Departure Date cannot be empty");
      return;
    }
    if (userData2.search_flightType == "3") {
      if (
        MCData.some(
          (item) =>
            item.search_LocFrom === "" ||
            item.search_LocFrom === null ||
            item.search_LocFrom === undefined
        )
      ) {
        toast.error(
          "Multi-City Search requires all Departure Locations to be filled"
        );
        return;
      }
      if (MCData?.length === 0) {
        toast.error("Multi-City Search requires at least two locations");
        return;
      }
      if (MCData.some((item) => item.search_LocFrom === item.search_LocTo)) {
        toast.error(
          "Multi-City Search cannot have same Departure and Arrival Location"
        );
        return;
      }
      if (
        MCData.some(
          (item) =>
            item.search_LocTo === "" ||
            item.search_LocTo === null ||
            item.search_LocTo === undefined
        )
      ) {
        toast.error(
          "Multi-City Search requires all Arriving Locations to be filled"
        );
        return;
      }
      if (MCData.some((item) => item.search_DepartingDate === "")) {
        toast.error(
          "Multi-City Search requires all Departure Dates to be filled"
        );
        return;
      }
    }
    setFirstLegData({
      Criteria: "",
      SearchId: "",
      FlightId: "",
      TokenId: "",
      ProductId: "",
      uGUID: uuidv4(),
      FlightType: "",
      LegNo: legsCount + 1,
      FlightCriteria: [],
    });
    setUsersSelectedPrice(0);
    setSearchFuncWasCalled(true);
  };
  useEffect(() => {
    if (searchFuncWasCalled) {
      setLegsCount(1);
      setSearchTriggered(true);
      setFlightsReview({
        travelers: [
          {
            Traveler: {
              gender: "",
              birthDate: "",
              id: "",
              Identifier: {
                authority: "Travelport",
                value: "",
              },
              passengerTypeCode: "",
              PersonName: {
                "@type": "PersonNameDetail",
                Prefix: "",
                Given: "MSA",
                Surname: "",
              },
              Telephone: [
                {
                  "@type": "Telephone",
                  countryAccessCode: "",
                  phoneNumber: "",
                  id: "",
                  cityCode: "",
                  role: "",
                },
              ],
              Email: [
                {
                  value: "",
                },
              ],
              TravelDocument: [
                {
                  "@type": "TravelDocumentDetail",
                  docNumber: "",
                  docType: "",
                  expireDate: "",
                  issueCountry: "",
                  birthDate: "",
                  Gender: "",
                  PersonName: {
                    "@type": "PersonName",
                    Given: "",
                    Surname: "",
                  },
                },
              ],
            },
          },
        ],
        tokenId: "",
        adults: adults.toString(),
        children: children.toString(),
        infants: infants.toString(),
        flightCriteria: [],
      });
      if (dataJson) setReRender(!reRender);
    }
  }, [searchFuncWasCalled]);
  const [showAdvance, setShowAdvance] = useState(false);
  const [airline, setAirline] = useState([]);
  const [enableFilter, setEnableFilter] = useState(false);
  const [userFilters, setUserFilters] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  
  // Function to clear any previously expanded (but not selected) flight data
  const clearExpandedFlightData = () => {
    // Reset firstLegData to only keep actually selected flights
    setFirstLegData((prevData) => {
      // If no flight has been actually selected (no FlightCriteria), reset to initial state
      if (!prevData.FlightCriteria || prevData.FlightCriteria.length === 0) {
        return {
          Criteria: "",
          SearchId: "",
          FlightId: "",
          TokenId: "",
          ProductId: "",
          uGUID: uuidv4(),
          FlightType: "",
          LegNo: legsCount + 1,
          FlightCriteria: [],
        };
      }
      // If there are selected flights, keep them but clear any stale metadata
      return {
        ...prevData,
        SearchId: prevData.SearchId || "",
        FlightId: prevData.FlightId || "",
        TokenId: prevData.TokenId || "",
        ProductId: prevData.ProductId || "",
      };
    });
  };

  useEffect(() => {
    const applyFilters = (data, filters) => {
      return data.filter((item) => {
        let matchesAirline = true;
        let matchesStops = true;
        let matchesDepAirport = true;
        let matchesArrTime = true;
        let matchesDepTime = true;

        if (filters.airlineCodes.length > 0) {
          matchesAirline = filters.airlineCodes.includes(item.airlineCode);
        }

        if (filters.stops.length > 0) {
          const itemStops =
            typeof item.stops === "string"
              ? parseInt(item.stops, 10)
              : item.stops;
          matchesStops = filters.stops.some((stop) => stop === itemStops);
        }

        if (filters.depAirportCodes.length > 0) {
          matchesDepAirport = filters.depAirportCodes.includes(
            item.depAirportCode
          );
        }
        if (filters.arrivalTimeRange) {
          const [start, end] = filters.arrivalTimeRange;
          const arrivalHour = parseInt(item.arrTime.split(":")[0], 10);
          matchesArrTime = arrivalHour >= start && arrivalHour <= end;
        }
        if (filters.departureTimeRange) {
          const [start, end] = filters.departureTimeRange;
          const departureHour = parseInt(item.depTime.split(":")[0], 10);
          matchesDepTime = departureHour >= start && departureHour <= end;
        }

        return (
          matchesAirline &&
          matchesStops &&
          matchesDepAirport &&
          matchesArrTime &&
          matchesDepTime
        );
      });
    };

    const filters = {
      airlineCodes: [],
      stops: [],
      depAirportCodes: [],
      arrivalTimeRange: null,
      departureTimeRange: null,
    };

    userFilters.forEach((filter) => {
      if (typeof filter === "number") {
        filters.stops.push(filter);
      } else if (typeof filter === "string") {
        if (filter.endsWith("A")) {
          const [start, end] = filter.split("A")[0].split(":").map(Number);
          filters.arrivalTimeRange = [start, end];
        } else if (filter.endsWith("D")) {
          const [start, end] = filter.split("D")[0].split(":").map(Number);
          filters.departureTimeRange = [start, end];
        } else if (filter.length === 2) {
          filters.airlineCodes.push(filter);
        } else {
          filters.depAirportCodes.push(filter);
        }
      }
    });

    const filtered =
      legsCount === 1
        ? dataJson && applyFilters(dataJson.flightSummary, filters)
        : dataJsonForSecondLeg &&
          applyFilters(dataJsonForSecondLeg.flightSummary, filters);

    setFilteredOptions(filtered);
    
    // Clear any previously expanded (but not selected) flight data when filters are applied
    if (userFilters.length > 0) {
      clearExpandedFlightData();
    }
  }, [userFilters, oneWayApi, secondLegApi, legsCount]);

  useEffect(() => {
    setFlightsReview((prevData) => ({
      ...prevData,
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
    }));
  }, [adults, children, infants]);
  useEffect(() => {
    let timer;
    if (!showOverlay) {
      timer = setTimeout(() => {
        setShowOverlay(true);
      }, 10 * 60 * 1000);
    }
    return () => clearTimeout(timer);
  }, [showOverlay]);
  useEffect(() => {
    const shouldLockScroll = loading || loadingSecondLeg;

    if (shouldLockScroll) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [loading, loadingSecondLeg]);

  return (
    <div
      onClick={() => {
        setShowMiniFilters(false);
      }}
      className={`overflow-x-hidden ${styles.bg}`}
    >
      <div
        className="w-full font-gotham"
        onClick={(e) => {
          e.stopPropagation();
          setIsEnableTravel(false);
          setIsEnableEconomy(false);
        }}
      >
        <Toaster />
        <div className="minibuttons flex-col lg:flex-row flex gap-5 lg:gap-3 px-9 pt-4 lg:items-center font-gotham">
          <div className="flex gap-3">
            <MiniButton
              Text="Round Trip"
              Class={isReturn && "active"}
              onClick={() => {
                setIsReturn(true);
                setIsMultiCity(false);
                setIsOneWay(false);
              }}
            />
            <MiniButton
              Text="One Way"
              Class={isOneWay && "active"}
              onClick={() => {
                setIsReturn(false);
                setIsMultiCity(false);
                setIsOneWay(true);
              }}
            />

            <MiniButton
              Text="Multi City"
              Class={isMultiCity && "active"}
              onClick={() => {
                setIsMultiCity(true);
                setIsReturn(false);
                setIsOneWay(false);
              }}
            />
          </div>
          <div className="flex gap-3">
            <div className="Travel font-gotham">
              <Travel
                Text={`${adults} ${adults > 1 ? "Adults" : "Adult"}${
                  children > 0
                    ? `, ${children} ${children > 1 ? "Children" : "Child"}`
                    : ""
                }${
                  infants > 0
                    ? `, ${infants} ${infants > 1 ? "Infants" : "Infant"}`
                    : ""
                }`}
                Icon={<FaPersonWalkingLuggage></FaPersonWalkingLuggage>}
                DropIcon={<RiArrowDropDownLine />}
                onClick={
                  isEnableTravel
                    ? isEnableEconomy
                      ? (e) => {
                          e.stopPropagation();
                          setIsEnableEconomy(false);
                          setIsEnableTravel(true);
                        }
                      : (e) => {
                          e.stopPropagation();
                          setIsEnableTravel(true);
                        }
                    : (e) => {
                        e.stopPropagation();
                        setIsEnableEconomy(false);
                        setIsEnableTravel(true);
                      }
                }
              ></Travel>
              <div
                className={`${isEnableTravel ? "block" : "hidden"}
             absolute z-40 font-gotham`}
              >
                <TravelersCompo
                  adults={adults}
                  setAdults={setAdults}
                  Children={children}
                  setChildren={setChildren}
                  infants={infants}
                  setInfants={setInfants}
                />
              </div>
            </div>

            <div className="Economy relative font-gotham">
              <Travel
                Text={`${
                  economy
                    ? "Economy"
                    : premiumEconomy
                    ? "Premium Economy"
                    : business
                    ? "Business"
                    : first
                    ? "First"
                    : isNoPreference
                    ? "No Preference"
                    : "Class"
                }`}
                DropIcon={<RiArrowDropDownLine />}
                onClick={
                  isEnableEconomy
                    ? isEnableTravel
                      ? (e) => {
                          e.stopPropagation();
                          setIsEnableEconomy(true);
                          setIsEnableTravel(false);
                        }
                      : (e) => {
                          e.stopPropagation();
                          setIsEnableTravel(false);
                        }
                    : (e) => {
                        e.stopPropagation();
                        setIsEnableEconomy(true);
                        setIsEnableTravel(false);
                      }
                }
              ></Travel>
              <div
                className={`${
                  isEnableEconomy ? "block" : "hidden"
                } absolute z-40`}
              >
                <ClassCompo
                  setEconomy={setEconomy}
                  setPremiumEconomy={setPremiumEconomy}
                  setBusiness={setBusiness}
                  setFirst={setFirst}
                  setIsNoPreference={setIsNoPreference}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Input boxes for round trip and one way */}
        <div
          className={`searchPage inputField w-screen px-9 py-7 lg:py-9 ${
            isReturn ? "grid" : isOneWay ? "grid" : "hidden"
          } ${
            isMultiCity ? "lg:grid-cols-4" : "lg:grid-cols-[1fr_1fr_1fr_250px]"
          } gap-5`}
        >
          <InputBoxText
            border="border-2 border-gray-200"
            disableDates={true}
            name="search_LocFrom"
            value={departingLocation.show_LocFrom || null}
            Placeholder="Departing Location"
            InputIcon={<FaLocationDot />}
            CrossIcon={<RxCross1 />}
            options={airportOptions}
            ReadOnly={false}
            onChange={(name, value, cityName) =>
              handleSetDepartingLocation(name, value, cityName)
            }
          />
          <InputBoxText
            border="border-2 border-gray-200"
            name="search_LocTo"
            disableDates={true}
            value={arrivingLocation.show_LocTo || null}
            Placeholder="Arriving Location"
            InputIcon={<FaLocationDot />}
            CrossIcon={<RxCross1 />}
            options={airportOptions}
            ReadOnly={false}
            onChange={(name, value, cityName) =>
              handleSetArrivingLocation(name, value, cityName)
            }
          />
          <InputBoxText
            border="border-2 border-gray-200"
            disableDates={true}
            TabIndex={3}
            value={
              isReturn
                ? [dayjs(showDepartingDate), dayjs(show_ArrivingDate)]
                : isOneWay
                ? dayjs(showDepartingDate)
                : isMultiCity
                ? dayjs(showDepartingDate)
                : null
            }
            Placeholder={
              isReturn ? ["Departing Date", "Arriving Date"] : "Departing Date"
            }
            InputIcon={<SlCalender />}
            CrossIcon={<RxCross1 />}
            ReadOnly={true}
            RangePicker={isReturn ? RangePicker : DatePicker}
            onChange={(dateString) => {
              if (isReturn) {
                setShowDepartingDate(dateString[0]);
                setShowArrivingDate(dateString[1]);
                setSearchDepartingDate(
                  `${dateString[0].$d.getDate()}-${
                    dateString[0].$d.getMonth() + 1
                  }-${dateString[0].$d.getFullYear()}`
                );
                setSearchArrivingDate(
                  `${dateString[1].$d.getDate()}-${
                    dateString[1].$d.getMonth() + 1
                  }-${dateString[1].$d.getFullYear()}`
                );
              }
              if (!isReturn) {
                setShowDepartingDate(dateString);
                setSearchDepartingDate(
                  `${dateString.$d.getDate()}-${
                    dateString.$d.getMonth() + 1
                  }-${dateString.$d.getFullYear()}`
                );
              }
            }}
          />
          <div className="btn flex items-center">
            <button
              className="bg-orange-500 flex items-center gap-2 text-white rounded py-2 lg:py-4 px-4 md:px-6 lg:px-12 text-xs lg:text-sm font-gotham"
              onClick={handleSearch}
            >
              <span className="font-light font-gotham">
                <FaSearch></FaSearch>
              </span>
              Search
            </button>
          </div>
        </div>
        {/* Input boxes for multicity */}
        <div
          className={`inputField w-screen px-9 py-9 ${
            isMultiCity ? "flex" : "hidden"
          }  flex-col
            gap-4
           `}
        >
          <div className="w-full flex flex-col gap-y-4">
            {MCData &&
              MCData.length > 0 &&
              MCData?.map((cityData, index) => {
                return (
                  <span
                    key={cityData.id}
                    className="min-w-full relative grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_150px] gap-y-2 md:gap-y-0 md:gap-x-8"
                  >
                    <h3 className="text-xs md:hidden text-blue-900">
                      Flight {index + 1}
                    </h3>
                    <InputBoxText
                      border="border-2 border-gray-200"
                      options={airportOptions}
                      ReadOnly={false}
                      name="search_LocFrom"
                      value={
                        cityData.show_LocFrom == ""
                          ? null
                          : cityData.show_LocFrom
                      }
                      Placeholder="Departing Location"
                      InputIcon={<FaLocationDot />}
                      CrossIcon={<RxCross1 />}
                      disableDates={true}
                      onChange={(name, value, cityName) => {
                        const updateCities = MCData?.map((city) =>
                          city.id === cityData.id
                            ? {
                                ...city,
                                // [name]: value?.split("~")[0]
                                show_LocFrom: cityName,
                                search_LocFrom: value?.split("~")[0],
                              }
                            : city
                        );
                        setMCData(updateCities);
                      }}
                    />
                    <InputBoxText
                      border="border-2 border-gray-200"
                      options={airportOptions}
                      ReadOnly={false}
                      value={
                        cityData.show_LocTo == "" ? null : cityData.show_LocTo
                      }
                      name="search_LocTo"
                      Placeholder="Arrival Location"
                      InputIcon={<FaLocationDot />}
                      CrossIcon={<RxCross1 />}
                      disableDates={true}
                      onChange={(name, value, cityName) => {
                        const updatedCities = MCData?.map((item, idx) => {
                          if (item.id === cityData.id) {
                            const updatedItem = {
                              ...item,
                              show_LocTo: cityName,
                              search_LocTo: value?.split("~")[0],
                              search_Mode: value?.split("~")[1],
                            };
                            if (idx + 1 < MCData.length) {
                              const nextItem = MCData[idx + 1];
                              // Return both updated current and updated next
                              return [
                                updatedItem,
                                {
                                  ...nextItem,
                                  show_LocFrom: cityName,
                                  search_LocFrom: value?.split("~")[0],
                                },
                              ];
                            }
                            return updatedItem;
                          }
                          if (idx > 0 && MCData[idx - 1].id === cityData.id) {
                            return null;
                          }
                          return item;
                          // item.id === cityData.id
                          //   ? {
                          //       ...item,
                          //       show_LocTo: cityName,
                          //       search_LocTo: value?.split("~")[0],
                          //       search_Mode: value?.split("~")[1],
                          //     }
                          //   : item;
                        });
                        setMCData(updatedCities.flat().filter(Boolean));
                      }}
                    />
                    <div>
                      <InputBoxText
                        border="border-2 border-gray-200"
                        ReadOnly={false}
                        value={
                          cityData.show_DepartingDate
                            ? dayjs(cityData.show_DepartingDate)
                            : null
                        }
                        minDate={
                          index > 0
                            ? new Date(MCData[index - 1]?.show_DepartingDate)
                            : null
                        }
                        name="search_DepartingDate"
                        disableDates={true}
                        Placeholder="Departing Date"
                        InputIcon={<SlCalender />}
                        CrossIcon={<RxCross1 />}
                        RangePicker={DatePicker}
                        onChange={(dateString) => {
                          const updatedCities = MCData?.map((item) => {
                            return item.id === cityData.id
                              ? {
                                  ...item,
                                  show_DepartingDate: `${dateString}`,
                                  search_DepartingDate: `${dateString.$d.getDate()}-${
                                    dateString.$d.getMonth() + 1
                                  }-${dateString.$d.getFullYear()}`,
                                }
                              : item;
                          });
                          setMCData(updatedCities);
                        }}
                      />
                    </div>
                    <div className="flex items-center">
                      {index >= 2 && (
                        <button
                          className="text-base md:text-xl absolute top-0 right-0 md:static text-orange-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMCData(
                              MCData.filter((item) => item.id !== cityData.id)
                            );
                          }}
                        >
                          <RxCrossCircled />
                        </button>
                      )}
                    </div>
                  </span>
                );
              })}
          </div>

          <div className="btn flex items-center gap-6">
            <button
              className={`text-blue-900 rounded cursor-pointer ${
                MCData && MCData.length > 5 ? "hidden" : "block"
              } font-gotham font-[400] py-4 px-6 flex items-center text-sm md:text-base`}
              onClick={() => {
                setMCData([
                  ...MCData,
                  {
                    id: v4(),
                    search_LocFrom: "",
                    show_LocFrom: "",
                    search_Mode: "",
                    search_LocTo: "",
                    show_LocTo: "",
                    search_DepartingDate: "",
                    show_DepartingDate: "",
                  },
                ]);
              }}
            >
              Add +
            </button>
            <button
              className="bg-orange-500 flex items-center gap-2 text-white rounded py-2 lg:py-4 px-4 md:px-6 lg:px-12 text-xs lg:text-sm font-gotham"
              onClick={handleSearch}
            >
              <span className="font-light font-gotham">
                <FaSearch></FaSearch>
              </span>
              Search
            </button>
          </div>
        </div>
        {/* Advanced Options */}
        <div className="advancedOptions px-9 pb-9 lg:pb-9 flex flex-col font-gotham w-full">
          <div className="w-full flex items-center justify-between">
            <button
              className="text-black block text-left w-fit font-gotham font-light text-sm lg:text-base"
              onClick={() => {
                setShowAdvance(!showAdvance);
              }}
            >
              Show Advanced Options
            </button>
            <button
              className="flex items-center xl:hidden gap-x-2 rounded-md cursor-pointer text-black font-gotham font-light text-xs sm:text-sm xl:text-base"
              onClick={() => setShowMiniFilters(!showMiniFilters)}
            >
              <IoFilterOutline className="text-xs sm:text-sm lg:text- base" />
              Filters
            </button>
          </div>
          <div
            className={`advanceOption ${
              showAdvance ? "flex" : "hidden"
            } flex-col gap-3 font-gotham`}
          >
            <div className="checkboxes flex items-center gap-3 mt-5">
              <div className="nonStop flex justify-start gap-2 items-center">
                <input
                  type="checkbox"
                  className="text-xs sm:text-sm lg:text-base"
                  checked={nonStop}
                  name="nonStop"
                  id="nonStop"
                  onChange={() => {
                    setNonStop(!nonStop);
                  }}
                />{" "}
                <label
                  htmlFor="nonStop"
                  className="font-gotham font-light text-xs sm:text-sm lg:text-base"
                >
                  Non Stop
                </label>
              </div>
              <div className="refundable flex justify-start gap-2 items-center">
                <input
                  type="checkbox"
                  checked={refundable}
                  className="text-xs sm:text-sm lg:text-base"
                  name="refundable"
                  id="refundable"
                  onChange={() => {
                    setRefundable(!refundable);
                  }}
                />{" "}
                <label
                  htmlFor="refundable"
                  className="font-gotham font-light text-xs lg:text-base sm:text-sm"
                >
                  Refundable
                </label>
              </div>
            </div>
            <div
              className={`${styles.preferedAirlines} w-full h-[30px] lg:max-w-[24%] lg:h-[60px] ${styles.border} rounded`}
            >
              <InputBoxText
                border="border-2 border-gray-200"
                airline={true}
                options={options}
                ReadOnly={false}
                name="preferedAirline"
                value={prefered_Airline == "" ? null : prefered_Airline}
                Placeholder="Prefered Airline"
                InputIcon={<FaLocationDot />}
                CrossIcon={<RxCross1 />}
                className={`${styles.select} ${styles.antSelect} rounded`}
                onChange={(name, value, i) => {
                  setPreferedAirline(value?.split("~")[0]);
                }}
              />
            </div>
          </div>
        </div>
        {/* Search Area */}
        <div className="searchAreaWithFilter flex flex-col gap-2 px-9 w-full font-gotham">
          {/* Leg Labels */}
          <div className="flightSelectionbtns flex flex-wrap md:flex-nowrap gap-6 mb-3 font-gotham">
            {isMultiCity ? (
              MCData &&
              MCData?.map((item, index) => {
                return (
                  <button
                    key={index}
                    className={`flex text-xs md:text-base items-center ${
                      legsCount - 1 === index
                        ? "text-orange-500"
                        : "text-gray-500"
                    } cursor-auto font-gotham`}
                  >
                    {item.show_LocFrom &&
                      item.show_LocTo &&
                      item.show_DepartingDate && (
                        <span>
                          {item.show_LocFrom} - {item.show_LocTo}
                        </span>
                      )}
                  </button>
                );
              })
            ) : (
              <>
                <button
                  className={`flex items-center text-xs md:text-base ${
                    legsCount === 1 ? "text-orange-500" : "text-gray-500"
                  } cursor-auto font-gotham text-xs sm:text-sm xl:text-base`}
                >
                  {`${departingLocation.show_LocFrom} - ${arrivingLocation.show_LocTo}`}
                </button>
                <button
                  className={`${
                    isReturn ? "flex" : "hidden"
                  } items-center font-gotham ${
                    legsCount === 1 ? "text-gray-500 " : "text-orange-500"
                  } cursor-auto text-xs sm:text-sm lg:text-base`}
                >
                  {`${arrivingLocation.show_LocTo} - ${departingLocation.show_LocFrom}`}
                </button>
              </>
            )}
          </div>
          {/* Filters and tabs flex */}
          <div className="flex filters&Cards items-start gap-x-5 font-gotham">
            {/* Filters */}
            <div className="filters hidden xl:block min-w-[20%] max-w-[25%] font-gotham">
              <Filterbox
                APIData={legsCount === 1 ? oneWayApi : secondLegApi}
                loading={legsCount === 1 ? loading : loadingSecondLeg}
                departingLocation={
                  isMultiCity
                    ? MCData && MCData?.[legsCount - 1]?.show_LocFrom
                    : legsCount === 1
                    ? departingLocation.show_LocFrom?.split("~")[0] ||
                      departingLocation.show_LocFrom
                    : arrivingLocation.show_LocTo?.split("~")[0] ||
                      arrivingLocation.show_LocTo
                }
                setUserFilters={setUserFilters}
                setEnableFilter={setEnableFilter}
                enableFilter={enableFilter}
                airline={airline}
                setAirline={setAirline}
                Border={true}
                legsCount={legsCount}
                clearExpandedFlightData={clearExpandedFlightData}
              />
            </div>
            {/* Flight Cards */}
            <div className="flightCards w-full flex flex-col mb-6 font-gotham xl:min-w-[70%] xl:max-w-[75%]">
              {/* mini filters {suggested, cheapes, fastest} */}
              <div className={`filterTabs pt-0 font-gotham`}>
                <FilterTabs
                  setFilteredOptions={setFilteredOptions}
                  selectedFilterTab={selectedFilterTab}
                  setSelectedFilterTab={setSelectedFilterTab}
                />
              </div>
              {/* Flight selection area */}
              <div className="selectFlightSection font-gotham">
                {/* Flight legs */}
                <div className="text mb-3 font-gotham">
                  <h2 className="text-blue-900 sm:font-bold font-gotham text-xs sm:text-sm lg:text-base">
                    Select your flight from{" "}
                    {legsCount === 1
                      ? isMultiCity
                        ? MCData && MCData?.[legsCount - 1].show_LocFrom
                        : departingLocation.show_LocFrom ||
                          (MCData && MCData?.[legsCount - 1].show_LocFrom)
                      : isMultiCity
                      ? MCData && MCData?.[legsCount - 1].show_LocFrom
                      : arrivingLocation.show_LocTo ||
                        (MCData && MCData?.[legsCount - 1].show_LocFrom)}{" "}
                    to{" "}
                    {legsCount === 1
                      ? isMultiCity
                        ? MCData && MCData?.[legsCount - 1].show_LocTo
                        : arrivingLocation.show_LocTo ||
                          (MCData && MCData?.[legsCount - 1].show_LocTo)
                      : isMultiCity
                      ? MCData && MCData?.[legsCount - 1].show_LocTo
                      : departingLocation.show_LocFrom ||
                        (MCData && MCData?.[legsCount - 1].show_LocTo)}
                  </h2>
                </div>
                <div className="flightCards flex flex-col gap-3 mb-10 w-full">
                  {legsCount === 1 ? (
                    oneWayApi && !loading ? (
                      dataJson &&
                      filteredOptions &&
                      filteredOptions.map((dataItem, index) => (
                        <div
                          className={`flightCardContainer relative ${
                            dataItem.keyData === "MESSAGE"
                              ? "min-h-[50vh]"
                              : "min-h-0"
                          } font-gotham`}
                          key={index}
                        >
                          {dataItem.keyData === "MESSAGE" ? (
                            <span
                              className={`${
                                dataItem.keyData === "MESSAGE"
                                  ? "inline"
                                  : "hidden"
                              } absolute top-1/2 text-justify font-gotham text-sm md:text-base`}
                            >
                              {dataItem.msg.split("<br>")[0]}
                              <br />
                              {dataItem.msg.split("<br>")[1]}
                              <br />
                              {dataItem.msg.split("<br>")[2]}
                            </span>
                          ) : (
                            <FlightCard
                              // showFlightDetails={showFlightDetails}
                              // setShowFlightDetails={setShowFlightDetails}
                              filteredOptions={filteredOptions}
                              searchTriggered={searchTriggered}
                              setSearchTriggered={setSearchTriggered}
                              setFlightsReview={setFlightsReview}
                              setUsersSelectedPrice={setUsersSelectedPrice}
                              usersSelectedPrice={usersSelectedPrice}
                              flightsReview={flightsReview}
                              setLegsCount={setLegsCount}
                              legsCount={legsCount}
                              searchCurrencyCode={searchCurrencyCode}
                              MCDataLength={MCData.length}
                              setFirstLegData={setFirstLegData}
                              firstLegData={firstLegData}
                              userData2={userData2}
                              isReturn={isReturn}
                              isOneWay={isOneWay}
                              isMultiCity={isMultiCity}
                              dataItem={dataItem}
                              Tracid={dataItem.tracid}
                              keyData={dataItem.keyData}
                              TokenId={dataItem.tokenId}
                              ProductId={dataItem.productId}
                              FlightType={dataItem.flightType}
                              FlightCriteria={dataItem.flightSegment}
                              cardkey={index}
                              brandsDataJson={dataItem.brands}
                              airlineLogo={dataItem.actualCarrier}
                              airlineName={dataItem.actualCarrierName}
                              airlineCode={dataItem.airlineCode}
                              flightNumber={dataItem.flightNumber}
                              depTime={dataItem.depTime}
                              arrTime={dataItem.arrTime}
                              duration={dataItem.duration}
                              depCityName={dataItem.depCityName}
                              depAirportCode={dataItem.depAirportCode}
                              arrCityName={dataItem.arrCityName}
                              arrAirportCode={dataItem.arrAirportCode}
                              stops={dataItem.stops}
                              meal={dataItem.meal}
                              // Pass base numeric totals (unformatted). Conversion to selected currency
                              // will be handled by child components using `exchangeRate`.
                              totalPriceBase={
                                dataItem?.brands &&
                                dataItem?.brands[0]?.keyData === "Root0"
                                  ? Math.ceil(
                                      Number(
                                        dataItem?.priceStructure?.totalPriceFC
                                      )
                                    )
                                  : Math.ceil(
                                      Number(
                                        dataItem?.brands &&
                                          dataItem?.brands[0]?.priceStructure
                                            ?.totalPriceFC
                                      )
                                    )
                              }
                              exchangeRate={exchangeRate}
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <Skeleton count={7} height={120} />
                    )
                  ) : !loadingSecondLeg ? (
                    secondLegApi &&
                    dataJsonForSecondLeg &&
                    filteredOptions?.map((dataItem, index) => (
                      <div
                        className={`flightCardContainer relative ${
                          dataItem.keyData === "MESSAGE"
                            ? "min-h-[50vh]"
                            : "min-h-0"
                        } font-gotham`}
                        key={index}
                      >
                        {dataItem.keyData === "MESSAGE" ? (
                          <span
                            className={`${
                              dataItem.keyData === "MESSAGE"
                                ? "inline"
                                : "hidden"
                            } absolute top-1/2 text-justify text-sm md:text-base font-gotham`}
                          >
                            {dataItem.msg.split("<br>")[0]}
                            <br />
                            {dataItem.msg.split("<br>")[1]}
                            <br />
                            {dataItem.msg.split("<br>")[2]}
                          </span>
                        ) : (
                          <FlightCard
                            // showFlightDetails={showFlightDetails}
                            // setShowFlightDetails={setShowFlightDetails}
                            searchTriggered={searchTriggered}
                            setSearchTriggered={setSearchTriggered}
                            setUsersSelectedPrice={setUsersSelectedPrice}
                            usersSelectedPrice={usersSelectedPrice}
                            setFlightsReview={setFlightsReview}
                            flightsReview={flightsReview}
                            MCDataLength={MCData.length}
                            setLegsCount={setLegsCount}
                            legsCount={legsCount}
                            searchCurrencyCode={searchCurrencyCode}
                            setFirstLegData={setFirstLegData}
                            firstLegData={firstLegData}
                            userData2={userData2}
                            isReturn={isReturn}
                            isOneWay={isOneWay}
                            isMultiCity={isMultiCity}
                            dataItem={dataItem}
                            Tracid={dataItem.tracid}
                            keyData={dataItem.keyData}
                            TokenId={dataItem.tokenId}
                            ProductId={dataItem.productId}
                            FlightType={dataItem.flightType}
                            FlightCriteria={dataItem.flightSegment}
                            cardkey={index}
                            brandsDataJson={dataItem.brands}
                            airlineLogo={dataItem.actualCarrier}
                            airlineName={dataItem.actualCarrierName}
                            airlineCode={dataItem.airlineCode}
                            flightNumber={dataItem.flightNumber}
                            depTime={dataItem.depTime}
                            arrTime={dataItem.arrTime}
                            duration={dataItem.duration}
                            depCityName={dataItem.depCityName}
                            depAirportCode={dataItem.depAirportCode}
                            arrCityName={dataItem.arrCityName}
                            arrAirportCode={dataItem.arrAirportCode}
                            stops={dataItem.stops}
                            meal={dataItem.meal}
                            totalPriceBase={
                              dataItem?.brands &&
                              dataItem?.brands[0]?.keyData === "Root0"
                                ? Math.ceil(
                                    Number(
                                      dataItem?.priceStructure?.totalPriceFC
                                    ) - usersSelectedPrice
                                  )
                                : Math.ceil(
                                    Number(
                                      dataItem?.brands &&
                                        dataItem?.brands[0]?.priceStructure
                                          ?.totalPriceFC
                                    ) - usersSelectedPrice
                                  )
                            }
                            exchangeRate={exchangeRate}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <Skeleton count={7} height={120} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Others */}
      <div
        className={`fixed bottom-3 right-3 md:right-16 cursor-pointer rounded-full font-bold`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <IoIosArrowUp className="text-3xl sm:text-4xl bg-blue-900 border border-orange-500 text-orange-500 rounded-full" />
      </div>
      {/* Refresh */}
      <div
        className={`overlay fixed top-0 bottom-0 right-0 left-0 bg-black/75 text-white ${
          showOverlay ? "flex" : "hidden"
        } items-center justify-center !z-[5000000]`}
      >
        <div className="min-w-40 md:min-w-80 bg-blue-950 rounded-md py-3 md:py-4 px-2 md:px-4 text-white font-gotham font-bold">
          <h3 className="text-sm md:text-xl">Session Expired!</h3>
          <p className="font-light !py-2 text-sm md:text-lg">
            Please refresh to get latest results
          </p>
          <button
            className="px-4 py-2 mt-2 rounded cursor-pointer bg-orange-500 text-xs md:text-base"
            onClick={(e) => {
              setShowOverlay(false);
              handleSearch(e);
            }}
          >
            Refresh
          </button>
        </div>
      </div>
      {/* Filters for mobile */}
      <div
        className={`fixed w-full md:w-1/2  overflow-scroll top-0 bottom-0 right-0 left-0 md:left-1/2 bg-white text-black font-gotham z-[100] px-2 py-20 border-l transition-transform duration-300 ease-in-out ${
          showMiniFilters ? "block" : "hidden"
        }`}
      >
        <div className="w-11/12">
          <div className="w-full flex items-center !justify-end min-h-8">
            <RiCloseLine
              size={24}
              onClick={() => setShowMiniFilters(false)}
              className="cursor-pointer"
            />
          </div>
          <Filterbox
            APIData={legsCount === 1 ? oneWayApi : secondLegApi}
            loading={legsCount === 1 ? loading : loadingSecondLeg}
            departingLocation={
              legsCount === 1
                ? departingLocation.show_LocFrom
                : arrivingLocation.show_LocTo
            }
            setUserFilters={setUserFilters}
            setEnableFilter={setEnableFilter}
            enableFilter={enableFilter}
            airline={airline}
            setAirline={setAirline}
            Text="black"
            Border={false}
            clearExpandedFlightData={clearExpandedFlightData}
          />
        </div>
      </div>
      {/* Loading Anim --Hidden because of cross */}
      {/* <div
        className={`loader fixed !z-[1100] top-0 bottom-0 right-0 left-0 ${
          loading ? "flex" : loadingSecondLeg ? "flex" : "hidden"
        } items-center justify-center`}
      >
        <div className="w-3/4 lg:w-1/5">
          <DotLottieReact
            src="https://lottie.host/43544e80-4e65-4a19-9b40-40bee1cf1b22/1oaVFrEvRC.lottie"
            loop
            autoplay
          />
        </div>
      </div> */}
    </div>
  );
};

export default Page;
