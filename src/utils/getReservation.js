import { useState } from "react";
require("dotenv").config();
export function useGetReservation() {
  const URI = process.env.NEXT_PUBLIC_BASE_URI;
  const [data, setData] = useState(null);
  const [loadingReservation, setLoadingReservation] = useState(false);
  const [error, setError] = useState(null);
  async function GetReservation(payload) {
    setLoadingReservation(true);
    try {
      const response = await fetch(`${URI}/api/tp/getReservation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setData(data);
      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingReservation(false);
    }
  }
  return { data, GetReservation, loadingReservation, error };
}
