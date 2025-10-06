"use client";
require("dotenv").config();
import { useState } from "react";
export function usePriorityApi() {
  const URI = process.env.NEXT_PUBLIC_BASE_URI;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getPriorityApi() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${URI}/api/tpMasterDataService/getPriorityData/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Error at the time of fetching data");
      }

      const responseData = await response.json();
      return responseData;
    } catch (err) {
      setError(
        err.message || "Could not fetch data because of poor connection"
      );
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }

  return { getPriorityApi, loading, error };
}
