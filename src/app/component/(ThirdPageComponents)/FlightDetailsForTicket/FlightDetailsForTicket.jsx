"use client";
import React from "react";

function FlightDetailsForTicket({
  D_City,
  A_City,
  Aircraft_No,
  Date,
  Day,
  Departs,
  Duration,
  Airline,
  Arrives,
  Stops,
  Flight,
  Operated_By,
  Cabin,
  From_City,
  From_Country,
  F_Arpt,
  To_City,
  To_Country,
  T_Arpt,
  Status,
  Aircraft,
}) {
  return (
    <>
      <div className="border-t-1 border-black w-4/5">
        <div>
          <h3
            className="text-xl"
            style={{ fontFamily: "Gotham", fontWeight: 500 }}
          >
            Flight: {D_City} to {A_City} ({Aircraft_No}){" "}
          </h3>
        </div>
        <div className="grid grid-cols-3 grid-rows-6 pt-5">
          {/* <div className="row1"> */}
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Date:
            </div>
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {Date} ({Day})
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Departs:
            </div>
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {Departs}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Duration:
            </div>
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {Duration}
            </div>
          </div>
          {/* </div> */}
          {/* <div className="row2"> */}
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Airline:
            </div>
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {Airline}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Arrives:
            </div>
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {Arrives}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Stops:
            </div>
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {Stops}
            </div>
          </div>
          {/* </div> */}
          {/* <div className="row3"> */}
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Flight:
            </div>
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {Flight}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Operated By:
            </div>
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {Operated_By}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Cabin:
            </div>
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {Cabin}
            </div>
          </div>
          {/* </div> */}
          {/* <div className="row4"> */}
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              From:
            </div>
            <div
              className="text-sm w-[150px]"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {From_City} ({From_Country})
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Airport:
            </div>
            <div
              className="text-sm w-[175px]"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {F_Arpt}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm"></div>
            <div className="text-sm"></div>
          </div>
          {/* </div> */}
          {/* <div className="row5"> */}
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              To:
            </div>
            <div
              className="text-sm w-[150px]"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {To_City} ({To_Country})
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Airport:
            </div>
            <div
              className="text-sm w-[175px]"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {T_Arpt}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm"></div>
            <div className="text-sm"></div>
          </div>
          {/* </div> */}
          {/* <div className="row6"> */}
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Status:
            </div>
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {Status}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div
              className="text-sm"
              style={{ fontFamily: "Gotham", fontWeight: 300 }}
            >
              Aircraft
            </div>
            <div
              className="text-sm w-[180px]"
              style={{ fontFamily: "Gotham", fontWeight: 400 }}
            >
              {Aircraft}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm"></div>
            <div className="text-sm"></div>
          </div>
          {/* </div> */}
        </div>

        {/* <div className="grid grid-cols-3">
          <div className="grid grid-cols-2">
            <div className="text-sm">Airline:</div>
            <div className="text-sm">{Airline}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm">Arrives:</div>
            <div className="text-sm">{Arrives}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm">Stops:</div>
            <div className="text-sm">{Stops}</div>
          </div>
        </div> */}

        {/* <div className="grid grid-cols-3">
          <div className="grid grid-cols-2">
            <div className="text-sm">Flight:</div>
            <div className="text-sm">{Flight}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm">Operated By:</div>
            <div className="text-sm">{Operated_By}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm">Cabin:</div>
            <div className="text-sm">{Cabin}</div>
          </div>
        </div> */}

        {/* <div className="grid grid-cols-3">
          <div className="grid grid-cols-2">
            <div className="text-sm">From:</div>
            <div className="text-sm w-[150px]">
              {From_City} ({From_Country})
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm">Airport:</div>
            <div className="text-sm w-[175px]">{F_Arpt}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm"></div>
            <div className="text-sm"></div>
          </div>
        </div> */}

        {/* <div className="grid grid-cols-3">
          <div className="grid grid-cols-2">
            <div className="text-sm">To:</div>
            <div className="text-sm w-[150px]">
              {To_City} ({To_Country})
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm">Airport:</div>
            <div className="text-sm w-[175px]">{T_Arpt}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm"></div>
            <div className="text-sm"></div>
          </div>
        </div> */}

        {/* <div className="grid grid-cols-3">
          <div className="grid grid-cols-2">
            <div className="text-sm">Status:</div>
            <div className="text-sm">{Status}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm">Aircraft</div>
            <div className="text-sm w-[180px]">{Aircraft}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm"></div>
            <div className="text-sm"></div>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default FlightDetailsForTicket;
