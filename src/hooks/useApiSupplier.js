import { getApiSupplier } from "@/services/getApiSupplier";
import { useEffect, useState } from "react";

const useApiSupplier = () => {
  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        let loc_data = await getApiSupplier();
        loc_data = JSON.parse(loc_data);
        setData(loc_data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);
  return { data };
};

export default useApiSupplier;
