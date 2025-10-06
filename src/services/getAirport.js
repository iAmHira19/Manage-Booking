import { fetcher } from "./fetcher";
require("dotenv").config();
export const getAirports = async (criteria) => {
  const Base_URI = process.env.NEXT_PUBLIC_BASE_URI;
  const revalidateInterval = 60 * 5;
  return await fetcher(
    `${Base_URI}/api/tpMasterDataService/getAirport/${criteria}`,
    {
      method: "GET",
      next: {
        revalidate: revalidateInterval,
      },
    }
  );
};
