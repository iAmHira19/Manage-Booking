"use client";
import React, { useEffect, useState } from "react";
import TButton from "../TravelOptions/TButton";

const TravelOp = ({
  Age,
  Condition,
  state,
  setState,
  Case,
  adults,
  Children,
  infants,
}) => {
  const [totalTravelers, setTotalTravelers] = useState(
    adults + Children + infants
  );

  useEffect(() => {
    setTotalTravelers(adults + Children + infants);
  }, [adults, Children, infants]);

  const handleDecreaseTravelers = (e) => {
    e.stopPropagation();
    setState((prevTraveler) =>
      Case == "adult"
        ? prevTraveler == 1
          ? 1
          : prevTraveler == infants
          ? prevTraveler
          : prevTraveler - 1
        : prevTraveler == 0
        ? 0
        : prevTraveler - 1
    );
  };

  const handleIncreaseTravelers = (e) => {
    e.stopPropagation();
    setState((prevTraveler) => prevTraveler + 1);
  };

  const isIncreaseDisabled =
    totalTravelers >= 6 || (Case === "infant" && infants >= adults);

  return (
    <div className="TravelOp flex items-center justify-between w-full font-gotham font-light">
      <div>
        <TButton Text="-" onClick={handleDecreaseTravelers} />
      </div>
      <div className="flex items-center gap-4 md:gap-3 font-gotham">
        <div className="Content font-gotham">
          <h3 className="text-[10px] sm:text-xs md:text-sm text-center font-[400] font-gotham">
            {state} {Age}
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm font-light text-slate-500 font-gotham text-center">
            {Condition}
          </p>
        </div>
      </div>
      <div className="stateChanger flex gap-1 font-gotham">
        <TButton
          Text="+"
          onClick={handleIncreaseTravelers}
          disabled={isIncreaseDisabled}
        />
      </div>
    </div>
  );
};

export default TravelOp;
