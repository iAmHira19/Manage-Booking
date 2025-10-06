"use client";
// Icons File
import { icons } from "@/constants/icons";
import { v4 as uuidv4 } from "uuid";
// Functions file
import BookingSectionTabs from "../BookingSectionTabs/BookingSectionTabs";
import BookingSectionMiniTabs from "../BookingSectionMiniTabs/BookingSectionMiniTabs";
import FlightNRoundTrip from "../Flight&RoundTrip/Flight&RoundTrip";
import FlightNOneWay from "../FlightNOneWay/FlightNOneWay";
import FlightNMultiCity from "../FlightNMultiCity/FlightNMultiCity";
import { components } from "@/constants/components";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./BookingSection.module.css";
import "./BookingSection.css";
import useAirline from "@/hooks/useAirline";
import useAirports from "@/hooks/useAirports";
import toast from "react-hot-toast";
import { Button } from "antd";

const BookingSection = () => {
  const { InputBoxText } = components;
  const { FaSearch, FaLocationDot, RxCross1 } = icons;
  const [isFlight, setIsFlight] = useState(true);
  const [isHotel, setIsHotel] = useState(false);
  const [isCars, setIsCars] = useState(false);
  const [isCruise, setIsCruise] = useState(false);
  const [isTTD, setIsTTD] = useState(false);
  const [isOneWay, setIsOneWay] = useState(false);
  const [isReturn, setIsReturn] = useState(true);
  const [isMultiCity, setIsMultiCity] = useState(false);
  const [isEnableTravel, setIsEnableTravel] = useState(false);
  const [isEnableEconomy, setIsEnableEconomy] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [economy, setEconomy] = useState(false);
  const [premiumEconomy, setPremiumEconomy] = useState(false);
  const [first, setFirst] = useState(false);
  const [business, setBusiness] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [nonStop, setNonStop] = useState(false);
  const [refundable, setRefundable] = useState(false);
  const [prefered_Airline, setPreferedAirline] = useState("");
  const [isNoPreference, setIsNoPreference] = useState(false);
  // Just to check if component has been mounted successfully or not
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const { data: AirportData } = useAirports("none");
  const { data: AirlineData } = useAirline();
  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  if (isClientLoaded) {
    if (!sessionStorage.getItem("tabId")) {
      sessionStorage.setItem("tabId", uuidv4());
    }
  }

  useEffect(() => {
    isClientLoaded &&
      sessionStorage.getItem("searchPageData") &&
      sessionStorage.removeItem("searchPageData");
    isClientLoaded &&
      sessionStorage.getItem("flightReviewPageData") &&
      sessionStorage.removeItem("flightReviewPageData");
    isClientLoaded &&
      sessionStorage.getItem("priceStructure") &&
      sessionStorage.removeItem("priceStructure");
    isClientLoaded &&
      sessionStorage.getItem("currentStage") &&
      sessionStorage.removeItem("currentStage");
    isClientLoaded &&
      sessionStorage.getItem("HostedCheckout_embedContainer") &&
      sessionStorage.removeItem("HostedCheckout_embedContainer");
    isClientLoaded &&
      sessionStorage.getItem("HostedCheckout_sessionId") &&
      sessionStorage.removeItem("HostedCheckout_sessionId");
    isClientLoaded &&
      sessionStorage.getItem("HostedCheckout_merchantState") &&
      sessionStorage.removeItem("HostedCheckout_merchantState");
    
  }, [isClientLoaded]);


  let tabId;
  if (isClientLoaded) {
    tabId = sessionStorage.getItem("tabId");
  }

  let [addMultiCity, setAddMultiCity] = useState([
    {
      id: uuidv4(),
      search_LocFrom: "",
      show_LocFrom: "",
      search_LocTo: "",
      show_LocTo: "",
      search_DepartingDate: "",
      show_DepartingDate: "",
    },
    {
      id: uuidv4(),
      search_LocFrom: "",
      show_LocFrom: "",
      search_LocTo: "",
      show_LocTo: "",
      search_DepartingDate: "",
      show_DepartingDate: "",
    },
  ]);

  let [addOnewayData, setAddOnewayData] = useState({
    search_LocFrom: "",
    show_LocFrom: "",
    search_LocTo: "",
    show_LocTo: "",
    search_DepartingDate: "",
    show_DepartingDate: "",
    search_Mode: "",
  });

  let [addReturnData, setAddReturnData] = useState({
    search_LocFrom: "",
    show_LocFrom: "",
    search_LocTo: "",
    show_LocTo: "",
    search_DepartingDate: "",
    show_DepartingDate: "",
    search_ArrivingDate: "",
    show_ArrivingDate: "",
    search_Mode: "",
  });

  const router = useRouter();

  const userData = useMemo(() => {
    const flightType = (
      isReturn ? 2 : isOneWay ? 1 : isMultiCity ? 3 : null
    ).toString();
    return {
      search_LocFrom:
        flightType == "2"
          ? addReturnData?.search_LocFrom
          : flightType == "1"
          ? addOnewayData?.search_LocFrom
          : flightType == "3" &&
            addMultiCity &&
            addMultiCity
              .map((mc) => {
                return mc.search_LocFrom && mc.search_LocFrom;
              })
              .join("~"),
      search_LocTo:
        flightType == "2"
          ? addReturnData.search_LocTo
          : flightType == "1"
          ? addOnewayData.search_LocTo
          : flightType == "3" &&
            addMultiCity &&
            addMultiCity.map((mc) => mc.search_LocTo).join("~"),
      ...(flightType === "2" && {
        search_ArrivingDate: addReturnData?.search_ArrivingDate,
        show_ArrivingDate: addReturnData?.show_ArrivingDate,
        show_DepartingDate: addReturnData?.show_DepartingDate,
        show_LocFrom: addReturnData.show_LocFrom,
        show_LocTo: addReturnData.show_LocTo,
      }),
      search_DepartingDate:
        flightType == "2"
          ? addReturnData.search_DepartingDate
          : flightType == "1"
          ? addOnewayData.search_DepartingDate
          : flightType == "3" &&
            addMultiCity &&
            addMultiCity.map((mc) => mc.search_DepartingDate).join("~"),
      ...(flightType === "1" && {
        show_DepartingDate: addOnewayData.show_DepartingDate,
        show_LocFrom: addOnewayData.show_LocFrom,
        show_LocTo: addOnewayData.show_LocTo,
      }),
      ...(flightType === "3" && {
        show_DepartingDate:
          addMultiCity &&
          addMultiCity.map((mc) => mc.show_DepartingDate).join("~"),
        show_LocFrom:
          addMultiCity && addMultiCity.map((mc) => mc.show_LocFrom).join("~"),
        show_LocTo:
          addMultiCity && addMultiCity.map((mc) => mc.show_LocTo).join("~"),
      }),
      search_Mode:
        flightType == "2"
          ? addReturnData.search_Mode
          : flightType == "1"
          ? addOnewayData.search_Mode
          : flightType == "3" &&
            addMultiCity &&
            addMultiCity.map((mc) => mc.search_Mode).join("~"),
      search_flightType: flightType,
      search_Adults: adults.toString(),
      search_Children: children.toString(),
      search_Infants: infants.toString(),
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
      search_NonStop: (nonStop ? 1 : 0).toString(),
      search_Refundable: (refundable ? 1 : 0).toString(),
      search_Airline: prefered_Airline ? prefered_Airline : "",
      search_Token: "",
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
    isMultiCity,
    isOneWay,
    isReturn,
    nonStop,
    refundable,
    prefered_Airline,
    addOnewayData,
    addReturnData,
    addMultiCity,
  ]);

  const [loading, setLoading] = useState(false);

  // Airlines
  const [airlineOptions, setAirlineOption] = useState([]);
  useEffect(() => {
    const newOptions = AirlineData.map((airline) => ({
      label: airline.tpAL_DISPLAYNAME,
      value: `${airline.tpAL_IATA}~${airline.tpAL_DISPLAYNAME}`,
    }));
    setAirlineOption([...newOptions]);
  }, [AirlineData]);

  // Airports
  const [airportOptions, setAirportOption] = useState([]);

  useEffect(() => {
    if (AirportData) {
      const newOptions = AirportData.map((airport, index) => ({
        label: airport.tpDescription,
        value: airport.tpAIRPORT_CODE,
        airportName: airport.tpAIRPORT_NAME,
        cityName: airport.tpAIRPORT_CITYNAME,
        countryName: airport.tpAIRPORT_COUNTRYNAME,
        key: `${airport.tpAIRPORT_CITYNAME}-${index}`,
      }));
      setAirportOption([...newOptions]);
    }
  }, [AirportData]);

  return (
    <div
      className={`pt-1 w-full md:w-3/4 ${styles.container1} bg-blue-900 font-gotham`}
      onClick={(e) => {
        e.stopPropagation();
        isEnableEconomy && setIsEnableEconomy(false);
        isEnableTravel && setIsEnableTravel(false);
      }}
    >
      {/* Flights, Hotels, Card, Cruise, Things to Do Buttons */}
      <div className="flightTabsContainer w-full px-2 mt-1 font-gotham">
        <BookingSectionTabs
          isFlight={isFlight}
          setIsFlight={setIsFlight}
          isHotel={isHotel}
          setIsHotel={setIsHotel}
          isCars={isCars}
          setIsCars={setIsCars}
          isCruise={isCruise}
          setIsCruise={setIsCruise}
          isTTD={isTTD}
          setIsTTD={setIsTTD}
        />
      </div>
      <div
        className={`${styles.bottomSearchContainer} w-full pb-2 md:px-2 md:pb-2 font-gotham`}
      >
        <div
          className={`input ${
            isFlight ? "flex" : "hidden"
          } flex-col bg-white rounded rounded-tl-none px-4 py-2 md:py-5 md:px-12 gap-2 md:gap-5 font-gotham`}
        >
          <BookingSectionMiniTabs
            isOneWay={isOneWay}
            isReturn={isReturn}
            isMultiCity={isMultiCity}
            setIsOneWay={setIsOneWay}
            setIsReturn={setIsReturn}
            setIsMultiCity={setIsMultiCity}
            adults={adults}
            Children={children}
            infants={infants}
            setAdults={setAdults}
            setChildren={setChildren}
            setInfants={setInfants}
            economy={economy}
            setEconomy={setEconomy}
            premiumEconomy={premiumEconomy}
            setPremiumEconomy={setPremiumEconomy}
            business={business}
            setBusiness={setBusiness}
            first={first}
            setFirst={setFirst}
            isNoPreference={isNoPreference}
            setIsNoPreference={setIsNoPreference}
            isEnableTravel={isEnableTravel}
            setIsEnableTravel={setIsEnableTravel}
            isEnableEconomy={isEnableEconomy}
            setIsEnableEconomy={setIsEnableEconomy}
          />
          <div
            className={`flight&&RoundTripContainer ${
              isFlight ? (isReturn ? "block" : "hidden") : "hidden"
            } font-gotham`}
          >
            <FlightNRoundTrip
              options={airportOptions}
              addReturnData={addReturnData}
              setAddReturnData={setAddReturnData}
            />
          </div>
          <div
            className={`flight&&OneWayContainer ${
              isFlight ? (isOneWay ? "block" : "hidden") : "hidden"
            } font-gotham`}
          >
            <FlightNOneWay
              options={airportOptions}
              addOnewayData={addOnewayData}
              setAddOnewayData={setAddOnewayData}
            />
          </div>
          <div
            className={`flight&&MultiCityContainer flex md:pr-14 flex-col gap-3 ${
              isFlight ? (isMultiCity ? "block" : "hidden") : "hidden"
            } font-gotham`}
          >
            <FlightNMultiCity
              options={airportOptions}
              addMultiCity={addMultiCity}
              setAddMultiCity={setAddMultiCity}
            />
          </div>
          <button
            className="text-black text-left text-[13px] md:text-base mt-4 w-fit font-gotham font-light md:px-2"
            onClick={() => setShowAdvance(!showAdvance)}
          >
            Show Advanced Options
          </button>
          <div
            className={`advanceOption ${
              showAdvance ? "flex" : "hidden"
            } flex-col gap-3 font-gotham md:px-2`}
          >
            <div className="checkboxes flex items-center gap-3 font-gotham">
              <div className="nonStop flex justify-start gap-2 items-center font-gotham">
                <input
                  style={{ fontFamily: "Gotham" }}
                  type="checkbox"
                  name="nonStop"
                  id="nonStop"
                  onClick={() => {
                    setNonStop(!nonStop);
                  }}
                />{" "}
                <label
                  htmlFor="nonStop"
                  className="text-xs md:text-base font-gotham font-light"
                >
                  Non Stop
                </label>
              </div>
              <div className="refundable flex justify-start gap-2 items-center">
                <input
                  type="checkbox"
                  style={{ fontFamily: "Gotham" }}
                  name="refundable"
                  id="refundable"
                  onClick={() => {
                    setRefundable(!refundable);
                  }}
                />{" "}
                <label
                  htmlFor="refundable"
                  className="text-xs md:text-base font-gotham font-light"
                >
                  Refundable
                </label>
              </div>
            </div>
            <div
              className={`${styles.preferedAirlines} ${styles.dropdownWrapper} ${styles.antSelect} antSelect ${styles.border} rounded max-w-full md:max-w-[32%] font-gotham`}
            >
              <InputBoxText
                airline={true}
                border="border"
                options={airlineOptions}
                ReadOnly={false}
                name="preferedAirline"
                value={prefered_Airline == "" ? null : prefered_Airline}
                Placeholder="Prefered Airline"
                InputIcon={<FaLocationDot />}
                CrossIcon={<RxCross1 />}
                className={`${styles.select} ${styles.antSelect}`}
                onChange={(name, value, i) => {
                  setPreferedAirline(value?.split("~")[0]);
                }}
              />
            </div>
          </div>
          <Button
            className="!self-center text-xs md:text-base !font-gotham mt-2 md:mt-auto mb-1 !p-4"
            color="orange"
            htmlType="button"
            variant="solid"
            size="small"
            icon={<FaSearch />}
            loading={loading}
            onClick={() => {
              if (isFlight) {
                if (isReturn) {
                  if (
                    userData.search_LocFrom == "" ||
                    userData.search_LocFrom == null ||
                    userData.search_LocFrom == undefined
                  ) {
                    toast.error("Departing Location cannot be empty", {
                      position: "top-center",
                    });
                    return;
                  }
                  if (
                    userData.search_LocTo == "" ||
                    userData.search_LocTo == null ||
                    userData.search_LocTo == undefined
                  ) {
                    toast.error("Arriving location cannot be empty");
                    return;
                  }
                  if (
                    userData.search_DepartingDate == "" ||
                    userData.search_DepartingDate == null ||
                    userData.search_DepartingDate == undefined
                  ) {
                    toast.error("Departing date cannot be empty");
                    return;
                  }
                  if (
                    userData.search_ArrivingDate == "" ||
                    userData.search_ArrivingDate == null ||
                    userData.search_ArrivingDate == undefined
                  ) {
                    toast.error("Arriving date cannot be empty");
                    return;
                  }
                  if (userData.search_LocFrom == userData.search_LocTo) {
                    toast.error(
                      "Departing and Arriving locations cannot be same"
                    );
                    return;
                  } else {
                    setLoading(true);
                    const userDataString = JSON.stringify(userData);
                    if (
                      isClientLoaded &&
                      sessionStorage.getItem("searchPageData")
                    ) {
                      sessionStorage.setItem(
                        "searchPageData",
                        `${tabId}__${userDataString}`
                      );
                    }
                    if (
                      isClientLoaded &&
                      !sessionStorage.getItem("searchPageData")
                    ) {
                      sessionStorage.setItem(
                        "searchPageData",
                        `${tabId}___${userDataString}`
                      );
                    }
                    router.push(`/searchFlight`);
                  }
                }
                if (isOneWay) {
                  if (
                    userData.search_LocFrom == "" ||
                    userData.search_LocFrom == null ||
                    userData.search_LocFrom == undefined
                  ) {
                    toast.error("Departing Location cannot be empty", {
                      position: "top-center",
                    });
                    return;
                  }
                  if (
                    userData.search_LocTo == "" ||
                    userData.search_LocTo == null ||
                    userData.search_LocTo == undefined
                  ) {
                    toast.error("Arriving location cannot be empty");
                    return;
                  }
                  if (
                    userData.search_DepartingDate == "" ||
                    userData.search_DepartingDate == null ||
                    userData.search_DepartingDate == undefined
                  ) {
                    toast.error("Departing date cannot be empty");
                    return;
                  }
                  if (userData.search_LocFrom == userData.search_LocTo) {
                    toast.error(
                      "Departing and Arriving locations cannot be same"
                    );
                    return;
                  } else {
                    setLoading(true);
                    const userDataString = JSON.stringify(userData);
                    if (
                      isClientLoaded &&
                      sessionStorage.getItem("searchPageData")
                    ) {
                      sessionStorage.setItem(
                        "searchPageData",
                        `${tabId}__${userDataString}`
                      );
                    }
                    if (
                      isClientLoaded &&
                      !sessionStorage.getItem("searchPageData")
                    ) {
                      sessionStorage.setItem(
                        "searchPageData",
                        `${tabId}___${userDataString}`
                      );
                    }
                    router.push(`/searchFlight`);
                  }
                }
                if (isMultiCity) {
                  if (addMultiCity.length > 0) {
                    for (let idx = 0; idx < addMultiCity.length; idx++) {
                      let item = addMultiCity[idx];
                      if (
                        item.search_LocFrom == "" ||
                        item.search_LocFrom == null ||
                        item.search_LocFrom == undefined
                      ) {
                        toast.error(
                          `Departing Location cannot be empty for leg ${
                            idx + 1
                          }`
                        );
                        return;
                      }
                      if (
                        item.search_LocTo == "" ||
                        item.search_LocTo == null ||
                        item.search_LocTo == undefined
                      ) {
                        toast.error(
                          `Arriving location cannot be empty for leg ${idx + 1}`
                        );
                        return;
                      }
                      if (item.search_LocFrom == item.search_LocTo) {
                        toast.error(
                          `Departing and Arriving locations cannot be same for leg ${
                            idx + 1
                          }`
                        );
                        return;
                      }
                      if (
                        item.search_DepartingDate == "" ||
                        item.search_DepartingDate == null ||
                        item.search_DepartingDate == undefined
                      ) {
                        toast.error(
                          `Departing date cannot be empty for leg ${idx + 1}`
                        );
                        return;
                      }
                    }
                    setLoading(true);
                    const userDataString = JSON.stringify(userData);
                    if (
                      isClientLoaded &&
                      sessionStorage.getItem("searchPageData")
                    ) {
                      sessionStorage.setItem(
                        "searchPageData",
                        `${tabId}__${userDataString}`
                      );
                    }
                    if (
                      isClientLoaded &&
                      !sessionStorage.getItem("searchPageData")
                    ) {
                      sessionStorage.setItem(
                        "searchPageData",
                        `${tabId}___${userDataString}`
                      );
                    }
                    router.push(`/searchFlight`);
                  }
                }
              }
            }}
          >
            <span> Search Flights</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSection;
