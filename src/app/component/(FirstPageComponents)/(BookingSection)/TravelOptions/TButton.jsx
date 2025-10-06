import React from "react";

const TButton = ({ Text, onClick, disabled }) => {
  return (
    <button
      className="md:rounded-sm w-5 h-5 sm:w-7 md:w-10 sm:h-5 text-xs md:h-10 border md:border border-gray-300 font-gotham md:text-base"
      onClick={onClick}
      disabled={disabled}
    >
      {Text}
    </button>
  );
};

export default TButton;
