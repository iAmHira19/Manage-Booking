require("dotenv").config();
export const getCity = async () => {
  const URI = process.env.NEXT_PUBLIC_BASE_URI;
  try {
    const res = await fetch(
      `${URI}/api/tpMasterDataService/getlCountryCity/none`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache",
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error);
    }
    let data = await res.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
};
