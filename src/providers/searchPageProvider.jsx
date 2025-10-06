"use client";
import React, { createContext, useContext, useState } from "react";
const searchPageContext = createContext();
const SearchPageProvider = ({ children }) => {
  const [searchPageData, setSearchPageData] = useState("");
  return (
    <searchPageContext.Provider value={{ searchPageData, setSearchPageData }}>
      {children}
    </searchPageContext.Provider>
  );
};
const useSearchPageContext = () => useContext(searchPageContext);
export { SearchPageProvider, useSearchPageContext };
