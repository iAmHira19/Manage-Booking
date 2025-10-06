import { fetcher } from "./fetcher";
import dotenv from "dotenv";
dotenv.config();
const getCustomerSetup = async () => {
  return await fetcher(
    `${process.env.NEXT_PUBLIC_BASE_URI}/api/tpMasterDataService/getCustomerSetup/none`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
export default getCustomerSetup;
