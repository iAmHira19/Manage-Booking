import { fetcher } from "./fetcher";
require("dotenv").config();
const setCurrency = async (data) => {
  return await fetcher(
    `${process.env.NEXT_PUBLIC_BASE_URI}/api/tpMasterDataService/setCurrency`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
};
export default setCurrency;
