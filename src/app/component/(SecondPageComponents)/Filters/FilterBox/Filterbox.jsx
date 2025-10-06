import Checkbox from "../CheckBox/Checkbox";
import React, { useState, useRef, useEffect } from "react";
import FlightButton from "@/app/component/(FirstPageComponents)/(BookingSection)/FlightButton/Button";
import Skeleton from "react-loading-skeleton";
import { Slider } from "antd";
import "react-loading-skeleton/dist/skeleton.css";

const Filterbox = ({
  departingLocation,
  loading,
  setUserFilters,
  APIData,
  setEnableFilter,
  enableFilter,
  Text,
  Border,
  legsCount,
  clearExpandedFlightData,
}) => {
  let dataJson;
  if (APIData) {
    if (APIData.length > 0) dataJson = JSON.parse(APIData);
  }

  // State for time ranges
  const [depStart, setDepStart] = useState("00:00");
  const [depEnd, setDepEnd] = useState("23:00");
  const [arrStart, setArrStart] = useState("00:00");
  const [arrEnd, setArrEnd] = useState("23:00");

  // References to sliders to programmatically reset them
  const arrivalSliderRef = useRef(null);
  const departureSliderRef = useRef(null);

  // State to track which checkboxes are checked
  const [checkedBoxes, setCheckedBoxes] = useState({
    stops: {},
    airlines: {},
    airports: {},
  });

  // Function to reset all filters
  const resetAllFilters = () => {
    // Clear userFilters in parent component
    setUserFilters([]);

    // Reset time displays
    setDepStart("00:00");
    setDepEnd("23:00");
    setArrStart("00:00");
    setArrEnd("23:00");

    // Reset checkboxes state
    setCheckedBoxes({
      stops: {},
      airlines: {},
      airports: {},
    });

    // Clear any previously expanded (but not selected) flight data
    if (clearExpandedFlightData) {
      clearExpandedFlightData();
    }

    // Reset slider values - Note: This is implemented using the key prop in the render
  };
  useEffect(() => {
    // Reset both the filters array and the UI state
    resetAllFilters();

    // Force a re-render of sliders by updating the key
    setCheckedBoxes((prev) => ({
      stops: { reset: Date.now() },
      airlines: {},
      airports: {},
    }));
  }, [legsCount]);
  return (
    <div
      className={`${
        Border && "border sm:border-2 border-slate-300"
      } rounded font-gotham font-light`}
    >
      <div className="stops px-3 border-b-2 border-slate-100 py-4 font-gotham">
        <h2
          className={`font-bold mb-3 font-gotham ${Text && `text-${Text}`}`}
          onClick={() => console.log("dataJson: ", dataJson)}
        >
          Stops
        </h2>
        <div className={`checkboxes px-6 font-gotham`}>
          {APIData && !loading ? (
            dataJson &&
            dataJson.filterList?.map(
              (filter, index) =>
                filter.filterGroup == "Stop" && (
                  <div key={index}>
                    <Checkbox
                      filterDescription={`${filter.filterCode}`}
                      filterCount={`${filter.filterCount}`}
                      checked={checkedBoxes.stops[filter.filterCode] || false}
                      onChecked={(e, filterDescription) => {
                        e.stopPropagation();
                        setEnableFilter(!enableFilter);

                        // Update checkbox state
                        setCheckedBoxes((prev) => ({
                          ...prev,
                          stops: {
                            ...prev.stops,
                            [filterDescription]: e.target.checked,
                          },
                        }));

                        // Update filters
                        e.target.checked
                          ? setUserFilters((prevValue) => [
                              ...prevValue,
                              filterDescription == "1Stop"
                                ? 1
                                : filterDescription == "Nonstop"
                                ? 0
                                : filterDescription == "MultiStop" && 2,
                            ])
                          : setUserFilters((prevValue) => {
                              let deSelectedValue =
                                filterDescription == "1Stop"
                                  ? 1
                                  : filterDescription == "Nonstop"
                                  ? 0
                                  : filterDescription == "MultiStop" && 2;
                              return prevValue.filter(
                                (value) => value != deSelectedValue
                              );
                            });
                      }}
                    />
                  </div>
                )
            )
          ) : (
            <Skeleton count={3} />
          )}
        </div>
      </div>
      <div className="airlines px-3 border-b-2 border-slate-100 py-4 font-gotham">
        <h2 className="font-bold mb-3 font-gotham">Airlines</h2>
        <div className="checkboxes flex flex-col gap-y-4 px-6 font-gotham">
          {APIData && !loading ? (
            dataJson &&
            dataJson.filterList?.map(
              (dataItem, index) =>
                dataItem.filterGroup == "Airlines Included" && (
                  <Checkbox
                    key={index}
                    filterDescription={`${dataItem.filterCode}`}
                    filterCount={`${dataItem.filterCount}`}
                    Icon={dataItem.filterCode}
                    checked={
                      checkedBoxes.airlines[dataItem.filterCode] || false
                    }
                    onChecked={(e, filterDescription) => {
                      e.stopPropagation();

                      // Update checkbox state
                      setCheckedBoxes((prev) => ({
                        ...prev,
                        airlines: {
                          ...prev.airlines,
                          [filterDescription]: e.target.checked,
                        },
                      }));

                      if (e.target.checked) {
                        setUserFilters((prevValue) => [
                          ...prevValue,
                          filterDescription,
                        ]);
                      } else {
                        setUserFilters((prevValue) =>
                          prevValue.filter(
                            (value) => value != filterDescription
                          )
                        );
                      }
                    }}
                  />
                )
            )
          ) : (
            <Skeleton count={8} />
          )}
        </div>
      </div>
      {/* Arrival Time */}
      <div className="arrivalTime px-3 border-b-2 border-slate-100 py-4 font-gotham">
        <h2 className="font-bold mb-3 font-gotham">Arrival Time</h2>
        {APIData && !loading ? (
          <>
            <p style={{ fontFamily: "Gotham", fontWeight: 300 }}>
              <span className="flex items-center justify-between font-gotham">
                <span className="font-gotham">(Early Morning)</span>{" "}
                <span className="font-gotham">(Evening)</span>
              </span>
              <span className="flex items-center justify-between">
                <span>({arrStart})</span> <span>({arrEnd})</span>
              </span>
            </p>
            <Slider
              key={`arr-slider-${checkedBoxes.stops.reset || ""}`} // Key changes when reset
              ref={arrivalSliderRef}
              range={true}
              defaultValue={[0, 23]}
              min={0}
              max={23}
              onChange={(value) => {
                const pad = (num) => (num < 10 ? `0${num}` : `${num}`);

                const start = pad(value[0]);
                const end = pad(value[1]);

                setArrStart(`${start}:00`);
                setArrEnd(`${end}:00`);

                const arrTime = `${start}:${end}A`;

                setUserFilters((prev) => {
                  const index = prev.findIndex((item) => {
                    return typeof item == "string" && item.endsWith("A");
                  });
                  if (index !== -1) {
                    const newFilters = [...prev];
                    newFilters[index] = arrTime;
                    return newFilters;
                  } else {
                    return [...prev, arrTime];
                  }
                });
              }}
            ></Slider>
          </>
        ) : (
          <Skeleton />
        )}
      </div>
      <div className="departingTime px-3 border-b-2 border-slate-100 py-4">
        <h2 className="font-bold mb-3 font-gotham">Departing Time</h2>
        {APIData && !loading ? (
          <>
            <p className="font-gotham font-light">
              <span className="flex items-center justify-between font-gotham">
                <span className="font-gotham">(Early Morning)</span>{" "}
                <span>(Evening)</span>
              </span>
              <span className="flex items-center justify-between font-gotham">
                <span className="font-gotham">({depStart})</span>{" "}
                <span>({depEnd})</span>
              </span>
            </p>
            <Slider
              key={`dep-slider-${checkedBoxes.stops.reset || ""}`} // Key changes when reset
              ref={departureSliderRef}
              range={true}
              defaultValue={[0, 23]}
              className="font-gotham"
              min={0}
              max={23}
              onChange={(value) => {
                const pad = (num) => (num < 10 ? `0${num}` : `${num}`);

                const start = pad(value[0]);
                const end = pad(value[1]);

                setDepStart(`${start}:00`);
                setDepEnd(`${end}:00`);

                const depTime = `${start}:${end}D`;

                setUserFilters((prev) => {
                  const index = prev.findIndex((item) => {
                    return typeof item == "string" && item.endsWith("D");
                  });
                  if (index !== -1) {
                    const newFilters = [...prev];
                    newFilters[index] = depTime;
                    return newFilters;
                  } else {
                    return [...prev, depTime];
                  }
                });
              }}
            ></Slider>
          </>
        ) : (
          <Skeleton />
        )}
      </div>
      <div className="airportSuggestions px-3 border-b-2 border-slate-100 py-4 font-gotham">
        <p className="font-gotham font-[400]">
          Departure airports in {departingLocation}
        </p>
        <div className="airports px-6 flex flex-col gap-y-2 pt-3 font-gotham">
          {APIData && !loading ? (
            dataJson &&
            dataJson.filterList?.map(
              (dataItem, index) =>
                dataItem.filterGroup == "Departure aiports" && (
                  <Checkbox
                    key={index}
                    filterDescription={dataItem.filterDescription}
                    filterCode={dataItem.filterCode}
                    filterCount={dataItem.filterCount}
                    checked={
                      checkedBoxes.airports[dataItem.filterCode] || false
                    }
                    onChecked={(e, filterDescription, filterCode) => {
                      e.stopPropagation();

                      // Update checkbox state
                      setCheckedBoxes((prev) => ({
                        ...prev,
                        airports: {
                          ...prev.airports,
                          [filterCode]: e.target.checked,
                        },
                      }));

                      e.target.checked
                        ? setUserFilters((prevValue) => [
                            ...prevValue,
                            filterCode,
                          ])
                        : setUserFilters((prevValue) =>
                            prevValue.filter((value) => value != filterCode)
                          );
                    }}
                  />
                )
            )
          ) : (
            <Skeleton count={3} />
          )}
        </div>
      </div>
      <div className="resetBtn py-4 px-3 max-w-full font-gotham">
        <FlightButton
          Text={"Reset"}
          width="w-full"
          PYXL="xl:py-2"
          PYSM="sm:py-1"
          onClick={() => {
            // Reset both the filters array and the UI state
            resetAllFilters();

            // Force a re-render of sliders by updating the key
            setCheckedBoxes((prev) => ({
              stops: { reset: Date.now() },
              airlines: {},
              airports: {},
            }));
          }}
        ></FlightButton>
      </div>
    </div>
  );
};

export default Filterbox;
