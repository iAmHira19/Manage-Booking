import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";

const CustomTooltip = ({ title, dataItem }) => {
  const [layoverData, setLayoverData] = useState([]);

  // Mock API call
  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      const data = [
        { duration: "4h 50m", location: "Dubai (DXB)" },
        { duration: "2h 30m", location: "Milano (MXP)" },
      ];
      setLayoverData(data);
    };

    fetchData();
  }, []);

  // Create the tooltip content dynamically
  const tooltipContent = (
    <div>
      {dataItem.length > 1 &&
        dataItem.map((item, index) => (
          <div key={index}>
            {item.duration} layover - {item.duration}
          </div>
        ))}
    </div>
  );

  return (
    <div style={{ textAlign: "center" }}>
      <Tooltip title={tooltipContent}>
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>
          {title}
        </span>
      </Tooltip>
    </div>
  );
};

export default CustomTooltip;
