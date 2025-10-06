import { fetcher } from "./fetcher";

require("dotenv").config();

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export const getAuthenticationResponse = async (email, password) => {
  const Base_URI = process.env.NEXT_PUBLIC_BASE_URI;
  const response = await fetcher(`${Base_URI}/api/tpMasterDataService/signIN`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      usr_Email: email,
      usr_Password: password,
    }),
    cache: "no-store",
  });
  return response;
};
