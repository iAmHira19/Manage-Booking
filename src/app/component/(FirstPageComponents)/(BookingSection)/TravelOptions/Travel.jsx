import React from "react";
const Travel = ({ Text, Icon, DropIcon, onClick }) => {
  return (
    <button
      className={`text-blue-900 text-xs md:text-sm flex items-center font-light md:font-bold font-gotham`}
      onClick={onClick}
    >
      <span className=" md:gap-1 md:text-[16px] text-[10px] sm:text-[11px] flex items-center font-gotham font-normal">
        {Text} {Icon ? Icon : null}
      </span>{" "}
      <span className=" text-xl md:text-2xl font-gotham font-normal">
        {DropIcon ? DropIcon : null}
      </span>
    </button>
  );
};

export default Travel;
