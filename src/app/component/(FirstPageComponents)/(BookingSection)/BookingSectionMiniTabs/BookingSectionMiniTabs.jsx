import React from "react";
// handlers
// Components
import { components } from "@/constants/components";
// icons
import { icons } from "@/constants/icons";

const BookingSectionMiniTabs = ({
  isReturn,
  isOneWay,
  isMultiCity,
  setIsOneWay,
  setIsReturn,
  setIsMultiCity,
  adults,
  Children,
  infants,
  setAdults,
  setChildren,
  setInfants,
  economy,
  setEconomy,
  premiumEconomy,
  setPremiumEconomy,
  business,
  setBusiness,
  first,
  setFirst,
  isEnableTravel,
  setIsEnableTravel,
  isEnableEconomy,
  setIsEnableEconomy,
  isNoPreference,
  setIsNoPreference,
}) => {
  const { MiniButton, Travel, TravelersCompo, ClassCompo } = components;
  const { RiArrowDropDownLine, FaPersonWalkingLuggage } = icons;
  return (
    <div className="minitabs md:flex md:justify-between font-gotham">
      <div className="flex items-center md:items-start mb-3 md:mb-0 justify-between md:justify-normal gap-1 md:gap-3 font-gotham md:w-1/2">
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
      <div className="flex my-1 gap-1 md:gap-3 relative font-gotham justify-between">
        <div className="Travel font-gotham">
          <Travel
            Text={`${adults} ${adults > 1 ? "Adults" : "Adult"}${
              Children > 0
                ? `, ${Children} ${Children > 1 ? "Children" : "Child"}`
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
                      setIsEnableTravel((prev) => !prev);
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
             absolute left-1 md:left-auto md:right-3 z-40 font-gotham`}
          >
            <TravelersCompo
              adults={adults}
              setAdults={setAdults}
              Children={Children}
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
                      setIsEnableEconomy((prev) => !prev);
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
            } absolute !right-4 md:right-0 z-40 font-gotham`}
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
  );
};

export default BookingSectionMiniTabs;
