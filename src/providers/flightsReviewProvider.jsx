"use client";
import React, { createContext, useContext, useState } from "react";
const flightsReviewContext = createContext();
export const FlightsReviewProvider = ({ children }) => {
  const [flightsReviewData, setFlightsReviewData] = useState("");
  return (
    <flightsReviewContext.Provider
      value={{ flightsReviewData, setFlightsReviewData }}
    >
      {children}
    </flightsReviewContext.Provider>
  );
};
export const useFlightsReviewContext = () => useContext(flightsReviewContext);
