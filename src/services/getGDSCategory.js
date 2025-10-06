import { fetcher } from "./fetcher";
import dotenv from "dotenv";
dotenv.config();
export const getGDSCategory = async () => {
  return await fetcher(
    `${process.env.NEXT_PUBLIC_BASE_URI}/api/tpMasterDataService/gdscategory/none`,
    {
      method: "GET",
    }
  );
};
