import getCurrency from "@/services/getCurrency";
import { useEffect, useState } from "react";

const useCurrencies = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        let loc_data = await getCurrency();
        setData(loc_data);
      } catch (error) {}
    };
    getData();
  }, []);
  return { data };
};

export default useCurrencies;
