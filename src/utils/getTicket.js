import { useState } from "react";
require("dotenv").config();
export function useGetTicket() {
  const URI = process.env.NEXT_PUBLIC_BASE_URI;
  const [data, setData] = useState(null);
  const [loadingTicket, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function GetTicket(payload) {
    setLoading(true);
    try {
      const response = await fetch(`${URI}/api/tp/getTicket`, {
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
      setLoading(false);
    }
  }
  return { data, GetTicket, loadingTicket, error };
}
