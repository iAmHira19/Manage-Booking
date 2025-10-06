import Data from "./Data";
import { BiSolidPlaneTakeOff } from "react-icons/bi";
import { FaBus } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { IoIosSpeedometer } from "react-icons/io";

const Achievements = () => {
  return (
    <div
      className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 p-8 md:p-16 mb-10"
      style={{ fontFamily: "Gotham" }}
    >
      <Data
        Icon={<BiSolidPlaneTakeOff />}
        Title="700k+"
        Content="Flights Booked"
      />
      <Data Icon={<FaBus />} Title="300k+" Content="Cars Booked" />
      <Data Icon={<FaBed />} Title="50k+" Content="Hotels Booked" />
      <Data
        Icon={<IoIosSpeedometer />}
        Title="20m+"
        Content="Kilometers Traveled"
      />
    </div>
  );
};

export default Achievements;
