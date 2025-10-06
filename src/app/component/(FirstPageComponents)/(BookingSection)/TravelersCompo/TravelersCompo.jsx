import React from "react";
import TravelOp from "../TravelOp/TravelOp";
const TravelersCompo = ({
  adults,
  setAdults,
  Children,
  setChildren,
  infants,
  setInfants,
}) => {
  return (
    <div className="TravelOpCard z-50 flex flex-col border bg-white w-40 sm:w-56 md:w-64 py-3 sm:py-5 px-2 sm:px-5 rounded items-center justify-between font-gotham font-[500] shadow-md">
      <h2 className="text-blue-900 w-full mb-3 md:mb-5 text-xs sm:text-sm md:text-lg font-gotham text-center">
        Travelers
      </h2>
      <div className="TravelCards w-full flex flex-col gap-3 items-center justify-between font-gotham">
        <TravelOp
          Case="adult"
          Age={adults > 1 ? "Adults" : "Adult"}
          Condition="Ages 12+"
          state={adults}
          setState={setAdults}
          adults={adults}
          Children={Children}
          infants={infants}
          // setState={(type, operation) => handleUpdate(type, operation)}
        ></TravelOp>
        <TravelOp
          Case="child"
          Age={Children > 1 ? "Children" : "Child"}
          Condition="Ages 2-11"
          state={Children}
          setState={setChildren}
          adults={adults}
          Children={Children}
          infants={infants}
          // setState={(type, operation) => handleUpdate(type, operation)}
        ></TravelOp>
        <TravelOp
          Case="infant"
          Age={infants > 1 ? "Infants" : "Infant"}
          Condition="Ages under 2"
          state={infants}
          setState={setInfants}
          adults={adults}
          Children={Children}
          infants={infants}
          // setState={(type, operation) => handleUpdate(type, operation)}
        ></TravelOp>
      </div>
    </div>
  );
};

export default TravelersCompo;
