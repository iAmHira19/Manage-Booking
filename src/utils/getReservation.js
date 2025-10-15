// import { useState } from "react";
// require("dotenv").config();
// export function useGetReservation() {
//   const URI = process.env.NEXT_PUBLIC_BASE_URI;
//   const [data, setData] = useState(null);
//   const [loadingReservation, setLoadingReservation] = useState(false);
//   const [error, setError] = useState(null);
//   async function GetReservation(payload) {
//     setLoadingReservation(true);
//     try {
//       if (!URI) {
//         throw new Error("Base URI not configured. Set NEXT_PUBLIC_BASE_URI in your environment.");
//       }
//       const response = await fetch(`${URI}/api/tp/getReservation`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//         cache: "no-store",
//       });
//       const text = await response.text();
//       if (!response.ok) {
//         // Surface server-provided error text to caller (with status)
//         throw new Error(`${response.status} ${response.statusText}: ${text || "Failed to fetch"}`);
//       }
//       // Store last successful raw payload for potential debugging/inspection
//       setData(text);
//       return text;
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoadingReservation(false);
//     }
//   }
//   return { data, GetReservation, loadingReservation, error };
// }


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
      if (!URI) {
        throw new Error("Base URI not configured. Set NEXT_PUBLIC_BASE_URI in your environment.");
      }
      const response = await fetch(`${URI}/api/tp/getReservation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const text = await response.text();
      if (!response.ok) {
        // Surface server-provided error text to caller (with status)
        throw new Error(`${response.status} ${response.statusText}: ${text || "Failed to fetch"}`);
      }

      // Parse response as JSON
      let parsedData;
      try {
        parsedData = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse GetReservation response:", parseError, text);
        throw new Error("Invalid JSON response from server: " + text);
      }

      // Store last successful parsed response for debugging
      setData(parsedData);
      return parsedData;
    } catch (error) {
      setError(error.message);
      throw error; // Re-throw to allow caller to handle
    } finally {
      setLoadingReservation(false);
    }
  }

  return { data, GetReservation, loadingReservation, error };
}