import { useState } from "react";
require("dotenv").config();
export function useFlightsReviewData() {
  const URI = process.env.NEXT_PUBLIC_BASE_URI;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function getFlightsReviewData(flightsReviewDataItem) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URI}/api/tp/reviewFlight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flightsReviewDataItem),
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Error at the time of fetching data", response);
      }

      const responseData = await response.json();
      setData(responseData);
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

  return { getFlightsReviewData, loading, error, data };
}
