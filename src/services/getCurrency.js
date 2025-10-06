import { fetcher } from "./fetcher";
import dotenv from "dotenv";
dotenv.config();
const getCurrency = async () => {
  return await fetcher(
    `${process.env.NEXT_PUBLIC_BASE_URI}/api/tpMasterDataService/getCurrency/none`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
export default getCurrency;
