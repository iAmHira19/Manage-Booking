"use client";
import React, { useState, createContext, useContext, useEffect } from "react";
import { useCurrencyApi } from "@/utils/getCurrencyForCurrencyApi";
import { cleanupUsername } from "@/utils/cleanupUsername";

const signInContext = createContext();

export const SignInContextProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [username, setUsername] = useState("");

  // Wrapper function for setUsername - ensure a clean display name across the app
  const setUsernameClean = (username) => {
    const cleanedUsername = cleanupUsername(username ? String(username).trim() : "");
    setUsername(cleanedUsername);
    // Persist cleaned username so future sessions don't reintroduce duplicates
    if (typeof window !== "undefined") {
      try {
        if (cleanedUsername) sessionStorage.setItem("username", cleanedUsername);
        else sessionStorage.removeItem("username");
      } catch (e) {
        // ignore storage errors
      }
    }
    return cleanedUsername;
  };
  const [userId, setUserId] = useState("Public");
  const [userGroup, setUserGroup] = useState(null);
  const [searchCurrencyCode, setSearchCurrencyCode] = useState(null);
  const [searchCurrencySymbol, setSearchCurrencySymbol] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);
  const { getCurrencyApi } = useCurrencyApi();

  // Initialize client-side data after hydration
  useEffect(() => {
    setIsHydrated(true);

    // Only access storage on client-side. Prefer sessionStorage, fallback to localStorage.
    if (typeof window !== "undefined") {
      const storedSignIn = sessionStorage.getItem("signIn");
      const storedCurrencySession = sessionStorage.getItem("currency");
      const storedCurrencyLocal = localStorage.getItem("currency");
      const storedCurrencySymbolSession = sessionStorage.getItem("currencySymbol");
      const storedCurrencySymbolLocal = localStorage.getItem("currencySymbol");

      if (storedSignIn) {
        setIsSignedIn(storedSignIn === "true");
      }

      // Get the username from sessionStorage and ensure it's cleaned
      const storedUsername = sessionStorage.getItem("username");
      if (storedUsername) {
        const cleaned = cleanupUsername(storedUsername);
        setUsername(cleaned);
        // Write back cleaned value to prevent stale duplicates
        try {
          sessionStorage.setItem("username", cleaned);
        } catch (e) {
          // ignore storage errors
        }
      }

      // Use sessionStorage currency first (this is what other parts of the app read),
      // then fallback to localStorage for cross-tab persistence, otherwise default to PKR.
      const initialCurrency =
        storedCurrencySession || storedCurrencyLocal || "PKR";
      const initialCurrencySymbol =
        storedCurrencySymbolSession || storedCurrencySymbolLocal || "PKR";
      // Ensure both storages are in sync
      try {
        sessionStorage.setItem("currency", initialCurrency);
        localStorage.setItem("currency", initialCurrency);
        sessionStorage.setItem("currencySymbol", initialCurrencySymbol);
        localStorage.setItem("currencySymbol", initialCurrencySymbol);
      } catch (e) {
        // ignore storage errors
      }
      setSearchCurrencyCode(initialCurrency);
      setSearchCurrencySymbol(initialCurrencySymbol);
    }
  }, []);

  // Fetch exchange rate whenever the selected currency changes.
  useEffect(() => {
    let mounted = true;
    async function fetchRate() {
      if (!searchCurrencyCode) return;
      try {
        const resp = await getCurrencyApi(searchCurrencyCode);
        let parsed = null;
        if (!resp) parsed = null;
        else if (typeof resp === "string") {
          try {
            parsed = JSON.parse(resp);
          } catch (e) {
            parsed = null;
            console.debug("SignInStateProvider: failed to parse exchange payload", e, resp);
          }
        } else parsed = resp;

        const rates = parsed?.objExchangeRate || parsed?.objExchRate || parsed?.objExchange || [];
        const latest = Array.isArray(rates) && rates.length > 0 ? rates[0] : null;
        const rate = latest && (latest.tpEXR_RATE || latest.rate || latest.tpEXR_RATE_TX) ? Number(latest.tpEXR_RATE || latest.rate || latest.tpEXR_RATE_TX) : 1;
        // Debug: log shape and chosen rate so we can validate whether rate is base-per-target or target-per-base
        try {
          console.debug("SignInStateProvider: fetched exchange payload:", { criteria: searchCurrencyCode, parsed, rates, latest, rate });
        } catch (e) {
          // ignore
        }
        if (mounted) setExchangeRate(!isNaN(rate) && rate > 0 ? rate : 1);
      } catch (err) {
        console.error("SignInStateProvider: failed to fetch exchange rate", err);
        if (mounted) setExchangeRate(1);
      }
    }
    fetchRate();
    return () => {
      mounted = false;
    };
  }, [searchCurrencyCode, getCurrencyApi]);

  const signInFn = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("signIn", "true");
      setIsSignedIn(true);
    }
  };

  const signOutFn = () => {
    if (typeof window !== "undefined") {
      // Clear the username from sessionStorage
      sessionStorage.removeItem("username");

      sessionStorage.setItem("signIn", "false");
      setIsSignedIn(false);
    }
  };

  // Utility function to completely clean storage and start fresh
  const clearAllStorage = () => {
    if (typeof window !== "undefined") {
      // Clear all storage
      sessionStorage.clear();
      localStorage.clear();

      // Reset all state
      setIsSignedIn(false);
      setUsername("");
      setUserId("Public");
      setUserGroup(null);
      setSearchCurrencyCode("PKR");
      setSearchCurrencySymbol("PKR");
    }
  };

  const handleCurrencyChangeFn = (curr_Code, curr_Symbol) => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("currency", curr_Code);
        localStorage.setItem("currency", curr_Code);
        if (typeof curr_Symbol !== 'undefined') {
          sessionStorage.setItem('currencySymbol', curr_Symbol);
          localStorage.setItem('currencySymbol', curr_Symbol);
        }
      } catch (e) {
        // ignore storage errors
      }
      console.debug('SignInStateProvider: handleCurrencyChangeFn called', { curr_Code, curr_Symbol });
      setSearchCurrencyCode(curr_Code);
      if (typeof curr_Symbol !== 'undefined') {
        setSearchCurrencySymbol(curr_Symbol);
        console.debug('SignInStateProvider: updated searchCurrencySymbol ->', curr_Symbol);
      }
    }
  };

  // Provide consistent values during SSR and initial client render
  const contextValue = {
    signInFn,
    signOutFn,
    clearAllStorage, // Utility to completely reset storage
    isSignedIn: isHydrated ? isSignedIn : null,
    setIsSignedIn,
    username,
    setUsername: setUsernameClean, // Use the cleaning wrapper function
    userId,
    setUserId,
    userGroup,
    setUserGroup,
  searchCurrencyCode,
    setSearchCurrencyCode,
    searchCurrencySymbol,
    setSearchCurrencySymbol,
    handleCurrencyChangeFn,
    exchangeRate,
    isModalVisible,
    setIsModalVisible,
    modalType,
    setModalType,
    isHydrated, // Expose hydration state if needed
  };

  return (
    <signInContext.Provider value={contextValue}>
      {children}
    </signInContext.Provider>
  );
};

export const useSignInContext = () => useContext(signInContext);
