import { fetcher } from "./fetcher";
require("dotenv").config();

export const getAirline = async () => {
  const Base_URI = process.env.NEXT_PUBLIC_BASE_URI;
  const revalidateInterval = 60 * 5;

  return fetcher(`${Base_URI}/api/tpMasterDataService/getlAirline/none`, {
    next: {
      revalidate: revalidateInterval,
    },
  });
};
