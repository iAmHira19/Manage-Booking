// "use client";
// require("dotenv").config();
// import { useState } from "react";
// export function useAuthenticateUser() {
//   const URI = process.env.NEXT_PUBLIC_BASE_URI;
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);
//   async function getAuthenticationResponse(email, password) {
//     setLoading(loading);
//     setError(null);
//     try {
//       let response = await fetch(
//         `${URI}/api/tpMasterDataService/signIN/${email},${password}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           cache: "no-store",
//         }
//       );
//       if (!response.ok) throw new Error("Could not fetch data");
//       const data = await response.json();
//       setData(data);
//       return data;
//     } catch (error) {
//       console.log(
//         `Could not fetch data because of poor connection`,
//         error.message
//       );
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }
//   return { getAuthenticationResponse, data, loading, error };
// }
