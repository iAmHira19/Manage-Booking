import React from "react";
// styles
import styles from "@/app/page.module.css";
// components
import { components } from "@/constants/components";
// Icons
import { icons } from "@/constants/icons";

const BookingSectionTabs = ({
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
}) => {
  const {
    RiFlightTakeoffLine,
    LuHotel,
    SiMentorcruise,
    SiSmartthings,
    IoCarSharp,
  } = icons;
  const { Button } = components;
  return (
    <div className="relative pr-3 font-gotham">
      <div className={`${styles.TabBar} bg-blue-900 flex font-gotham`}>
        <Button
          disabled={false}
          Text="Flight"
          width="w-full"
          PYXL="xl:py-5"
          PYSM="sm:py-3"
          onClick={() => {
            setIsHotel(false);
            setIsCars(false);
            setIsCruise(false);
            setIsTTD(false);
            setIsFlight(true);
          }}
          Icon={<RiFlightTakeoffLine></RiFlightTakeoffLine>}
          Class={isFlight && "active"}
        />
        <Button
          disabled={true}
          Text="Hotels"
          width="w-full"
          PYXL="xl:py-5"
          PYSM="sm:py-3"
          onClick={() => {
            setIsHotel(true);
            setIsCars(false);
            setIsCruise(false);
            setIsTTD(false);
            setIsFlight(false);
          }}
          Icon={<LuHotel></LuHotel>}
          Class={isHotel && "active"}
        />
        <Button
          disabled={true}
          Text="Cars"
          width="w-full"
          PYXL="xl:py-5"
          PYSM="sm:py-3"
          onClick={() => {
            setIsHotel(false);
            setIsCars(true);
            setIsCruise(false);
            setIsTTD(false);
            setIsFlight(false);
          }}
          Icon={<IoCarSharp></IoCarSharp>}
          Class={isCars && "active"}
        />
        <Button
          disabled={true}
          Text="Cruise"
          width="w-full"
          PYXL="xl:py-5"
          PYSM="sm:py-3"
          onClick={() => {
            setIsHotel(false);
            setIsCars(false);
            setIsCruise(true);
            setIsTTD(false);
            setIsFlight(false);
          }}
          Icon={<SiMentorcruise></SiMentorcruise>}
          Class={isCruise && "active"}
        />
        <Button
          disabled={true}
          Text="Activity"
          width="w-full"
          PYXL="xl:py-5"
          PYSM="sm:py-3"
          onClick={() => {
            setIsHotel(false);
            setIsCars(false);
            setIsCruise(false);
            setIsTTD(true);
            setIsFlight(false);
          }}
          Icon={<SiSmartthings></SiSmartthings>}
          Class={isTTD && "active"}
        />
      </div>
    </div>
  );
};

export default BookingSectionTabs;
