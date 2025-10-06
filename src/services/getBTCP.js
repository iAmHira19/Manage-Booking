// B2C Profile
import { fetcher } from "./fetcher";
import dotenv from "dotenv";
dotenv.config();
const getBTCP = async (userID) => {
  return await fetcher(
    `${process.env.NEXT_PUBLIC_BASE_URI}/api/tpMasterDataService/getB2CProfile/${userID}`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
export default getBTCP;
