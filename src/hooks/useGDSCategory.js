import { getGDSCategory } from "@/services/getGDSCategory";
import { useEffect, useState } from "react";

const useGDSCategory = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      let loc_data = await getGDSCategory();
      setData(loc_data);
    };
    fetchData();
  }, []);
  return data;
};

export default useGDSCategory;
