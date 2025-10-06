import { components } from "@/constants/components";
import { icons } from "@/constants/icons";
const FlightNOneWay = ({ addOnewayData, setAddOnewayData, options }) => {
  const { InputBoxText } = components;
  const { FaLocationDot, RxCross1, SlCalender, DatePicker } = icons;
  return (
    <div className="grid grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-x-5 md:gap-y-0 md:p-0 md:py-2 md:px-2 font-gotham">
      <InputBoxText
        options={options}
        border="border md:border-2 border-gray-200"
        ReadOnly={false}
        disableDates={true}
        name="search_LocFrom"
        value={
          addOnewayData.search_LocFrom == ""
            ? null
            : addOnewayData.search_LocFrom
        }
        Placeholder="Departing Airport"
        InputIcon={<FaLocationDot />}
        CrossIcon={<RxCross1 />}
        onChange={(name, value, cityName) => {
          setAddOnewayData({
            ...addOnewayData,
            show_LocFrom: cityName,
            search_LocFrom: value?.split("~")[0],
          });
        }}
      />
      {/* {addOnewayData.search_LocFrom === addOnewayData.search_LocTo ? (
          <p className="text-xs text-red-500 absolute">
            Departing and Arriving location cannot be same
          </p>
        ) : null} */}
      <InputBoxText
        border="border md:border-2 border-gray-200"
        options={options}
        ReadOnly={false}
        disableDates={true}
        name="search_LocTo"
        value={
          addOnewayData.search_LocTo == "" ? null : addOnewayData.search_LocTo
        }
        Placeholder="Arriving Airport"
        InputIcon={<FaLocationDot />}
        CrossIcon={<RxCross1 />}
        onChange={(name, value, cityName) => {
          setAddOnewayData({
            ...addOnewayData,
            show_LocTo: cityName,
            search_LocTo: value?.split("~")[0],
            search_Mode: value?.split("~")[1],
          });
        }}
      />
      {/* {addOnewayData.search_LocFrom === addOnewayData.search_LocTo ? (
          <p className="text-xs text-red-500">
            Departing and Arriving location cannot be same
          </p>
        ) : null} */}
      <InputBoxText
        border="border md:border-2 border-gray-200"
        name="search_DepartingDate"
        disableDates={true}
        TabIndex={3}
        ReadOnly={true}
        Placeholder="Departing Date"
        InputIcon={<SlCalender />}
        CrossIcon={<RxCross1 />}
        RangePicker={DatePicker}
        onChange={(dateString) => {
          setAddOnewayData({
            ...addOnewayData,
            show_DepartingDate: dateString,
            search_DepartingDate: `${dateString.$d.getDate()}-${
              dateString.$d.getMonth() + 1
            }-${dateString.$d.getFullYear()}`,
          });
        }}
      />
    </div>
  );
};

export default FlightNOneWay;
