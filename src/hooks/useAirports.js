"use client";
import { useEffect, useState } from "react";
import { getAirports } from "@/services/getAirport";
const useAirports = (criteria) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAirports(criteria);
        setData(res);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return { data, error, loading };
};
export default useAirports;
