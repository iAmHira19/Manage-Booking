import { icons } from "@/constants/icons";
import { v4 as uuiv4 } from "uuid";
import { components } from "@/constants/components";
const FlightNMultiCity = ({ addMultiCity, setAddMultiCity, options }) => {
  const { FaLocationDot, RxCross1, RxCrossCircled, SlCalender, DatePicker } =
    icons;
  const { InputBoxText } = components;
  return (
    <>
      <div
        className={`multicitycontainer flex flex-col gap-y-7 md:gap-5 font-gotham`}
      >
        {addMultiCity.map((cityData, index) => {
          return (
            <div
              key={cityData.id}
              className={`dropdown relative grid w-full grid-cols-1 md:grid-cols-[1fr_1fr_1fr_10px] gap-y-2 md:gap-5 font-gotham `}
            >
              <h3 className="text-xs md:hidden text-blue-900">
                Flight {index + 1}
              </h3>
              <InputBoxText
                border="border-2 border-gray-200"
                options={options}
                ReadOnly={false}
                name="search_LocFrom"
                value={
                  cityData.search_LocFrom == "" ? null : cityData.search_LocFrom
                }
                Placeholder="Departing Airport"
                InputIcon={<FaLocationDot />}
                CrossIcon={<RxCross1 />}
                disableDates={true}
                onChange={(name, value, cityName) => {
                  const updateCities = addMultiCity.map((city) =>
                    city.id === cityData.id
                      ? {
                          ...city,
                          show_LocFrom: cityName,
                          search_LocFrom: value?.split("~")[0],
                        }
                      : city
                  );
                  setAddMultiCity(updateCities);
                }}
              />
              <InputBoxText
                border="border-2 border-gray-200"
                options={options}
                ReadOnly={false}
                value={
                  cityData.search_LocTo == "" ? null : cityData.search_LocTo
                }
                name="search_LocTo"
                Placeholder="Arrival Airport"
                InputIcon={<FaLocationDot />}
                CrossIcon={<RxCross1 />}
                disableDates={true}
                onChange={(name, value, cityName) => {
                  const updatedCities = addMultiCity.map((item, idx) => {
                    if (item.id === cityData.id) {
                      const updatedItem = {
                        ...item,
                        show_LocTo: cityName,
                        search_LocTo: value?.split("~")[0],
                        search_Mode: value?.split("~")[1],
                      };
                      // Check if next item exists
                      if (idx + 1 < addMultiCity.length) {
                        const nextItem = addMultiCity[idx + 1];
                        // Return both updated current and updated next
                        return [
                          updatedItem,
                          {
                            ...nextItem,
                            show_LocFrom: cityName,
                            search_LocFrom: value?.split("~")[0],
                          },
                        ];
                      }

                      return updatedItem;
                    }

                    // Handle the next item already updated
                    if (idx > 0 && addMultiCity[idx - 1].id === cityData.id) {
                      return null;
                    }

                    return item;
                  });
                  setAddMultiCity(updatedCities.flat().filter(Boolean));
                }}
              />
              <InputBoxText
                border="border-2 border-gray-200"
                options={options}
                ReadOnly={false}
                name="search_DepartingDate"
                disableDates={true}
                minDate={
                  index > 0
                    ? new Date(addMultiCity[index - 1]?.show_DepartingDate)
                    : null
                }
                Placeholder="Departing Date"
                InputIcon={<SlCalender />}
                CrossIcon={<RxCross1 />}
                RangePicker={DatePicker}
                onChange={(dateString) => {
                  const updatedCities = addMultiCity.map((item) => {
                    return item.id === cityData.id
                      ? {
                          ...item,
                          show_DepartingDate: `${dateString}`,
                          search_DepartingDate: `${dateString.$d.getDate()}-${
                            dateString.$d.getMonth() + 1
                          }-${dateString.$d.getFullYear()}`,
                        }
                      : item;
                  });
                  setAddMultiCity(updatedCities);
                }}
              />
              {index >= 2 && (
                <button
                  className="text-xl text-orange-500 absolute top-0 right-0 md:static"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddMultiCity(
                      addMultiCity.filter((item) => item.id !== cityData.id)
                    );
                  }}
                >
                  <RxCrossCircled className="text-base md:text-xl" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <button
        className={`text-blue-900 w-14 rounded text-sm md:text-base cursor-pointer mt-5 ${
          addMultiCity.length > 5 ? "hidden" : "block"
        }`}
        style={{ fontFamily: "Gotham", fontWeight: "400" }}
        onClick={() => {
          setAddMultiCity([
            ...addMultiCity,
            {
              id: uuiv4(),
              search_LocFrom: "",
              search_LocTo: "",
              search_DepartingDate: "",
            },
          ]);
        }}
      >
        Add +
      </button>
    </>
  );
};

export default FlightNMultiCity;
