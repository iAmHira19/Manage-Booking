import { getAllCurrencies } from './currencyMappings';

export async function getCurrency() {
  // First try to use our predefined currency mappings
  try {
    const predefinedCurrencies = getAllCurrencies();
    if (predefinedCurrencies?.length > 0) {
      return predefinedCurrencies;
    }
  } catch (error) {
    console.warn('Failed to load predefined currencies, falling back to API', error);
  }

  // Fallback to API if predefined currencies are not available
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
    const vals = Object.values(payload).filter(v => typeof v === "object");
    if (vals.length > 0) {
      // If the values themselves look like currency objects (have symbol/code/description), return them
      const likelyCurrencyObjects = vals.filter(v => 
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
      console.warn("NEXT_PUBLIC_BASE_URI is not set; using default currency list.");
      return getAllCurrencies();
    }
    
    const url = `${URI}/api/tpMasterDataService/getCurrency/none`;
    const response = await fetch(url, {
      cache: "no-store",
      method: "GET",
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.warn(`Currency API error: ${response.status} - ${errorText}`);
      return getAllCurrencies();
    }
    
    const data = await response.json().catch(() => ({}));
    const currencies = normalizeCurrencyResponse(data);
    
    // If we got valid currencies from API, use them; otherwise fall back to defaults
    return currencies?.length > 0 ? currencies : getAllCurrencies();
    
  } catch (error) {
    // Keep the API error visible in console for debugging, but return default currencies for UI resilience
    console.error('Error in getCurrency:', error);
    return getAllCurrencies();
  }
}
