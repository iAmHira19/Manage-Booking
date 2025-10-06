import React from "react";
import Rad_LabPair from "../Rad_LabPair/Rad_LabPair";

const ClassCompo = ({
  setEconomy,
  setPremiumEconomy,
  setBusiness,
  setFirst,
  setIsNoPreference,
}) => {
  return (
    <div className="ClassContainer bg-white w-40 sm:w-44 md:w-56 border md:border rounded py-2 md:py-4 flex flex-col gap-2 md:gap-5 font-gotham shadow-sm">
      <h2 className="text-blue-900 w-full mb-1 text-xs sm:text-sm md:text-lg font-gotham text-center">
        Class
      </h2>
      <div className="radioContainer flex flex-col gap-1 md:gap-2 px-2 md:px-7 font-gotham">
        <Rad_LabPair
          Label={"No Preference"}
          onEconomySmash={setEconomy}
          onPremiumEconomySmash={setPremiumEconomy}
          onBusinessSmash={setBusiness}
          onFirstSmash={setFirst}
          onPreferenceSmash={setIsNoPreference}
        />
        <Rad_LabPair
          Label={"Economy"}
          onEconomySmash={setEconomy}
          onPremiumEconomySmash={setPremiumEconomy}
          onBusinessSmash={setBusiness}
          onFirstSmash={setFirst}
          onPreferenceSmash={setIsNoPreference}
        />
        <Rad_LabPair
          Label={"Premium Economy"}
          onEconomySmash={setEconomy}
          onPremiumEconomySmash={setPremiumEconomy}
          onBusinessSmash={setBusiness}
          onFirstSmash={setFirst}
          onPreferenceSmash={setIsNoPreference}
        />
        <Rad_LabPair
          Label={"Buisness"}
          onEconomySmash={setEconomy}
          onPremiumEconomySmash={setPremiumEconomy}
          onBusinessSmash={setBusiness}
          onFirstSmash={setFirst}
          onPreferenceSmash={setIsNoPreference}
        />
        <Rad_LabPair
          Label={"First"}
          onEconomySmash={setEconomy}
          onPremiumEconomySmash={setPremiumEconomy}
          onBusinessSmash={setBusiness}
          onFirstSmash={setFirst}
          onPreferenceSmash={setIsNoPreference}
        />
      </div>
    </div>
  );
};

export default ClassCompo;
