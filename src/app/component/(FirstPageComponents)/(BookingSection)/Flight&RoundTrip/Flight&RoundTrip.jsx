import { components } from "@/constants/components";
import { icons } from "@/constants/icons";

const FlightNRoundTrip = ({ addReturnData, setAddReturnData, options }) => {
  const { InputBoxText } = components;
  const { FaLocationDot, RxCross1, SlCalender, DatePicker } = icons;
  const { RangePicker } = DatePicker;
  return (
    <div className="grid grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-x-5 md:gap-y-0 md:p-0 md:py-2 md:px-2 font-gotham">
      <InputBoxText
        border="border-2 md:border-2 border-gray-200"
        name="search_LocFrom"
        disableDates={true}
        // value={
        //   addReturnData.search_LocFrom == ""
        //     ? null
        //     : addReturnData.search_LocFrom
        // }
        Placeholder="Departing Airport"
        InputIcon={<FaLocationDot />}
        CrossIcon={<RxCross1 />}
        options={options}
        onChange={(name, value, cityName) => {
          setAddReturnData({
            ...addReturnData,
            show_LocFrom: cityName,
            search_LocFrom: value?.split("~")[0],
          });
        }}
        ReadOnly={false}
      />
      <InputBoxText
        border="border-2 md:border-2 border-gray-200"
        name="search_LocTo"
        disableDates={true}
        // value={
        //   addReturnData.search_LocTo == "" ? null : addReturnData.search_LocTo
        // }
        Placeholder="Arriving Airport"
        InputIcon={<FaLocationDot />}
        CrossIcon={<RxCross1 />}
        options={options}
        onChange={(name, value, cityName) => {
          setAddReturnData({
            ...addReturnData,
            show_LocTo: cityName,
            search_LocTo: value?.split("~")[0],
            search_Mode: value?.split("~")[1],
          });
        }}
        ReadOnly={false}
      />
      <div className="DepartDate w-full font-gotham">
        <InputBoxText
          TabIndex={3}
          border="border-2 md:border-2 border-gray-200"
          Placeholder={["Departing Date", "Arriving Date"]}
          disableDates={true}
          InputIcon={<SlCalender />}
          CrossIcon={<RxCross1 />}
          ReadOnly={true}
          RenderDate={true}
          RangePicker={RangePicker}
          onChange={(dateString) => {
            setAddReturnData({
              ...addReturnData,
              show_DepartingDate: dateString[0],
              show_ArrivingDate: dateString[1],
              show_Date: dateString,
              search_DepartingDate: `${dateString[0].$d.getDate()}-${
                dateString[0].$d.getMonth() + 1
              }-${dateString[0].$d.getFullYear()}`,
              search_ArrivingDate: `${dateString[1].$d.getDate()}-${
                dateString[1].$d.getMonth() + 1
              }-${dateString[1].$d.getFullYear()}`,
            });
          }}
        />{" "}
      </div>
    </div>
  );
};

export default FlightNRoundTrip;
