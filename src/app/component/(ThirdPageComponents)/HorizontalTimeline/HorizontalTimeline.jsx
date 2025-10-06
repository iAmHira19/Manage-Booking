"use client";
import React, { useEffect, useState } from "react";
import styles from "./HorizontalTimeline.module.css";
import { convertMinutesToHours } from "@/utils/convertMinutesToHours";
import { RiFlightTakeoffFill } from "react-icons/ri";
import { MdOutlineConnectingAirports } from "react-icons/md";
import { MdFlightLand } from "react-icons/md";
import VerticalTimeline from "../VerticalTimeline/VerticalTimeline";
const HorizontalTimeline = ({
  // showFlightDetails,
  // setShowFlightDetails,
  dataItem,
  duration,
  depTime,
  depCityName,
  depCity,
  depDate,
  depAirportName,
  arrAirportName,
  arrTime,
  arrCity,
  arrDate,
  arrCityName,
}) => {
  const [dataToPass, setDataToPass] = useState([]);
  const [showFlightDetails, setShowFlightDetails] = useState(false);
  useEffect(() => {
    if (!dataItem) return;
  }, [dataItem]);
  return (
    <>
      <div className={`${styles["timeline-container"]}`}>
        <div className={`${styles["flight-list-info"]}`}>
          <div className={`${styles["flight-pos"]}`}>
            <div className={`${styles["flight-time"]}`}>
              {depTime && depTime}
            </div>
            <div
              className={`${styles["flight-city"]}`}
              title={
                depAirportName
                  ? `Departure from airport «${
                      depAirportName && depAirportName
                    }», ${depCityName && depCityName} at ${
                      depTime && depTime
                    }. Local time`
                  : null
              }
            >
              {depCityName && depCityName}
            </div>
          </div>
          <div
            className={`${styles["flight-date"]} text-md`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {depDate && depDate}
          </div>

          {/* Horizontal line starts */}
          <div className={`${styles["flights-points"]}`}>
            <div className={`${styles["rel"]}`}>
              <div className={`${styles["flights-points-line"]}`}>
                <span>
                  <span className={styles["flights-icon"]}>
                    <RiFlightTakeoffFill className="text-base sm:text-xl" />
                  </span>
                  <span
                    className={`${styles["flight-abbr"]}`}
                    title={
                      depAirportName
                        ? `Departure from airport «${
                            depAirportName && depAirportName
                          }», ${depCityName && depCityName} at ${
                            depTime && depTime
                          }. Local time`
                        : null
                    }
                  >
                    {depCity && depCity}
                  </span>
                </span>
                {duration && (
                  <div
                    className={`${styles["flights-duration"]} !text-[9px] sm:text-xs`}
                  >
                    <span className={`inline-block sm:hidden`}>
                      {dataItem.length - 1 === 0 ? null : dataItem.length - 1}{" "}
                      {dataItem.length - 1 === 0
                        ? "Nonstop"
                        : dataItem.length - 1 > 1
                        ? "Stops"
                        : "Stop"}
                      ,
                    </span>{" "}
                    <span className="text-[9px] sm:text-xs">
                      {duration && convertMinutesToHours(duration)}
                    </span>
                  </div>
                )}
                {dataItem &&
                  dataItem?.length > 1 &&
                  dataItem?.map((dItem, idx) => {
                    if (idx !== 0) {
                      return (
                        <span
                          key={idx}
                          className={`hidden sm:inline-block ${styles["flights-pointContainer"]}  ${styles["connecting-icon"]}`}
                        >
                          <span className={`${styles["flights-icon"]}`}>
                            <MdOutlineConnectingAirports
                              className={`${styles["con-icon"]}`}
                            ></MdOutlineConnectingAirports>
                          </span>
                          <span className={`${styles["flight-abbr"]}`}>
                            {dItem?.depCity
                              ? dItem?.depCity
                              : dItem?.Departure?.location
                              ? dItem?.Departure?.location
                              : null}
                            <div className={`${styles["flights-points-text"]}`}>
                              {dataItem &&
                                convertMinutesToHours(
                                  dataItem && dataItem[idx - 1]?.stopTime
                                )}{" "}
                            </div>
                          </span>
                        </span>
                      );
                    }
                  })}
                <span
                  className="sm:hidden inline-block relative top-[4px] text-blue-900 !text-[8px] sm:text-xs"
                  onClick={() => {
                    setShowFlightDetails(true);
                    setDataToPass(dataItem);
                  }}
                >
                  Flight Details
                </span>
                <span>
                  <span className={`${styles["flights-icon"]}`}>
                    <MdFlightLand className="text-base sm:text-xl"></MdFlightLand>
                  </span>
                  <span
                    className={`${styles["flight-abbr"]}`}
                    title={
                      arrAirportName
                        ? `Arrival to ${arrAirportName && arrAirportName} at ${
                            arrTime && arrTime
                          }. Local time`
                        : null
                    }
                  >
                    {arrCity && arrCity}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* Horizontal line ends */}

          <div className={`${styles["flight-date"]}`}>{arrDate && arrDate}</div>
          <div className={`${styles["flight-pos"]}`}>
            <div className={`${styles["flight-time"]} `}>
              {arrTime && arrTime}
            </div>
            <div
              className={`${styles["flight-city"]}`}
              title={
                arrCityName
                  ? `Arrival to ${arrCityName && arrCityName} at ${
                      arrTime && arrTime
                    }. Local time`
                  : null
              }
            >
              {arrCityName && arrCityName}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          showFlightDetails
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } w-screen h-screen fixed inset-0 bg-black/40 z-50 flex items-center justify-center transition-all duration-300 ease-in-out`}
      >
        <div
          className="bg-white overflow-y-auto relative pt-14 w-screen md:w-3/4 lg:w-1/2 h-full"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <VerticalTimeline
            dataItem={dataToPass}
            // id={dataToPass}
            showFlightDetails={showFlightDetails}
            arrCityName={arrCityName}
            depCityName={depCityName}
            arrDate={arrDate}
            depDate={depDate}
            depCity={depCity}
            arrTime={arrTime}
            duration={duration}
            depTime={depTime}
            setShowFlightDetails={setShowFlightDetails}
          ></VerticalTimeline>
        </div>
      </div>
    </>
  );
};

export default HorizontalTimeline;
