import Image from "next/image";
import React, { useEffect, useRef } from "react";

const Checkbox = ({
  filterDescription,
  filterCount,
  filterCode,
  Icon,
  onChecked,
  checked = false, // Add a checked prop with default value
}) => {
  // Reference to the checkbox element
  const checkboxRef = useRef(null);

  // Update checkbox element when checked prop changes
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = checked;
    }
  }, [checked]);

  return (
    <div className="flex justify-between font-gotham">
      <div className={`form flex items-center gap-3 font-gotham`}>
        <input
          type="checkbox"
          id={filterDescription}
          className="mr-2 font-gotham"
          ref={checkboxRef}
          defaultChecked={checked} // Set initial checked state
          onClick={(e) => onChecked(e, filterDescription, filterCode)}
        />
        <label
          htmlFor={filterDescription}
          id={filterDescription}
          className={`flex flex-wrap items-center ${
            Icon ? "gap-x-5" : "gap-1"
          } font-gotham`}
        >
          {Icon && (
            <div className="w-[105px] h-[40px] relative flex items-center justify-center bg-white rounded overflow-hidden">
              <Image
                unoptimized
                src={`/img/AirlineLogo/${Icon}.png`}
                alt="flightLogo"
                fill
                className="object-contain"
              />
            </div>
          )}
          {`${filterDescription == "1Stop" ? "1 Stop" : filterDescription} ${
            filterCode ? `(${filterCode})` : ""
          } (${filterCount})`}
        </label>
      </div>
    </div>
  );
};

export default Checkbox;
