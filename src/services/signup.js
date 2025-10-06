import { fetcher } from "./fetcher";
require("dotenv").config();
const getUserSignUp = async (data) => {
  return await fetcher(
    `${process.env.NEXT_PUBLIC_BASE_URI}/api/tpMasterDataService/signUP`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }
  );
};

export default getUserSignUp;
