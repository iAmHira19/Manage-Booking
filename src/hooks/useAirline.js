import { getAirline } from "@/services/getAirline";
import { useEffect, useState } from "react";

const useAirline = () => {
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        let resp = await getAirline();
        setData(resp);
      } catch (error) {
        setErr(error.message);
      }
    };
    getData();
  }, []);
  return { data, err };
};

export default useAirline;
