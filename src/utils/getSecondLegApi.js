import { useState } from "react";
require("dotenv").config();
export function useSecondLegApi() {
  const URI = process.env.NEXT_PUBLIC_BASE_URI;
  const [loadingSecondLeg, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function getSecondLegApi(userData) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URI}/api/tp/searchNextLeg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Error at the time of fetching data");
      }
      const responseData = await response.json();
      setData(responseData);
      return responseData;
    } catch (err) {
      setError(
        err.message || "Could not fetch data because of poor connection"
      );
      return [];
    } finally {
      setLoading(false);
    }
  }

  return { getSecondLegApi, loadingSecondLeg, error, data };
}
