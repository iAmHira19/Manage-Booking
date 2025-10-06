"use client";
import React, { useState, createContext, useContext, useEffect } from "react";

const signInContext = createContext();

export const SignInContextProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("Public");
  const [userGroup, setUserGroup] = useState(null);
  const [searchCurrencyCode, setSearchCurrencyCode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize client-side data after hydration
  useEffect(() => {
    setIsHydrated(true);

    // Only access storage on client-side. Prefer sessionStorage, fallback to localStorage.
    if (typeof window !== "undefined") {
      const storedSignIn = sessionStorage.getItem("signIn");
      const storedCurrencySession = sessionStorage.getItem("currency");
      const storedCurrencyLocal = localStorage.getItem("currency");

      if (storedSignIn) {
        setIsSignedIn(storedSignIn === "true");
      }

      // Use sessionStorage currency first (this is what other parts of the app read),
      // then fallback to localStorage for cross-tab persistence, otherwise default to PKR.
      const initialCurrency =
        storedCurrencySession || storedCurrencyLocal || "PKR";
      // Ensure both storages are in sync
      try {
        sessionStorage.setItem("currency", initialCurrency);
        localStorage.setItem("currency", initialCurrency);
      } catch (e) {
        // ignore storage errors
      }
      setSearchCurrencyCode(initialCurrency);
    }
  }, []);

  const signInFn = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("signIn", "true");
      setIsSignedIn(true);
    }
  };

  const signOutFn = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("signIn", "false");
      setIsSignedIn(false);
    }
  };

  const handleCurrencyChangeFn = (curr_Code) => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("currency", curr_Code);
        localStorage.setItem("currency", curr_Code);
      } catch (e) {
        // ignore storage errors
      }
      setSearchCurrencyCode(curr_Code);
    }
  };

  // Provide consistent values during SSR and initial client render
  const contextValue = {
    signInFn,
    signOutFn,
    isSignedIn: isHydrated ? isSignedIn : null,
    setIsSignedIn,
    username,
    setUsername,
    userId,
    setUserId,
    userGroup,
    setUserGroup,
  searchCurrencyCode,
    setSearchCurrencyCode,
    handleCurrencyChangeFn,
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
