// VerticalTimeline.jsx
"use client";
import React, { useEffect, useState } from "react";
import { formatTime } from "@/utils/formatTime";
import { convertMinutesToHours } from "@/utils/convertMinutesToHours";
import { RiFlightTakeoffFill } from "react-icons/ri";
import { MdFlightLand, MdOutlineConnectingAirports } from "react-icons/md";
import { Timeline } from "antd";
import { IoClose } from "react-icons/io5";

const VerticalTimeline = ({
  // id,
  depCityName,
  arrCityName,
  dataItem,
  setShowFlightDetails,
  duration,
  showFlightDetails,
  depTime,
  depCity,
  depDate,
  depAirportName,
  arrAirportName,
  arrTime,
  arrCity,
  arrDate,
}) => {
  const [timelineData, setTimelineData] = useState([]);
  useEffect(() => {
    // let data = [];
    // if (data.length <= 0) {
    //   data = dataItem?.[0]?.keyData == id && dataItem;
    //   console.log("data from vrtline: ", data);
    // }
    // console.log("data from vrtline from outside: ", data);
    let response =
      dataItem.length > 0
        ? dataItem.map((segment, index) => {
            const departureItem = {
              children: (
                <div
                  className="parentTimelineItems relative w-full"
                  key={index}
                >
                  <div className="w-full">
                    <div className="left min-h-6">
                      <div className="font-bold text-xs font-gotham">
                        {segment?.depTime ||
                          formatTime(segment?.Departure?.time)}{" "}
                        <span className="text-blue-600 font-gotham">
                          {segment?.depCityName || depCityName}
                        </span>{" "}
                      </div>
                    </div>
                    <div className="right absolute right-0 top-0 flex flex-col gap-y-3">
                      <div className="font-bold text-md flex items-end flex-col gap-y-2">
                        {/* <Image
                    unoptimized
                    alt="Logo"
                    src={`/img/AirlineLogo/${segment && segment.carrier}.png`}
                    width={95}
                    height={95}
                  /> */}
                        <span>
                          <span className="font-normal text-xs font-gotham text-slate-400 ml-3">
                            {segment.carrier}
                          </span>{" "}
                          -{" "}
                          <span className="font-bold text-xs font-gotham">
                            {segment?.flightNumber || segment?.number}
                          </span>
                        </span>
                      </div>
                      <div className="text-gray-600 font-gotham text-xs w-32 text-end">
                        {segment?.actualCarrierName ||
                          segment?.operatingCarrierName}
                      </div>
                    </div>
                  </div>
                </div>
              ),
              dot: (
                <RiFlightTakeoffFill
                  size={24}
                  color="black"
                ></RiFlightTakeoffFill>
              ),
            };

            const durationItem = {
              children: (
                <div className="text-gray-500 text-xs relative -left-16 min-h-6 w-full">
                  {convertMinutesToHours(
                    segment?.durationInMinutes || duration
                  )}
                </div>
              ),
              dot: <span></span>,
            };

            const arrivalItem = {
              children: (
                <div className="parentTimelineItems w-full" key={index + "A"}>
                  <div className="w-full flex justify-between items-start">
                    <div className="left min-h-16">
                      <div className="font-bold text-xs">
                        {segment?.arrTime || formatTime(segment?.Arrival?.time)}{" "}
                        <span className="text-blue-600 text-xs">
                          {segment?.arrCityName || arrCityName}
                        </span>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              ),
              dot: <MdFlightLand size={24} color="black"></MdFlightLand>,
            };

            const stopTime = segment.stopTime != "0" &&
              dataItem.length != index + 1 && {
                children: (
                  <div
                    className={`${
                      dataItem.length === index + 1 ? "hidden" : "block"
                    } transit w-full font-bold min-h-16`}
                  >
                    <div className="bg-slate-300 text-black text-xs p-2">
                      Transit {convertMinutesToHours(Number(segment.stopTime))}
                    </div>
                  </div>
                ),
                dot: <MdOutlineConnectingAirports size={35} color="black" />,
              };

            return [departureItem, durationItem, arrivalItem, stopTime].filter(
              Boolean
            );
          })
        : [];
    setTimelineData([].concat(...response));
  }, [dataItem, depCityName, arrCityName, duration]);

  return (
    <div className="w-full h-full p-6 relative">
      <div className="absolute top-0 right-0 p-4">
        <IoClose
          className="cursor-pointer text-[20px]"
          onClick={() => {
            setShowFlightDetails(false);
          }}
        />
      </div>
      <div className="w-full flex flex-col gap-y-6 pt-10">
        {" "}
        <div className="head flex items-center justify-between">
          <h2
            className="font-gotham"
            onClick={(e) => {
              e.stopPropagation();
              console.log("dataItem from verticalTimeline: ", dataItem);
            }}
          >
            {depCityName} to {arrCityName}
          </h2>
          <span className="cursor-pointer font-gotham">{depDate}</span>
        </div>
        <div className="flex w-full justify-center items-center mt-10">
          <Timeline
            items={timelineData}
            style={{
              width: "80%",
              display: "block",
              margin: "0 auto",
              padding: "0",
            }}
          ></Timeline>
        </div>
      </div>
    </div>
  );
};

export default VerticalTimeline;
