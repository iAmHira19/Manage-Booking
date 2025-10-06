import { fetcher } from "./fetcher";
require("dotenv").config();
const setAirline = async (payload) => {
  return await fetcher(
    `${process.env.NEXT_PUBLIC_BASE_URI}/api/tpMasterDataService/setAirline`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "force-cache",
    }
  );
};
export default setAirline;
