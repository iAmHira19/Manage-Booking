import getCustomerSetup from "@/services/getCustomerSetup";
import { useEffect, useState } from "react";

const useCustomerSetup = () => {
  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        let loc_data = await getCustomerSetup();
        setData(loc_data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);
  return { data };
};

export default useCustomerSetup;
