import { fetcher } from "./fetcher";
import dotenv from "dotenv";
dotenv.config();
const setCustomerSetup = async (payload) => {
  return await fetcher(
    `${process.env.NEXT_PUBLIC_BASE_URI}/api/tpMasterDataService/setCustomerSetup`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
};
export default setCustomerSetup;
