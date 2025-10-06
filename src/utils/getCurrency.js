export async function getCurrency() {
  // NOTE: This utility runs in the browser (client components). Do not use dotenv here.
  const URI = process.env.NEXT_PUBLIC_BASE_URI || "";

  function normalizeCurrencyResponse(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    // Common shapes: { data: [...] }, { response: [...] }, { Result: [...] }
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.response)) return payload.response;
    if (Array.isArray(payload.Result)) return payload.Result;
    if (Array.isArray(payload.result)) return payload.result;
    // If any top-level property is an array, return it (best-effort)
    for (const v of Object.values(payload)) {
      if (Array.isArray(v)) return v;
    }
    // Handle object-of-objects e.g. { USD: {...}, PKR: {...} }
    const vals = Object.values(payload).filter((v) => typeof v === "object");
    if (vals.length > 0) {
      // If the values themselves look like currency objects (have symbol/code/description), return them
      const likelyCurrencyObjects = vals.filter((v) =>
        v && (v.tpCUR_SYMBOL || v.tpCUR_CODE || v.tpCUR_DESCRIPTION)
      );
      if (likelyCurrencyObjects.length > 0) return likelyCurrencyObjects;
      // Otherwise, if values are objects but not currency-shaped, attempt deep search for arrays
      for (const v of vals) {
        for (const vv of Object.values(v)) {
          if (Array.isArray(vv)) return vv;
        }
      }
    }
    return [];
  }

  try {
    if (!URI) {
      console.warn("NEXT_PUBLIC_BASE_URI is not set; getCurrency will attempt a relative request.");
    }
    const url = `${URI}/api/tpMasterDataService/getCurrency/none`;
    // Avoid stale cached responses for dynamic master data
    let response = await fetch(url, {
      cache: "no-store",
      method: "GET",
    });
    if (!response.ok) {
      // Try to read JSON error for better diagnostics
      let errText = "";
      try {
        const errJson = await response.json();
        errText = JSON.stringify(errJson);
      } catch (e) {
        errText = response.statusText || "HTTP error";
      }
      throw new Error(`Failed to fetch currencies: ${errText}`);
    }
  const data = await response.json();
  const normalized = normalizeCurrencyResponse(data);
  console.debug("getCurrency: fetched and normalized currency count ->", normalized.length);
  return normalized;
  } catch (error) {
    // Keep the API error visible in console for debugging, but return an empty array for UI resilience
    console.error("getCurrency error:", error.message || error);
    return [];
  }
}
