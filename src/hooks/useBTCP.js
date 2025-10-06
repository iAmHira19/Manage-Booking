import getBTCP from "@/services/getBTCP";
import { useEffect, useState } from "react";

const useBTCP = (userID) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        let loc_data = await getBTCP(userID);
        setData(loc_data);
      } catch (error) {
        console.log("error: ", error.message);
      }
    };
    getData();
  }, []);
  return data;
};
export default useBTCP;
