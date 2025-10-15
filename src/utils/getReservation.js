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
        // Surface server-provided error body if available
        const errorText = (await response.text()).trim();
        throw new Error(errorText || `Reservation request failed (HTTP ${response.status})`);
      }
      // Try to parse JSON; if not JSON, return raw text
      const contentType = response.headers.get("content-type") || "";
      let parsed;
      if (contentType.includes("application/json")) {
        parsed = await response.json();
      } else {
        const text = await response.text();
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { raw: text };
        }
      }
      setData(parsed);
      return parsed;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoadingReservation(false);
    }
  }
  return { data, GetReservation, loadingReservation, error };
}
