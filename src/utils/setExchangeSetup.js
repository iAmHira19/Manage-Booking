"use client";
require("dotenv").config();
import { useState } from "react";

const SetExchangeSetup = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const useSetExchangeSetup = async (CurrExchangeData) => {
    const URI = process.env.NEXT_PUBLIC_BASE_URI;
    try {
      const response = await fetch(
        `${URI}/api/tpMasterDataService/setExchangeSetup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(CurrExchangeData),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching exchange setup:", error);
    } finally {
      setLoading(false);
    }
  };
  return {
    data,
    loading,
    useSetExchangeSetup,
  };
};

export default SetExchangeSetup;
