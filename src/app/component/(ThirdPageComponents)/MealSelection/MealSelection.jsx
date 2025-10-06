"use client";
import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";

const MealSelection = ({ Title, onSelect, isSelected, ToolTip }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Tooltip title={ToolTip} placement="top" arrow>
      <div
        className={`bg-gray-100 relative rounded flex justify-between items-center text-sm border mx-auto cursor-pointer w-full`}
        onClick={() => onSelect(Title)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="w-full h-full flex gap-y-12 gap-x-12 items-center p-2">
          <img src="img/11.png" className="w-16 h-16 rounded-full" />
          <div className="right w-full">
            <h5 className="text-lg font-gotham mb-2 whitespace-nowrap">
              {Title}
            </h5>
            <button
              type="button"
              className="p-2 rounded-md Select bg-orange-500 text-white font-gotham cursor-pointer w-full"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default MealSelection;
