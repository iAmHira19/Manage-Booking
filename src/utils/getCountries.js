require("dotenv").config();
export async function getCountries() {
  const URI = process.env.NEXT_PUBLIC_BASE_URI;
  try {
    let response = await fetch(
      `${URI}/api/tpMasterDataService/getCountry/none`,
      {
        method: "GET",
        cache: "force-cache",
      }
    );
    if (!response.ok) {
      throw new Error("Error at the time of fetching data");
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(`Could not fetch countries because of poor connection`);
    return [];
  }
}
