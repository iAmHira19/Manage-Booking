import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const useCustomHooks = () => {
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
  const [departingLocation, setDepartingLocation] = useState("");
  const [arrivingLocation, setArrivingLocation] = useState("");
  const [prefered_Airline, setPreferedAirline] = useState("");
  const [isNoPreference, setIsNoPreference] = useState(false);
  const [isDeparting, setIsDeparting] = useState(false);
  const [isArriving, setIsArriving] = useState(false);
  let [addMultiCity, setAddMultiCity] = useState([
    {
      id: uuidv4(),
      search_LocFrom: "",
      search_LocTo: "",
      search_DepartingDate: "",
    },
  ]);
  let [addOnewayData, setAddOnewayData] = useState({
    search_LocFrom: "",
    search_LocTo: "",
    search_DepartingDate: "",
    show_DepartingDate: "",
    search_Mode: "",
  });
  let [addReturnData, setAddReturnData] = useState({
    search_LocFrom: "",
    search_LocTo: "",
    search_DepartingDate: "",
    search_ArrivingDate: "",
    search_Mode: "",
  });
  const hooks = {
    isFlight,
    setIsFlight,
    isHotel,
    setIsHotel,
    isCars,
    setIsCars,
    isCruise,
    setIsCruise,
    isTTD,
    setIsTTD,
    isOneWay,
    setIsOneWay,
    isReturn,
    setIsReturn,
    isMultiCity,
    setIsMultiCity,
    isEnableTravel,
    setIsEnableTravel,
    isEnableEconomy,
    setIsEnableEconomy,
    adults,
    setAdults,
    children,
    setChildren,
    infants,
    setInfants,
    economy,
    setEconomy,
    premiumEconomy,
    setPremiumEconomy,
    first,
    setFirst,
    business,
    setBusiness,
    addMultiCity,
    setAddMultiCity,
    departingLocation,
    setDepartingLocation,
    arrivingLocation,
    setArrivingLocation,
    isDeparting,
    setIsDeparting,
    showAdvance,
    setShowAdvance,
    nonStop,
    setNonStop,
    refundable,
    setRefundable,
    isArriving,
    setIsArriving,
    addOnewayData,
    setAddOnewayData,
    addReturnData,
    setAddReturnData,
    prefered_Airline,
    setPreferedAirline,
    isNoPreference,
    setIsNoPreference,
  };
  Object.freeze(hooks);
  return hooks;
};
export { useCustomHooks };
