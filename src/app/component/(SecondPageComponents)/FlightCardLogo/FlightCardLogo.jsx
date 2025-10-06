import Image from "next/image";
import React from "react";

const FlightCardLogo = ({
  airlineCode,
  airlineLogo,
  airlineName,
  flightNumber,
}) => {
  return (
    <>
      <Image
        unoptimized
        alt="Logo"
        src={`/img/AirlineLogo/${airlineLogo}.png`}
        width={75}
        height={75}
        className="hidden CT:inline-block"
      ></Image>

      <p className="text-xs CT:text-sm mt-2 text-slate-600 CT:text-slate-400 font-gotham font-normal CT:font-bold mb-1">
        {airlineName && airlineName}
      </p>

      <p className="text-xs CT:text-sm text-slate-600 CT:text-slate-400 font-gotham font-normal CT:font-bold">
        {`${airlineCode && airlineCode}-${flightNumber && flightNumber}`}
      </p>
    </>
  );
};

export default FlightCardLogo;
