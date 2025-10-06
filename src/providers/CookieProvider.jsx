"use client";
import React, { createContext, useContext } from "react";
import { useGlobalCookies } from "@/utils/cookieManager";

const CookieContext = createContext();

export const CookieProvider = ({ children }) => {
  const cookies = useGlobalCookies();

  return (
    <CookieContext.Provider value={cookies}>{children}</CookieContext.Provider>
  );
};

export const useCookiesContext = () => useContext(CookieContext);
