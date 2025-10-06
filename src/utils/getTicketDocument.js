import { useState } from "react";
require("dotenv").config();
export function useTicketDocument() {
  const URI = process.env.NEXT_PUBLIC_BASE_URI;
  const [loadingTicketDocument, setLoadingTicketDocument] = useState(false);
  const [error, setError] = useState(null);
  const [travelersIds, setTravelersIds] = useState(null);

  async function getTicketDocument(payload) {
    setLoadingTicketDocument(true);
    setError(null);
    try {
      const response = await fetch(`${URI}/api/tp/setTicketDocument`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
      setLoadingTicketDocument(false);
    }
  }
  return { getTicketDocument, loadingTicketDocument, error, travelersIds };
}
