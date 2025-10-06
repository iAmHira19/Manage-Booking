import { useState } from "react";
import { v4 } from "uuid";
require("dotenv").config();
import { useSignInContext } from "@/providers/SignInStateProvider";
export function useOneWayApi() {
  const URI = process.env.NEXT_PUBLIC_BASE_URI;
  const { userId } = useSignInContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function getOneWayApi(userData) {
    setLoading(true);
    setError(null);
    try {
      const userStringData = JSON.stringify(userData);
      const response = await fetch(`${URI}/api/tp/searchFlight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Criteria: userStringData,
          uGUID: v4(),
          UserID: userId,
        }),
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
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }

  return { getOneWayApi, loading, error, data };
}
