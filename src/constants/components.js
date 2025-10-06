import MiniButton from "@/app/component/(FirstPageComponents)/(BookingSection)/MiniButtons/Button.jsx";
import InputBoxText from "@/app/component/(FirstPageComponents)/(BookingSection)/InputBox/InputBoxText.jsx";
import Travel from "@/app/component/(FirstPageComponents)/(BookingSection)/TravelOptions/Travel.jsx";
import TravelersCompo from "@/app/component/(FirstPageComponents)/(BookingSection)/TravelersCompo/TravelersCompo.jsx";
import ClassCompo from "@/app/component/(FirstPageComponents)/(BookingSection)/ClassCompo/ClassCompo.jsx";
import FlightButton from "@/app/component/(FirstPageComponents)/(BookingSection)/FlightButton/Button.jsx";
const components = {
  MiniButton,
  InputBoxText,
  Travel,
  TravelersCompo,
  ClassCompo,
  Button: FlightButton,
};

Object.freeze(components);
export { components };
