import { fetcher } from "./fetcher";
import dotenv from "dotenv";
dotenv.config();

async function setSavePriorityData(payload) {
  return await fetcher(
    `${process.env.NEXT_PUBLIC_BASE_URI}/api/tpMasterDataService/savePriorityData/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
}
export default setSavePriorityData;
