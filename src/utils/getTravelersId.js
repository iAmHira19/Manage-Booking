import { useState } from "react";
require("dotenv").config();
export function useTravelersID() {
  const URI = process.env.NEXT_PUBLIC_BASE_URI;
  const [loadingTravelersId, setLoadingTravelersId] = useState(false);
  const [error, setError] = useState(null);
  const [travelersIds, setTravelersIds] = useState(null);

  async function getTravelerIds(flightsReviewJson) {
    setLoadingTravelersId(true);
    setError(null);
    try {
      const response = await fetch(`${URI}/api/tp/addTravelers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flightsReviewJson),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Error at the time of fetching data");
      }
      const responseData = await response.json();
      setTravelersIds(responseData);
      return responseData;
    } catch (err) {
      setError(
        err.message || "Could not fetch data because of poor connection"
      );
      console.error(err);
      return [];
    } finally {
      setLoadingTravelersId(false);
    }
  }
  return { getTravelerIds, loadingTravelersId, error, travelersIds };
}
