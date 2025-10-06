import React from "react";

const Rad_LabPair = ({
  Label,
  onEconomySmash,
  onPremiumEconomySmash,
  onBusinessSmash,
  onFirstSmash,
  onPreferenceSmash,
}) => {
  const handleEconomySmash = () => {
    onEconomySmash(true);
    onPremiumEconomySmash(false);
    onBusinessSmash(false);
    onFirstSmash(false);
    onPreferenceSmash(false);
  };
  const handlePremiumEconomySmash = () => {
    onPremiumEconomySmash(true);
    onEconomySmash(false);
    onBusinessSmash(false);
    onPreferenceSmash(false);
    onFirstSmash(false);
  };
  const handleBusinessSmash = () => {
    onBusinessSmash(true);
    onEconomySmash(false);
    onPremiumEconomySmash(false);
    onPreferenceSmash(false);
    onFirstSmash(false);
  };
  const handleFirstSmash = () => {
    onFirstSmash(true);
    onEconomySmash(false);
    onPremiumEconomySmash(false);
    onPreferenceSmash(false);
    onBusinessSmash(false);
  };
  const handelNoPreference = () => {
    onFirstSmash(false);
    onEconomySmash(false);
    onPremiumEconomySmash(false);
    onPreferenceSmash(true);
    onBusinessSmash(false);
  };
  return (
    <div className="flex gap-x-2 md:gap-3 font-gotham font-light">
      <input
        type="radio"
        name="Economy"
        style={{ fontFamily: "Gotham" }}
        id={Label}
        onClick={
          Label == "Economy"
            ? handleEconomySmash
            : Label == "Premium Economy"
            ? handlePremiumEconomySmash
            : Label == "Buisness"
            ? handleBusinessSmash
            : Label == "First"
            ? handleFirstSmash
            : Label == "No Preference" && handelNoPreference
        }
      />
      <label
        htmlFor={Label}
        className="text-[10px] sm:text-xs md:text-sm font-gotham"
      >
        {Label}
      </label>
    </div>
  );
};

export default Rad_LabPair;
