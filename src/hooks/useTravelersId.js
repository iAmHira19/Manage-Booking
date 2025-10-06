// import { useEffect, useState } from "react";
// import getTravelerIds from "@/services/getTravelersId";
// const useTravelersId = (payload) => {
//   const [data, setData] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         setLoading(true);
//         const res = await getTravelerIds(payload);
//         const resp = JSON.parse(res);
//         setData(resp);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getData();
//   }, []);
//   return { data, error, loading };
// };

// export default useTravelersId;
